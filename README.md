# express-mongoose

A simple **Express + Mongoose** shop demo application with:

- Server-side rendered pages using **EJS**
- **Authentication** (signup/login/logout) with hashed passwords (**bcryptjs**)
- **Sessions stored in MongoDB** (**connect-mongodb-session**)
- **CSRF protection** (**csurf**) and flash messages (**connect-flash**)
- Basic shop flows: list products, product details, cart, create orders, admin product management

---

## Tech stack

- Node.js + Express
- MongoDB + Mongoose
- EJS templates
- express-session + connect-mongodb-session
- csurf (CSRF protection)
- connect-flash (flash messages)

---

## Project structure (high level)

- `app.js` — Express app bootstrap (middleware, sessions, CSRF, routes, DB connect, server listen)
- `routes/` — Express routes
  - `routes/shop.js` — shop pages (products, cart, orders)
  - `routes/admin.js` — admin product CRUD pages (protected)
  - `routes/auth.js` — login/signup/logout
- `controllers/` — route handlers
- `models/` — Mongoose models (`Product`, `User`, `Order`)
- `views/` — EJS templates
- `public/` — static assets (CSS/JS)

---

## Requirements

- Node.js (any modern version should work; project uses Express 4)
- A MongoDB database (Atlas or local MongoDB)

---

## Installation

```bash
git clone https://github.com/irenakrakavetskaya/express-mongoose.git
cd express-mongoose
npm install
```

---

## Running the app

### Development (with nodemon)

```bash
npm start```



The server listens on:

- `http://localhost:3000`

---

## Routes / pages

### Public shop routes

- `GET /` — Home page (product grid)
- `GET /products` — Product list
- `GET /products/:productId` — Product detail page

### Auth routes

- `GET /login` — Login page
- `POST /login` — Login submit
- `GET /signup` — Signup page
- `POST /signup` — Signup submit
- `POST /logout` — Logout

### Cart & Orders (requires login)

- `GET /cart` — View cart
- `POST /cart` — Add a product to cart
- `POST /cart-delete-item` — Remove item from cart
- `POST /create-order` — Create an order from the cart
- `GET /orders` — View your orders

### Admin (requires login)

All routes are mounted under `/admin`:

- `GET /admin/add-product` — Add product form
- `POST /admin/add-product` — Create product
- `GET /admin/products` — Admin products list
- `GET /admin/edit-product/:productId?edit=true` — Edit product form
- `POST /admin/edit-product` — Update product
- `POST /admin/delete-product` — Delete product

---

## Data models (Mongoose)

### Product (`models/product.js`)
Fields:
- `title` (String, required)
- `price` (Number, required)
- `description` (String, required)
- `imageUrl` (String, required)
- `userId` (ObjectId → `User`, required)

### User (`models/user.js`)
Fields:
- `email` (String, required)
- `password` (String, required; hashed with bcrypt)
- `cart.items[]`:
  - `productId` (ObjectId → `Product`)
  - `quantity` (Number)

Instance methods:
- `addToCart(product)`
- `removeFromCart(productId)`
- `clearCart()`

### Order (`models/order.js`)
Fields:
- `products[]`:
  - `product` (Object copy of product doc at ordering time)
  - `quantity` (Number)
- `user`:
  - `email` (String)
  - `userId` (ObjectId → `User`)

---

## Authentication & authorization

- Login state is stored in session (`req.session.isLoggedIn`)
- Logged-in user is stored in session (`req.session.user`)
- On each request, if a user session exists, the app loads the full user from MongoDB and assigns it to `req.user`
- Protected routes use `middleware/is-auth.js`, which redirects unauthenticated users to `/login`

---

## Notes

- Views are rendered with EJS (`app.set('view engine', 'ejs')`)
- Static files are served from `public/`


---

## Scripts

From `package.json`:

- `npm start` — `nodemon app.js`
- `npm run start-server` — `node app.js`

---