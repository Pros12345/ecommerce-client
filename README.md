# 🚀 MyStore — E-Commerce Backend

A secure and production-oriented **E-Commerce REST API backend** built using **Java 17**, **Spring Boot 3.5.5**, **Spring Security**, **JWT**, **Spring Data JPA/Hibernate**, and **MySQL**.

The backend provides authentication, user profile management, product management, product image storage/retrieval, shopping orders, saved addresses, and administrative user operations for the Angular frontend.

---

## 🌐 Live Application

### 👉 [Open MyStore Frontend](https://ecommerce-client-pros12345s-projects.vercel.app)

**Production backend API:**

```text
https://ecommerce-server-production-b652.up.railway.app/api
```

The Angular frontend is deployed on Vercel and the Spring Boot backend is configured for production deployment using the Railway environment.

---

## ✨ Key Features

### 🔐 Authentication & Security

- User registration
- Login using email or mobile number
- JWT token generation
- JWT request authentication filter
- BCrypt password hashing
- Protected REST endpoints
- CORS configuration
- Automatic handling of invalid/expired JWT requests

### 👤 User Management

- User profile retrieval
- Profile update
- Password change
- Account deletion
- Saved address CRUD
- Admin user listing
- Admin user deletion

### 🛍️ Product Management

- Create products
- Read products
- Read product by ID
- Update products
- Soft/delete product operations
- Permanent product deletion
- Multiple image upload
- Image retrieval through REST endpoint
- Image replacement/removal during product update

### 🛒 Order Management

- Create orders
- View current user's orders
- Cancel orders
- Delete orders
- Order items and pricing information
- Delivery address association

### 🧱 Application Design

- Layered architecture
- Controller → Service → Repository separation
- DTOs for request/response models
- JPA entities
- Repository implementations for custom persistence operations
- Centralized exception handling
- Bean validation

---

## 🧰 Tech Stack

| Technology | Usage |
|---|---|
| **Java 17** | Backend language |
| **Spring Boot 3.5.5** | Application framework |
| **Spring Web** | REST APIs |
| **Spring Security** | Authentication and authorization |
| **JWT / JJWT 0.11.5** | Token-based authentication |
| **Spring Data JPA** | Persistence |
| **Hibernate** | ORM |
| **MySQL** | Relational database |
| **Lombok** | Boilerplate reduction |
| **Maven** | Build/dependency management |
| **Docker** | Containerization |
| **Railway** | Production backend deployment |

---

## 🏗️ Backend Architecture

```text
                         Angular Frontend
                                │
                                │ HTTP / JSON
                                ▼
                    ┌─────────────────────────┐
                    │    Spring Boot API      │
                    │                         │
                    │ Controllers             │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       Service Layer     │
                    │                         │
                    │ Business Logic           │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Repository Layer    │
                    │                         │
                    │ JPA + Custom Repository │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       MySQL Database    │
                    └─────────────────────────┘


       JWT Request
           │
           ▼
   JwtAuthenticationFilter
           │
           ▼
    JwtUtil validates token
           │
           ▼
    Spring Security Context
           │
           ▼
       Controller
```

---

## 📂 Project Structure

```text
src/main/java/eCommerse/
│
├── controller/
│   ├── AddressController.java
│   ├── AdminUserController.java
│   ├── OrderController.java
│   ├── ProductController.java
│   ├── ProductDisplayController.java
│   ├── UserController.java
│   └── UserProfileController.java
│
├── dto/
│   ├── AddressRequest.java
│   ├── AddressResponse.java
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   ├── OrderRequest.java
│   ├── OrderResponse.java
│   ├── UpdateProfileRequest.java
│   └── ...
│
├── entity/
│   ├── Address.java
│   ├── Order.java
│   ├── OrderItem.java
│   ├── Product.java
│   ├── ProductImage.java
│   └── User.java
│
├── exception/
│   └── GlobalExceptionHandler.java
│
├── repository/
│   ├── AddressRepository.java
│   ├── OrderRepository.java
│   ├── OrderItemRepository.java
│   ├── ProductsRepository.java
│   ├── ProductsDisplayRepository.java
│   ├── UserRepository.java
│   └── impl/
│
├── security/
│   ├── AuthController.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtUtil.java
│   └── SecurityConfig.java
│
└── service/
    ├── AddressService.java
    ├── AdminUserService.java
    ├── OrderService.java
    ├── ProductsDisplayService.java
    ├── ProductsService.java
    ├── UserService.java
    └── impl/
```

---

# 🔗 REST API Endpoints

The API base path is:

```text
/api
```

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login using email/mobile and password |
| `POST` | `/api/users/register` | Register a new user |

## Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/productsDisplay` | Get all products |
| `GET` | `/api/products/{id}` | Get product by ID |
| `POST` | `/api/products` | Create product with images |
| `PUT` | `/api/products/{id}` | Update product/images |
| `DELETE` | `/api/products/{id}` | Delete product |
| `DELETE` | `/api/products/permanent/{id}` | Permanently delete product |
| `GET` | `/api/images/{id}` | Retrieve product image |

## Orders

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Create order |
| `GET` | `/api/orders/my-orders` | Get logged-in user's orders |
| `PUT` | `/api/orders/{orderId}/cancel` | Cancel order |
| `DELETE` | `/api/orders/{orderId}` | Delete order |

