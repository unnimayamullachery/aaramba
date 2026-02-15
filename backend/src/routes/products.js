const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyAdmin } = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  discount: z.number().min(0).max(100).optional().default(0),
  stock: z.number().int().positive(),
  categoryId: z.number().int().positive(),
  images: z.array(z.string()).optional().default([]),
  sku: z.string().min(2),
  featured: z.boolean().optional().default(false),
});

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { categoryId, minPrice, maxPrice, featured, search, page = 1, limit = 10 } = req.query;

    const where = {};
    if (categoryId) where.categoryId = parseInt(categoryId);
    if (featured === 'true') where.featured = true;
    if (minPrice || maxPrice) {
      where.finalPrice = {};
      if (minPrice) where.finalPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.finalPrice.lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await prisma.product.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: { category: true },
    });

    const total = await prisma.product.count({ where });

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const data = productSchema.parse(req.body);
    const finalPrice = data.price - (data.price * data.discount) / 100;

    const product = await prisma.product.create({
      data: {
        ...data,
        finalPrice,
      },
      include: { category: true },
    });

    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update product (admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const data = productSchema.partial().parse(req.body);
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const price = data.price || product.price;
    const discount = data.discount !== undefined ? data.discount : product.discount;
    const finalPrice = price - (price * discount) / 100;

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...data,
        finalPrice,
      },
      include: { category: true },
    });

    res.json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;