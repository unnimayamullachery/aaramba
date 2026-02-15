const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();

const orderSchema = z.object({
  shippingAddress: z.string().min(10),
});

const orderStatusSchema = z.object({
  status: z.enum(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']),
});

// Get user's orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (admin only)
router.get('/admin/all', verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await prisma.order.findMany({
      skip,
      take: parseInt(limit),
      include: {
        user: true,
        orderItems: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.order.count();

    res.json({
      orders,
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

// Get order by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { shippingAddress } = orderSchema.parse(req.body);

    const cartItems = await prisma.cart.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const cartItem of cartItems) {
      const priceAtPurchase = cartItem.product.finalPrice;
      totalAmount += priceAtPurchase * cartItem.quantity;

      orderItemsData.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        priceAtPurchase,
      });

      // Reduce stock
      await prisma.product.update({
        where: { id: cartItem.productId },
        data: { stock: { decrement: cartItem.quantity } },
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        shippingAddress,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    // Clear cart
    await prisma.cart.deleteMany({
      where: { userId: req.user.id },
    });

    res.status(201).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = orderStatusSchema.parse(req.body);

    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    res.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;