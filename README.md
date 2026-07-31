# 🛒 E-Commerce Frontend Application

A modern and responsive **E-Commerce Frontend Application** built using **Angular**, designed to consume REST APIs from the backend and provide a seamless user experience.

---

## 📌 Features

- User Login & Registration
- Product Listing & Search
- Product Details Page
- Shopping Cart Management
- Order Placement
- Responsive UI
- API Integration with Backend
- Form Validation & Error Handling

---

## 🛠️ Tech Stack

**Frontend**
- Angular 14+
- TypeScript
- HTML5
- CSS3 / SCSS
- Bootstrap / Angular Material

**Tools**
- Node.js
- npm
- Angular CLI
- VS Code
- Git

---

## 🧱 Project Structure

```
src/
 ├── app/
 │    ├── components/
 │    ├── services/
 │    ├── models/
 │    ├── guards/
 │    ├── interceptors/
 │    └── app.module.ts
 │
 ├── assets/
 ├── environments/
 │    ├── environment.ts
 │    └── environment.prod.ts
 │
 └── index.html
```

---

## ⚙️ Configuration

Update backend API URL in `environment.ts`:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

---

## ▶️ How to Run the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   ng serve
   ```

3. Open browser:
   ```
   http://localhost:4200
   ```

---

## 🔐 Authentication

- JWT token stored securely
- HTTP Interceptor for Authorization header
- Route Guards for protected routes

---

## 📦 Build for Production

```bash
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

---

## 🧪 Future Enhancements

- Payment Gateway UI
- Admin Dashboard
- Wishlist Feature
- SEO Optimization
- PWA Support

---

## 👨‍💻 Author

**Prosenjit Chakrabortty**  
Java Backend / Full Stack Developer  
4+ years of experience in Java, Spring Boot, Angular, Microservices

📧 Email: prosenjitmaigram@gmail.com

🔗 LinkedIn: https://www.linkedin.com/in/prosenjit98

---

## ⭐ Support

If you find this project useful, please ⭐ the repository!
