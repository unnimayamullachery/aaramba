# Aaramba - Setup and Run Guide

## Quick Start

This guide will help you set up and run the Aaramba Online Jewellery Store application locally.

## Prerequisites

- Node.js v18 or higher
- PostgreSQL v12 or higher
- npm or yarn

## Installation Complete ✓

Dependencies have been installed for both frontend and backend:
- Backend: 192 packages installed
- Frontend: 437 packages installed

## Database Setup

### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE aaramba;

# Exit psql
\q
```

### 2. Update Database Connection

Edit `backend/.env` and update the DATABASE_URL:

```
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/aaramba"
```

### 3. Run Prisma Migrations

```bash
cd backend
npm run prisma:migrate
```

### 4. Seed Database with Sample Data

```bash
npm run prisma:seed
```

This will create:
- 1 Admin user (admin@aaramba.com / admin123)
- 1 Customer user (customer@aaramba.com / customer123)
- 4 Product categories (Rings, Necklaces, Earrings, Bracelets)
- 6 Sample products with images and discounts

## Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
Server running on port 5000
```

The backend API will be available at: `http://localhost:5000/api`

### Terminal 2: Start Frontend Server

```bash
cd frontend
npm run dev
```

Expected output:
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
```

The frontend will be available at: `http://localhost:3000`

## Access the Application

### Customer Features
- **Home**: http://localhost:3000
- **Products**: http://localhost:3000/products
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Cart**: http://localhost:3000/cart
- **Orders**: http://localhost:3000/orders

### Admin Features
- **Admin Dashboard**: http://localhost:3000/admin
- **Login with**: admin@aaramba.com / admin123

### Demo Credentials

**Admin Account**
- Email: admin@aaramba.com
- Password: admin123

**Customer Account**
- Email: customer@aaramba.com
- Password: customer123

## API Endpoints

### Health Check
- `GET http://localhost:5000/api/health`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products?featured=true` - Get featured products
- `GET /api/products?categoryId=1` - Filter by category
- `GET /api/products?minPrice=1000&maxPrice=20000` - Filter by price
- `GET /api/products?search=ring` - Search products
- `GET /api/products/:id` - Get product details

### Categories
- `GET /api/categories` - Get all categories

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Run `npm install` again if needed

### Frontend won't start
- Check if port 3000 is available
- Verify NEXT_PUBLIC_API_URL in .env.local
- Run `npm install` again if needed
- Clear `.next` folder: `rm -rf .next`

### Database connection error
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists
- Run migrations: `npm run prisma:migrate`

### API calls failing
- Ensure backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in frontend/.env.local
- Check browser console for CORS errors
- Verify JWT token is being sent

## Development Tips

### Backend Development
- Backend runs on `http://localhost:5000`
- API documentation available at `/api/health`
- Use Postman or Insomnia to test API endpoints
- Nodemon auto-reloads on file changes

### Frontend Development
- Frontend runs on `http://localhost:3000`
- Hot reload enabled for React components
- Redux DevTools available in browser
- Tailwind CSS classes auto-complete in editor

## Building for Production

### Backend Build
```bash
cd backend
npm run start
```

### Frontend Build
```bash
cd frontend
npm run build
npm run start
```

## Next Steps

1. Set up PostgreSQL database
2. Update DATABASE_URL in backend/.env
3. Run Prisma migrations
4. Seed the database
5. Start backend server
6. Start frontend server
7. Open http://localhost:3000 in browser
8. Login with demo credentials

## Support

For issues or questions, refer to the main README.md file or check the GitHub repository.

Happy coding! 🎉