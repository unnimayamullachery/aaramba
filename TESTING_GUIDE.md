# Aaramba - Testing Guide

## Manual Testing Checklist

This guide provides step-by-step instructions to manually test all features of the Aaramba application.

---

## Prerequisites

Before testing, ensure:
1. PostgreSQL is running
2. Backend is running on `http://localhost:5000`
3. Frontend is running on `http://localhost:3000`
4. Database is seeded with sample data

---

## 1. Authentication Testing

### 1.1 User Registration
- [ ] Navigate to `http://localhost:3000/register`
- [ ] Fill in the registration form:
  - Name: "Test Customer"
  - Email: "testcustomer@example.com"
  - Phone: "9876543210"
  - Password: "password123"
- [ ] Click "Register"
- [ ] Verify redirect to home page
- [ ] Verify user is logged in (check navbar)

### 1.2 User Login
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Login with demo credentials:
  - Email: "customer@aaramba.com"
  - Password: "customer123"
- [ ] Verify redirect to home page
- [ ] Verify user name appears in navbar

### 1.3 Admin Login
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Login with admin credentials:
  - Email: "admin@aaramba.com"
  - Password: "admin123"
- [ ] Verify "Admin" link appears in navbar
- [ ] Verify redirect to home page

### 1.4 Logout
- [ ] Click logout button in navbar
- [ ] Verify redirect to home page
- [ ] Verify login/register buttons appear in navbar

---

## 2. Product Browsing Testing

### 2.1 Home Page
- [ ] Navigate to `http://localhost:3000`
- [ ] Verify featured products are displayed
- [ ] Verify product cards show:
  - Product image
  - Product name
  - Product description
  - Price and discount (if applicable)
- [ ] Click "Shop Now" button
- [ ] Verify redirect to products page

### 2.2 Products Listing
- [ ] Navigate to `http://localhost:3000/products`
- [ ] Verify all products are displayed
- [ ] Verify pagination works (if more than 12 products)

### 2.3 Product Filtering
- [ ] Test category filter:
  - [ ] Select "Rings" category
  - [ ] Verify only ring products are shown
  - [ ] Select "Necklaces" category
  - [ ] Verify only necklace products are shown
  
- [ ] Test price range filter:
  - [ ] Set min price: 5000
  - [ ] Set max price: 15000
  - [ ] Verify only products in range are shown
  
- [ ] Test search:
  - [ ] Search for "diamond"
  - [ ] Verify matching products are shown
  - [ ] Search for "gold"
  - [ ] Verify matching products are shown

- [ ] Test reset filters:
  - [ ] Click "Reset Filters"
  - [ ] Verify all products are shown again

### 2.4 Product Details
- [ ] Click on any product
- [ ] Verify product detail page shows:
  - [ ] Product name
  - [ ] Product description
  - [ ] Product price
  - [ ] Discount percentage (if applicable)
  - [ ] Stock status
  - [ ] Quantity selector
  - [ ] "Add to Cart" button

---

## 3. Shopping Cart Testing

### 3.1 Add to Cart
- [ ] On product detail page, set quantity to 2
- [ ] Click "Add to Cart"
- [ ] Verify success toast notification
- [ ] Verify cart counter in navbar increases
- [ ] Navigate to cart page
- [ ] Verify product is in cart with correct quantity

### 3.2 Update Cart Quantity
- [ ] On cart page, increase quantity to 3
- [ ] Verify total price updates
- [ ] Decrease quantity to 1
- [ ] Verify total price updates

### 3.3 Remove from Cart
- [ ] Click remove button on cart item
- [ ] Verify item is removed from cart
- [ ] Verify cart counter updates

### 3.4 Empty Cart
- [ ] Remove all items from cart
- [ ] Verify "Your cart is empty" message appears
- [ ] Verify "Continue Shopping" button is available

---

## 4. Checkout & Orders Testing

### 4.1 Checkout Process
- [ ] Add product to cart
- [ ] Navigate to cart page
- [ ] Enter shipping address: "123 Main St, City, State 12345"
- [ ] Click "Proceed to Checkout"
- [ ] Verify order is created
- [ ] Verify redirect to order detail page

### 4.2 Order Details
- [ ] Verify order ID is displayed
- [ ] Verify order items are listed
- [ ] Verify order total is correct
- [ ] Verify order status is "Pending"
- [ ] Verify shipping address is displayed

