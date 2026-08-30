# 🛒 MyStore — E-Commerce Frontend

A full-featured **E-Commerce web application frontend** built with **Angular 20**, **TypeScript**, **RxJS**, and a REST API backend. The application provides customer shopping functionality, account management, address management, order history, and product administration.

## 🌐 Live Demo

### 👉 [Open MyStore](https://ecommerce-client-pros12345s-projects.vercel.app)

The frontend is deployed on **Vercel** and connects to the production Spring Boot backend.

**Production API Base URL**

```text
https://ecommerce-server-production-b652.up.railway.app/api
```

---

## ✨ Key Features

### 👤 Authentication & Account

- User registration
- Login using **email or mobile number**
- JWT-based authentication
- Automatic JWT attachment using an HTTP interceptor
- Protected routes using Angular route guards
- Session-expiry handling on HTTP `401`
- Manage profile information
- Change password
- Delete account

### 🛍️ Product & Shopping

- Product listing
- Product details
- Product image display
- Shopping cart
- Increase/decrease cart quantity
- Remove items from cart
- Checkout flow
- Address selection during checkout
- Order placement
- Order history
- Order cancellation

### 🏠 Address Management

- View saved addresses
- Add new address
- Edit address
- Delete address
- Select an address during checkout

### 🛠️ Product Administration

- Add products
- Upload multiple product images
- Edit products
- Add/remove product images
- Delete products
- Admin-only user management page

### 🎨 UI / UX

- Responsive e-commerce interface
- Form validation
- User-friendly success/error notifications
- SweetAlert2 notifications
- Separate customer and administration functionality

---

## 🧰 Tech Stack

| Technology | Usage |
|---|---|
| **Angular 20** | Frontend framework |
| **TypeScript 5.9** | Application development |
| **RxJS 7.8** | Reactive programming / HTTP streams |
| **Angular Router** | SPA navigation and route protection |
| **Angular HttpClient** | REST API integration |
| **SweetAlert2** | Alerts and notifications |
| **HTML5 / SCSS** | UI structure and styling |
| **Node.js 20** | Build/runtime environment |
| **Nginx** | Production static-file server |
| **Docker** | Containerized frontend deployment |
| **Vercel** | Live frontend deployment |

---

## 🏗️ Frontend Architecture

```text
                    ┌──────────────────────────────┐
                    │        Angular 20 UI         │
                    │                              │
                    │ Home / Products / Cart       │
                    │ Login / Register / Profile   │
                    │ Orders / Addresses / Admin   │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │       Angular Services       │
                    │                              │
                    │ Product / Cart / Order       │
                    │ Address / Profile / Auth     │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │     HTTP Interceptor         │
                    │  Authorization: Bearer JWT   │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │ Spring Boot REST API         │
                    │ ecommerce-server             │
                    └──────────────────────────────┘
```

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── components/
│   │   ├── add-product.component/
│   │   ├── address/
│   │   ├── admin-users.component/
│   │   ├── cart.component/
│   │   ├── confirm-order.component/
│   │   ├── edit-product.component/
│   │   ├── home.component/
│   │   ├── login.component/
│   │   ├── manage-account.component/
│   │   ├── navbar.component/
│   │   ├── product-detail.component/
│   │   ├── profile.component/
│   │   ├── register.component/
│   │   └── saved-address.component/
│   │
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── admin.guard.ts
│   │
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   │
│   ├── model/
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.ts
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
├── assets/
├── main.ts
└── styles.scss
```

---

## 🔐 Authentication Flow

The application uses JWT authentication.

```text
User Login
    │
    ▼
POST /api/auth/login
    │
    ▼
Spring Boot validates credentials
    │
    ▼
JWT returned to Angular
    │
    ▼
JWT stored in browser storage
    │
    ▼
Angular HTTP Interceptor
    │
    ▼
Authorization: Bearer <JWT>
    │
    ▼
