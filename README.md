# Node.js Simple CRUD API

This project provides RESTful CRUD API with a consistent in-memory store. Also demonstrates horizontal scaling using the `Node.js Cluster API`.

---

## 🚀 Features

- CRUD API for users
- Written in TypeScript
- Horizontal scaling via Node.js Cluster API (with round-robin load balancing)
- Dedicated storage server for shared in-memory state between workers
- Jest tests for API endpoints

---

## ⚙️ Setup

```bash
git clone https://github.com/tagaiii/Simple-CRUD-API.git
cd Simple-CRUD-API
git checkout develop
npm install
```

---

## 🔧 Environment Variables

Create a `.env` file:

```env
BASE_PORT=4000
DB_SERVICE_PORT=3000
```

---

## 🏁 Run the Project

### Dev mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run start:dev
```

### Multi-thread mode
```bash
npm run start:multi
```

Example:  
- Load Balancer: `http://localhost:4000/api/users`  
- Workers: `http://localhost:4001`, `4002`, `4003`  
- Storage Server: `http://localhost:3000`

---

## 📮 API Endpoints

- `GET    /api/users` — Get all users  
- `GET    /api/users/:id` — Get a user by ID  
- `POST   /api/users` — Create a new user  
- `PUT    /api/users/:id` — Update a user  
- `DELETE /api/users/:id` — Delete a user  

---

## ✅ Testing

```bash
npm run test
```

---