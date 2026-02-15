const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyAdmin } = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { products: true },
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create category (admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, slug } = categorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: { name, slug },
    });

    res.status(201).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update category (admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, slug } = categorySchema.parse(req.body);

    const category = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data: { name, slug },
    });

    res.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete category (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;