Protected backend API
```

If the backend returns `401 Unauthorized`, the interceptor clears authentication data and redirects the user to the login page.

---

## 🛡️ Route Protection

The application contains two types of route protection:

### Authenticated Routes

Examples:

```text
/cart
/profile
/manage-account
/checkout-address
/confirm-order
/saved-address
/edit-address/:id
/my-orders
```

These routes use `authGuard`.

### Admin Route

```text
/admin/users
```

This route uses `adminGuard` and verifies that the current user satisfies the application's admin authorization rule.

---

## 🔗 Important Routes

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/login` | Login |
| `/register` | Registration |
| `/product/:id` | Product details |
| `/cart` | Shopping cart |
| `/profile` | User profile |
| `/manage-account` | Account management |
| `/saved-address` | Saved addresses |
| `/my-orders` | Order history |
| `/checkout-address` | Checkout address |
| `/confirm-order` | Confirm order |
| `/addProduct` | Add product |
| `/editProduct/:id` | Edit product |
| `/admin/users` | Admin user management |

---

## ⚙️ Environment Configuration

### Development

`src/environments/environment.ts`

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
  imageBaseUrl: 'http://localhost:8080/api/images/'
};
```

### Production

`src/environments/environment.prod.ts`

```ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://ecommerce-server-production-b652.up.railway.app/api',
  imageBaseUrl: 'https://ecommerce-server-production-b652.up.railway.app/api/images/'
};
```

---

## ▶️ Run Locally

### Prerequisites

- Node.js 20+
- npm
- Angular CLI 20
- Running Spring Boot backend

### 1. Clone the repository

```bash
git clone <your-client-repository-url>
cd ecommerce_client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the backend URL

For local development:

```ts
apiBaseUrl: 'http://localhost:8080/api'
```

### 4. Start Angular

```bash
npm start
```

or:

```bash
ng serve
```

### 5. Open the application

```text
http://localhost:4200
```

---

## 🐳 Docker

The project includes a multi-stage Dockerfile.

### Build

```bash
docker build --no-cache -t ecommerce-client:latest .
```

### Run

```bash
docker run -p 4200:80 ecommerce-client:latest
```

The Angular application is built in a Node.js container and served using Nginx.

---

# 📸 Application Screenshots

## 1. Create Account

The registration screen allows a new customer to create an account with name, email, mobile number, password, and confirmation password.

![Create Account](screenshots/01-register.png)

---

## 2. Login

Customers can log in using their email address or mobile number.

![Login](screenshots/02-login.png)

---

## 3. Add New Product

Product administrators can create products and upload multiple images.

![Add Product](screenshots/03-add-product.png)

---

## 4. Shopping Cart

The cart displays products, quantities, prices, delivery charges, and the final order amount.

![Shopping Cart](screenshots/04-cart.png)

---

## 5. Saved Addresses

Customers can manage saved delivery addresses.

![Saved Addresses](screenshots/05-saved-addresses.png)

---

## 6. Order History

Customers can view previously placed orders, item details, prices, totals, and order status.

![Order History](screenshots/06-orders.png)

---

## 7. Manage My Account

Customers can update profile information, change their password, and delete their account.

![Manage Account](screenshots/07-manage-account.png)

---

## 🧪 Testing

The project contains Angular/Jasmine test specifications for application components.

Run tests with:

```bash
npm test
```

---

## 📌 Production Deployment

The frontend is configured for production builds:

```bash
ng build --configuration production
```

The Dockerfile uses:

```text
Node.js → Angular production build → Nginx
```

The live frontend is deployed at:

**https://ecommerce-client-pros12345s-projects.vercel.app**

---

## 👨‍💻 Author

**Prosenjit Chakrabortty**

Java Backend / Full Stack Developer

**Core Skills:** Java, Spring Boot, Microservices, Angular, REST APIs, JPA/Hibernate, SQL, Docker

---

## 📄 Related Project

This frontend consumes REST APIs exposed by the Spring Boot backend.

See the backend README for API, security, database, Docker, and server-side architecture details.