## Addresses

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/user/addresses` | Get saved addresses |
| `GET` | `/api/user/addresses/{addressId}` | Get address |
| `POST` | `/api/user/addresses` | Create address |
| `PUT` | `/api/user/addresses/{addressId}` | Update address |
| `DELETE` | `/api/user/addresses/{addressId}` | Delete address |

## Profile

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/user/profile` | Get current profile |
| `PUT` | `/api/user/profile` | Update profile |
| `PUT` | `/api/user/change-password` | Change password |
| `DELETE` | `/api/user/profile` | Delete current account |

## Administration

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/users` | Get users for administration |
| `DELETE` | `/api/admin/users/{userId}` | Delete an admin-managed user |

---

## 🔐 JWT Authentication

The authentication flow is:

```text
POST /api/auth/login
        │
        ▼
Validate email/mobile + password
        │
        ▼
Generate JWT
        │
        ▼
Return token to Angular
        │
        ▼
Angular sends:
Authorization: Bearer <token>
        │
        ▼
JwtAuthenticationFilter
        │
        ▼
Extract username/email
        │
        ▼
Validate JWT
        │
        ▼
SecurityContext
        │
        ▼
Protected Controller
```

The JWT implementation currently uses **HS256** and has a configured token lifetime of approximately **10 hours**.

---

## 🛡️ Spring Security

Security is configured through `SecurityConfig`.

The application:

- Disables CSRF for the REST API
- Enables CORS
- Allows preflight `OPTIONS` requests
- Permits authentication/product/image/public API paths as configured
- Protects authenticated user APIs
- Adds `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter`
- Uses `BCryptPasswordEncoder` for passwords

---

## 🗄️ Database

The production profile uses **MySQL**.

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

### Main Entities

```text
User
 ├── Address
 └── Order
      └── OrderItem
            └── Product

Product
 └── ProductImage
```

---

## ⚙️ Configuration Profiles

The project contains:

```text
application.properties
application-local.properties
application-docker.properties
application-prod.properties
```

The default application configuration activates the production profile:

```properties
spring.application.name=ecommerce-server
spring.profiles.active=prod
```

Production database credentials are supplied through environment variables.

---

## ▶️ Run Locally

### Prerequisites

- Java 17+
- Maven 3.9+
- MySQL 8+
- Git

### 1. Clone the repository

```bash
git clone <your-server-repository-url>
cd ecommerce_server
```

### 2. Configure MySQL

Create the required database and configure the local profile/environment variables.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Build

```bash
mvn clean install
```

### 4. Run

```bash
mvn spring-boot:run
```

The API starts on:

```text
http://localhost:8080
```

---

## 🐳 Docker

The backend includes a multi-stage Dockerfile.

### Build

```bash
docker build --no-cache -t ecommerce-server:latest .
```

### Run

```bash
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://<host>:3306/<database>" \
  -e SPRING_DATASOURCE_USERNAME="<username>" \
  -e SPRING_DATASOURCE_PASSWORD="<password>" \
  ecommerce-server:latest
```

The Docker image uses:

```text
Maven + Eclipse Temurin 17
        ↓
Spring Boot executable JAR
        ↓
Eclipse Temurin 17 Alpine runtime
```

---

## 🧪 Testing

The project includes Spring Boot test dependencies and Spring Security test support.

Run:

```bash
mvn test
```

---

## 🔒 Production Security Notes

Before using the project in a production environment, the following should be reviewed:

1. Move the JWT signing secret from source code to an environment variable or secret manager.
2. Use strong, rotated secrets.
3. Restrict CORS to the exact trusted frontend origins.
4. Never log JWT tokens or passwords.
5. Use HTTPS for all production traffic.
6. Review authorization rules for every administrative endpoint.
7. Store database credentials only in environment variables/secrets.
8. Consider a stronger production secret-management strategy such as Railway secrets, AWS Secrets Manager, Azure Key Vault, or Vault.

---

# 📸 Frontend Screenshots

These screenshots demonstrate the Angular frontend that consumes this backend API.

## 1. User Registration

![User Registration](screenshots/01-register.png)

## 2. User Login

![User Login](screenshots/02-login.png)

## 3. Add Product

![Add Product](screenshots/03-add-product.png)

## 4. Shopping Cart

![Shopping Cart](screenshots/04-cart.png)

## 5. Saved Addresses

![Saved Addresses](screenshots/05-saved-addresses.png)

## 6. Order History

![Order History](screenshots/06-orders.png)

## 7. Manage Account

![Manage Account](screenshots/07-manage-account.png)

---

## 🔄 Frontend ↔ Backend Flow

```text
Angular 20
   │
   │ REST API
   │ JWT Authorization
   ▼
Spring Boot 3.5.5
   │
   ├── Spring Security
   ├── JWT Filter
   ├── Controller
   ├── Service
   ├── Repository
   └── Global Exception Handler
   │
   ▼
Hibernate / JPA
   │
   ▼
MySQL
```

---

## 🚀 Deployment

### Frontend

```text
Angular → Production Build → Vercel
```

Live frontend:

```text
https://ecommerce-client-pros12345s-projects.vercel.app
```

### Backend

```text
Spring Boot → Docker → Railway
```

Production API:

```text
https://ecommerce-server-production-b652.up.railway.app/api
```

---

## 👨‍💻 Author

**Prosenjit Chakrabortty**

Java Backend / Full Stack Developer

**Core Skills:** Java, Spring Boot, Microservices, Angular, REST APIs, JPA/Hibernate, SQL, Docker

---

## 📄 Related Project

This backend serves the Angular frontend.

See the frontend README for UI features, screenshots, Angular architecture, local setup, and frontend deployment details.
