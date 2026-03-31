# Cursor Guide (express-mongoose)

## What this project is
An Express.js + EJS storefront with MongoDB (Mongoose) models for `User`, `Product`, and `Order`.

Main features:
- Shop browsing: products list, product details
- Cart + checkout: stores cart items on the `User` document
- Admin CRUD for products
- Login page that sets a simple `loggedIn=true` cookie

## Entry point / runtime
- App entry: `app.js`
- Server start: `app.listen(3000)` is called after `mongoose.connect(...)` succeeds
- Mongo connection: `mongoose.connect(...)` is currently hardcoded in `app.js` (see note below)

## Start the app
1. Install dependencies:
   - `npm install`
2. Run:
   - `npm run start` (uses `nodemon app.js`)
   - or `npm run start-server` (uses `node app.js`)

## Routing map
Routes are wired in `app.js` and implemented via controllers in `controllers/`.

### Shop (mounted at `/`)
Defined in `routes/shop.js`, handled by `controllers/shop.js`:
- `GET /` -> `shopController.getIndex` -> `views/shop/index.ejs`
- `GET /products` -> `shopController.getProducts` -> `views/shop/product-list.ejs`
- `GET /products/:productId` -> `shopController.getProduct` -> `views/shop/product-detail.ejs`
- `GET /cart` -> `shopController.getCart` -> `views/shop/cart.ejs`
- `POST /cart` -> `shopController.postCart` (add item) -> redirects to `/cart`
- `POST /cart-delete-item` -> `shopController.postCartDeleteProduct` -> redirects to `/cart`
- `POST /create-order` -> `shopController.postOrder` -> redirects to `/orders`
- `GET /orders` -> `shopController.getOrders` -> `views/shop/orders.ejs`

### Admin (mounted at `/admin`)
Defined in `routes/admin.js`, handled by `controllers/admin.js`:
- `GET /admin/add-product` -> `getAddProduct` -> `views/admin/edit-product.ejs` (editing=false)
- `POST /admin/add-product` -> `postAddProduct` -> redirects to `/admin/products`
- `GET /admin/products` -> `getProducts` -> `views/admin/products.ejs`
- `GET /admin/edit-product/:productId?edit=...` -> `getEditProduct` -> `views/admin/edit-product.ejs`
- `POST /admin/edit-product` -> `postEditProduct` -> redirects to `/admin/products`
- `POST /admin/delete-product` -> `postDeleteProduct` -> redirects to `/admin/products`

### Auth (mounted at `/`)
Defined in `routes/auth.js`, handled by `controllers/auth.js`:
- `GET /login` -> `getLogin` -> `views/auth/login.ejs`
- `POST /login` -> `postLogin` (sets a cookie) -> redirects to `/`

## Template expectations (EJS)
Most page controllers render EJS templates and pass:
- `pageTitle`: used by `views/includes/head.ejs` for the `<title>`
- `path`: used by `views/includes/navigation.ejs` to highlight the active link
- `isAuthenticated`: used by `views/includes/navigation.ejs` to show/hide admin links

Template includes:
- `views/includes/head.ejs` (basic HTML head + `public/css/main.css`)
- `views/includes/navigation.ejs` (top navigation + `isAuthenticated` gating)
- `views/includes/end.ejs` (closing tags + script include)

## Authentication / “logged in” behavior
Login currently works like this:
- `controllers/auth.js` reads `req.get('Cookie')`, renders `views/auth/login.ejs`, and on POST sets `loggedIn=true`:
  - `res.setHeader('Set-Cookie', 'loggedIn=true');`
- Other controllers reference `req.isLoggedIn` to populate `isAuthenticated` in templates:
  - e.g. `controllers/shop.js`, `controllers/admin.js`, `controllers/error.js`

Important: `req.isLoggedIn` is not defined in `app.js` (based on current code). If you see admin links not appearing, the missing middleware/logic is likely what to update.

## Data models
Defined in `models/`:
- `models/user.js`
  - `name`, `email`
  - `cart.items[]` with `{ productId, quantity }`
  - cart methods:
    - `addToCart(product)`
    - `removeFromCart(productId)`
    - `clearCart()`
- `models/product.js`
  - `title`, `price`, `description`, `imageUrl`, `userId`
- `models/order.js`
  - `products[]` with `{ product, quantity }`
  - `user` snapshot with `{ name, userId }`

## Where to change what
- API/URLs -> `routes/*.js`
- Request logic + rendering -> `controllers/*.js`
- Database structure + methods -> `models/*.js`
- Page UI -> `views/**.ejs`
- Styling -> `public/css/*.css`

## Cursor prompt tips
When asking Cursor to make changes, specify:
- the route/URL you’re targeting (e.g. “Add a new page at `/reports`”)
- which controller should handle it (`routes/*` + `controllers/*`)
- which template should render it (`views/*`)
- what variables the template should receive (`pageTitle`, `path`, `isAuthenticated`, etc.)

When debugging:
- ask Cursor to trace from `app.js` -> `routes/*` -> `controllers/*` -> `views/*`
- ask Cursor to identify where request-scoped variables are set (e.g. `req.user`, `req.isLoggedIn`)

## Security note
The MongoDB connection string is hardcoded in `app.js`. If you add/commit secrets later, prefer moving them to environment variables instead of storing credentials in source control.

