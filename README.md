# Premium Wellness Ecommerce Platform

A complete single-product ecommerce website with a user-facing storefront and admin CMS panel.

## Project Structure

```
ecommerce/
├── frontend/    # Next.js 14 storefront (port 3000)
├── admin/       # Next.js 14 admin panel (port 3001)
└── backend/     # Node.js + Express API (port 5000)
```

## Tech Stack

- **Frontend + Admin**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT (separate tokens for users and admins)
- **Media**: Cloudinary
- **Payments**: Razorpay
- **Email**: Nodemailer

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image/video uploads)
- Razorpay account (for payments)
- Gmail account with App Password (for order emails)

## Installation

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run seed    # Creates admin account + sample data
npm run dev     # Starts on http://localhost:5000
```

### 2. Frontend (Storefront)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev     # Starts on http://localhost:3000
```

### 3. Admin Panel

```bash
cd admin
npm install
cp .env.example .env.local
npm run dev     # Starts on http://localhost:3001
```

## Environment Variables

### Backend (`backend/.env`)

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key
JWT_USER_SECRET=your-user-jwt-secret
JWT_ADMIN_SECRET=your-admin-jwt-secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
EMAIL_USER=
EMAIL_PASS=
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
PORT=5000
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

### Admin (`admin/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Default Admin Credentials

After running `npm run seed`:

- **Email**: admin@example.com
- **Password**: admin123

Change these in your `.env` before seeding.

## Features

### Storefront
- Product landing page with 15 dynamic sections
- Image zoom on hover
- Sticky add-to-cart bar
- Cart drawer with free shipping progress bar
- Checkout with Razorpay/UPI/COD
- Order tracking
- User accounts
- Contact form
- Policy pages (CMS-managed)
- Dynamic fonts & theme from admin

### Admin Panel
- Dashboard with stats
- Product manager
- Pack & offers manager
- Sections/content editor
- Font & theme manager
- Coupon manager
- Review approval workflow
- Video manager (4 slots)
- Enquiry inbox
- Order manager with status updates

## API Routes

Public: `/api/settings/all`, `/api/reviews`, `/api/enquiries`, `/api/orders`, `/api/coupons/validate`, `/api/auth/user/*`

Admin (JWT protected): `/api/admin/*`

## Deployment

### Backend
Deploy to Railway, Render, or any Node.js host. Set all environment variables.

### Frontend & Admin
Deploy to Vercel:
1. Set `NEXT_PUBLIC_API_URL` to your production API URL
2. Deploy each app separately

### MongoDB
Use MongoDB Atlas for production.

### CORS
Update `FRONTEND_URL` and `ADMIN_URL` in backend `.env` to your production URLs.

## Development Notes

- All content is fetched from the API — no hardcoded product data on frontend
- Admin changes reflect immediately on the storefront (refresh page)
- Reviews require admin approval before appearing on site
- Coupon codes are validated server-side at checkout
