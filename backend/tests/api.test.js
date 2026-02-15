/**
 * API Tests for Aaramba Backend
 * Run with: npm test
 */

const request = require('supertest');
const app = require('../src/index');

describe('Aaramba API Tests', () => {
  let authToken;
  let userId;
  let productId;
  let cartItemId;
  let orderId;

  // Test Authentication
  describe('Authentication', () => {
    test('POST /api/auth/register - Should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          phone: '9876543210',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    test('POST /api/auth/login - Should login user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      authToken = response.body.token;
      userId = response.body.user.id;
    });

    test('POST /api/auth/login - Should fail with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test Products
  describe('Products', () => {
    test('GET /api/products - Should get all products', async () => {
      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('pagination');
    });

    test('GET /api/products?featured=true - Should get featured products', async () => {
      const response = await request(app)
        .get('/api/products?featured=true');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.products)).toBe(true);
    });

    test('GET /api/products?search=ring - Should search products', async () => {
      const response = await request(app)
        .get('/api/products?search=ring');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('products');
    });

    test('GET /api/products/:id - Should get product by ID', async () => {
      const response = await request(app)
        .get('/api/products/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      productId = response.body.id;
    });
  });

  // Test Categories
  describe('Categories', () => {
    test('GET /api/categories - Should get all categories', async () => {
      const response = await request(app)
        .get('/api/categories');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/categories/:id - Should get category by ID', async () => {
      const response = await request(app)
        .get('/api/categories/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
    });
  });

  // Test Cart
  describe('Cart', () => {
    test('POST /api/cart - Should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: productId,
          quantity: 2,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      cartItemId = response.body.id;
    });

    test('GET /api/cart - Should get user cart', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('PUT /api/cart/:id - Should update cart item', async () => {
      const response = await request(app)
        .put(`/api/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 3,
        });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(3);
    });
  });

  // Test Orders
  describe('Orders', () => {
    test('POST /api/orders - Should create order', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          shippingAddress: '123 Main St, City, State 12345',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('totalAmount');
      orderId = response.body.id;
    });

    test('GET /api/orders - Should get user orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/orders/:id - Should get order by ID', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(orderId);
    });
  });

  // Test Health Check
  describe('Health Check', () => {
    test('GET /api/health - Should return OK', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });
});