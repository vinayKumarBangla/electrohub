# ElectroHub ER Diagram

## Step 1 – Identify Entities

1. Profiles (Users)
2. Addresses
3. Categories
4. Brands
5. Products
6. Product Images
7. Inventory
8. Cart
9. Wishlist
10. Orders
11. Order Items
12. Payments
13. Coupons
14. Reviews
15. Delivery Tasks
16. Order Status History
17. Notifications

---

## Core Entities

The following are the primary entities of the ElectroHub system:

- Profiles
- Products
- Orders
- Categories
- Brands

These entities form the foundation of the database. Most other entities are related to or dependent on them.
---

## Main Relationships

### One-to-Many

- One Profile → Many Addresses
- One Category → Many Products
- One Brand → Many Products
- One Profile (Seller) → Many Products
- One Profile (Customer) → Many Orders
- One Order → Many Order Items
- One Product → Many Reviews
- One Order → Many Status History Records

### Many-to-Many

- Products ↔ Orders (through Order Items)
- Products ↔ Wishlists
- Products ↔ Cart

---

## Entity Responsibilities

### Profiles
Stores all platform users including Customers, Sellers, Delivery Partners, and Admins.

### Products
Stores all electronic products available for sale.

### Categories
Organizes products into logical groups.

### Brands
Stores product manufacturers such as Apple, Samsung, Sony, Dell, HP, etc.

### Orders
Stores customer purchase orders.

### Order Items
Stores individual products belonging to an order.

### Payments
Stores payment details and payment status.

### Reviews
Stores ratings and reviews submitted by customers.

### Cart
Stores products added to a customer's shopping cart.

### Wishlist
Stores products saved for future purchase.

### Inventory
Tracks available stock for seller products.

### Delivery Tasks
Stores delivery assignments for delivery partners.

### Order Status History
Stores every order status change with timestamps.

### Notifications
Stores notifications sent to users.

### Product Images
Stores multiple images for each product.

### Addresses
Stores customer delivery addresses.

### Coupons
Stores promotional discount codes.