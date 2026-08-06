# ElectroHub
## Project Vision

ElectroHub is a production-ready multi-vendor electronics marketplace built with Next.js, TypeScript, Tailwind CSS, and Supabase.
---

## Project Goal

Build a scalable, secure, and production-ready electronics marketplace that provides a seamless shopping experience for customers, efficient product management for sellers, reliable order fulfillment for delivery partners, and complete administrative control for platform administrators.
---

## User Roles

### Customer
Browse products, manage cart, place orders, make payments, track deliveries, and submit reviews.

### Seller
Manage products, inventory, pricing, orders, and sales analytics.

### Delivery Partner
Accept delivery tasks, verify OTP during delivery, update order status, and view earnings.

### Admin
Manage users, categories, products, orders, sellers, delivery partners, coupons, and platform settings.
---

## Primary Modules

### Authentication
- User Registration
- Login
- Role-Based Access Control
- Password Reset
- Profile Management

### Customer Portal
- Home Page
- Product Catalog
- Product Search & Filters
- Wishlist
- Shopping Cart
- Checkout
- Orders
- Order Tracking
- Reviews

### Seller Portal
- Dashboard
- Product Management
- Inventory Management
- Order Management
- Sales Analytics

### Delivery Portal
- Assigned Deliveries
- Delivery Status Updates
- OTP Verification
- Earnings Dashboard

### Admin Portal
- Dashboard
- User Management
- Category Management
- Brand Management
- Product Management
- Order Management
- Coupon Management
- Reports & Analytics
---

## Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js 16 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| Payments | Razorpay (Test Mode) |
| Version Control | Git & GitHub |
| Deployment | Vercel |
---

## Core Features

- Multi-role authentication (Customer, Seller, Delivery Partner, Admin)
- Product catalog with categories and brands
- Advanced product search and filtering
- Shopping cart and wishlist
- Secure checkout and Razorpay test payments
- Order management and real-time order tracking
- Seller inventory and product management
- Delivery workflow with OTP verification
- Admin dashboard with analytics and user management
- Responsive mobile-first design
---

## High-Level Architecture

```text
Users (Customer / Seller / Delivery Partner / Admin)
                    │
                    ▼
          Next.js Application
        (App Router + TypeScript)
                    │
                    ▼
              Supabase Platform
    ├── Authentication
    ├── PostgreSQL Database
    ├── Storage
    └── Realtime
                    │
                    ▼
                 Vercel
```