### 4.3 Order History
- [ ] Navigate to `http://localhost:3000/orders`
- [ ] Verify all user orders are listed
- [ ] Verify order information is correct:
  - [ ] Order ID
  - [ ] Order date
  - [ ] Order total
  - [ ] Order status
  - [ ] Items in order

---

## 5. Admin Dashboard Testing

### 5.1 Admin Access
- [ ] Login as admin (admin@aaramba.com / admin123)
- [ ] Click "Admin" in navbar
- [ ] Verify admin dashboard loads

### 5.2 Dashboard Analytics
- [ ] Verify dashboard displays:
  - [ ] Total Orders count
  - [ ] Total Products count
  - [ ] Total Revenue
- [ ] Verify recent orders table is displayed

### 5.3 Admin Features
- [ ] Verify "Manage Products" link is available
- [ ] Verify "Manage Categories" link is available
- [ ] Verify "Manage Orders" link is available

---

## 6. API Testing (Using Postman/Insomnia)

### 6.1 Health Check
```
GET http://localhost:5000/api/health
Expected: { "status": "OK" }
```

### 6.2 Authentication
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "customer@aaramba.com",
  "password": "customer123"
}
Expected: 200 OK with token
```

### 6.3 Products
```
GET http://localhost:5000/api/products
Expected: 200 OK with products array

GET http://localhost:5000/api/products?featured=true
Expected: 200 OK with featured products

GET http://localhost:5000/api/products/1
Expected: 200 OK with product details
```

### 6.4 Categories
```
GET http://localhost:5000/api/categories
Expected: 200 OK with categories array
```

### 6.5 Cart (Requires Auth Token)
```
GET http://localhost:5000/api/cart
Headers: Authorization: Bearer {token}
Expected: 200 OK with cart items
```

### 6.6 Orders (Requires Auth Token)
```
GET http://localhost:5000/api/orders
Headers: Authorization: Bearer {token}
Expected: 200 OK with orders array
```

---

## 7. Responsive Design Testing

### 7.1 Mobile View
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test on iPhone 12 (390x844)
- [ ] Verify all elements are visible
- [ ] Verify navigation works
- [ ] Verify forms are usable

### 7.2 Tablet View
- [ ] Test on iPad (768x1024)
- [ ] Verify layout is appropriate
- [ ] Verify all features work

### 7.3 Desktop View
- [ ] Test on 1920x1080
- [ ] Verify layout is optimal
- [ ] Verify all features work

---

## 8. Error Handling Testing

### 8.1 Invalid Login
- [ ] Try login with wrong email
- [ ] Verify error message appears
- [ ] Try login with wrong password
- [ ] Verify error message appears

### 8.2 Duplicate Registration
- [ ] Try registering with existing email
- [ ] Verify error message appears

### 8.3 Invalid Cart Operations
- [ ] Try adding more items than stock
- [ ] Verify error message appears

### 8.4 Unauthorized Access
- [ ] Try accessing admin page without login
- [ ] Verify redirect to home page
- [ ] Try accessing admin page as customer
- [ ] Verify redirect to home page

---

## 9. Performance Testing

### 9.1 Page Load Times
- [ ] Measure home page load time: _____ ms
- [ ] Measure products page load time: _____ ms
- [ ] Measure product detail page load time: _____ ms

### 9.2 API Response Times
- [ ] Measure GET /api/products response time: _____ ms
- [ ] Measure GET /api/categories response time: _____ ms

---

## 10. Browser Compatibility Testing

- [ ] Chrome (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Edge (Latest)

---

## Test Results Summary

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✓/✗ | |
| User Login | ✓/✗ | |
| Product Browsing | ✓/✗ | |
| Product Filtering | ✓/✗ | |
| Shopping Cart | ✓/✗ | |
| Checkout | ✓/✗ | |
| Order Tracking | ✓/✗ | |
| Admin Dashboard | ✓/✗ | |
| API Endpoints | ✓/✗ | |
| Responsive Design | ✓/✗ | |
| Error Handling | ✓/✗ | |

---

## Known Issues

(Document any issues found during testing)

---

## Recommendations

(Document any improvements or optimizations needed)

---

## Sign-off

Tested by: _______________
Date: _______________
Status: ✓ PASSED / ✗ FAILED