const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();
const prisma = new PrismaClient();

const cartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

// Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await prisma.cart.findMany({
      where: { userId: req.user.id },
      include: { product: { include: { category: true } } },
    });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = cartSchema.parse(req.body);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId,
        },
      },
    });

    let cartItem;
    if (existingCartItem) {
      cartItem = await prisma.cart.update({
        where: {
          userId_productId: {
            userId: req.user.id,
            productId,
          },
        },
        data: { quantity: existingCartItem.quantity + quantity },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cart.create({
        data: {
          userId: req.user.id,
          productId,
          quantity,
        },
        include: { product: true },
      });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update cart item
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { quantity } = z.object({ quantity: z.number().int().positive() }).parse(req.body);

    const cartItem = await prisma.cart.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!cartItem || cartItem.userId !== req.user.id) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const product = await prisma.product.findUnique({
      where: { id: cartItem.productId },
    });

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const updatedCartItem = await prisma.cart.update({
      where: { id: parseInt(req.params.id) },
      data: { quantity },
      include: { product: true },
    });

    res.json(updatedCartItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

// Remove from cart
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const cartItem = await prisma.cart.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!cartItem || cartItem.userId !== req.user.id) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cart.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;