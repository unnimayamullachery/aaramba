# Aaramba - Online Jewellery Store

A full-stack production-ready e-commerce application for an online jewellery store with admin and customer personas.

> ⚠️ **SECURITY NOTICE**: This repository contains **DEMO CREDENTIALS ONLY** for local development. See [SECURITY.md](SECURITY.md) for important security information.

## Features

### Admin Features
- Secure login with JWT authentication
- Add/edit/delete product categories
- Add/edit/delete products with multiple images
- Manage product pricing and discounts
- View all orders and update order status
- Dashboard with analytics (total sales, orders, revenue)
- Role-based access control

### Customer Features
- User registration and login
- Browse products with filters (category, price range, search)
- View detailed product information
- Add products to cart
- Manage cart (update quantity, remove items)
- Checkout and place orders
- View order history and track order status
- Responsive design for mobile and desktop

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: React Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS

## Project Structure

```
aaramba/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── products.js
│   │       ├── categories.js
│   │       ├── cart.js
│   │       └── orders.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── layout.js
│   │   ├── globals.css
│   │   ├── page.js
│   │   ├── login/
│   │   ├── register/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── admin/
│   ├── components/
│   │   └── Navbar.js
│   ├── store/
│   │   ├── store.js
│   │   └── slices/
│   ├── lib/
│   │   └── api.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```
DATABASE_URL="postgresql://user:password@localhost:5432/aaramba"
JWT_SECRET="your-secret-key-here"
NODE_ENV="development"
PORT=5000
ADMIN_EMAIL="admin@aaramba.com"
```

5. Run Prisma migrations:
```bash
npm run prisma:migrate
```

6. Seed the database with sample data:
```bash
npm run prisma:seed
```

7. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

4. Update `.env.local` if needed:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Demo Credentials

> ⚠️ **IMPORTANT**: These are **DEMO CREDENTIALS** for local development only. They are NOT real accounts and are reset every time you run the database seed script.

### Admin Account (Demo)
- **Email**: admin@aaramba.com
- **Password**: admin123

### Customer Account (Demo)
- **Email**: customer@aaramba.com
- **Password**: customer123

**For production**: Create real accounts with strong passwords. Never use these demo credentials in production!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/admin/all` - Get all orders (admin only)
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Database Schema

### Users Table
- id, name, email, password, role, phone, createdAt, updatedAt

### Categories Table
- id, name, slug, createdAt, updatedAt

### Products Table
- id, name, description, price, discount, finalPrice, stock, categoryId, images, sku, featured, createdAt, updatedAt

### Cart Table
- id, userId, productId, quantity, createdAt, updatedAt

### Orders Table
- id, userId, totalAmount, status, shippingAddress, paymentStatus, createdAt, updatedAt

### OrderItems Table
- id, orderId, productId, quantity, priceAtPurchase, createdAt

## Deployment

### Frontend Deployment (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend Deployment (Render/Railway)
1. Push your code to GitHub
2. Connect your repository to Render/Railway
3. Set environment variables
4. Deploy

### Database Deployment (Supabase/Neon)
1. Create a PostgreSQL database on Supabase or Neon
2. Update DATABASE_URL in backend environment variables
3. Run migrations on the deployed database

## Security Features

- JWT-based authentication with HTTP-only cookies
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation with Zod
- CORS configuration
- Helmet for security headers
- Environment variables for sensitive data

## Performance Optimizations

- Pagination for product listings
- Image optimization with Next.js Image component
- Redux for state management
- API request caching
- Lazy loading of components

## Future Enhancements

- Payment gateway integration (Stripe)
- Wishlist functionality
- Product reviews and ratings
- Coupon/discount codes
- Email notifications
- Admin audit logs
- Advanced analytics
- Inventory management

## License

MIT

## Security

See [SECURITY.md](SECURITY.md) for:
- Security best practices
- How to handle environment variables
- What to do if you accidentally commit secrets
- Production security checklist

## Support

For issues or questions, please create an issue in the repository.
