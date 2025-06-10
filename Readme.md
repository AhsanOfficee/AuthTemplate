# 🛡️ User Authentication API

A secure, scalable authentication backend built with **Node.js** and **TypeScript**. This project includes features like JWT-based login, signup, token renewal, CAPTCHA verification, and detailed logging — all powered by **Sequelize ORM** with a **PostgreSQL** database. It’s fully containerized with **Docker** and production-ready using **PM2**.

---

## 🚀 Features

- ✅ **User Signup & Login**
  Secure signup/login with hashed passwords and input validation using Zod.

- 🔁 **Access & Refresh Tokens**
  Robust JWT flow for secure session management and renewal.

- ⏱️ **Auto Logout**
  Inactive sessions are automatically logged out on token expiry.

- 🔐 **CAPTCHA Verification**
  Integrated CAPTCHA token validation to prevent bot attacks.

- 🧪 **Zod-based Validation**
  Every incoming request is validated with \[Zod] for data safety and type enforcement.

- 🚲 **PostgreSQL + Sequelize ORM**
  Data modeling and migrations handled via Sequelize with PostgreSQL.

- 📦 **Dockerized Setup**
  Easily deployable using Docker and `docker-compose`.

- 🧰 **Production-Ready with PM2**
  Process management, logging, and graceful restarts managed by PM2.

- 📋 **Activity Logs**
  All key actions are logged and stored for auditing and debugging.

---

## 🧱 Tech Stack

| Layer            | Technology             |
| ---------------- | ---------------------- |
| Language         | TypeScript             |
| Runtime          | Node.js                |
| Web Framework    | Express                |
| Auth             | JWT (Access + Refresh) |
| Validation       | Zod                    |
| ORM              | Sequelize              |
| Database         | PostgreSQL             |
| Containerization | Docker                 |
| Process Manager  | PM2                    |

---

## 📁 Project Structure

```
├── .env.sample
├── Dockerfile
├── README.md
├── docker-compose.yml
├── dreload.sh
├── ecosystem.config.js
├── package.json
├── public/
│   └── dummy.pdf
├── src/
│   ├── config/
│   ├── controllers/
│   │   ├── auth/
│   │   └── profile/
│   ├── enums/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.ts
└── tsconfig.json
```

---

## 🛠️ Scripts

| Command          | Description                           |
| ---------------- | ------------------------------------- |
| `npm run format` | Formats code using Prettier           |
| `npm run build`  | Compiles TypeScript files             |
| `npm run start`  | Starts the app in production via PM2  |
| `npm run dev`    | Starts the app in development via PM2 |
| `npm run local`  | Runs the app locally using Nodemon    |

---

## ⚙️ Getting Started

### 1. 📥 Clone the Repository

```bash
git clone https://github.com/AhsanOfficee/AuthTemplate.git
cd AuthTemplate
```

---

### 2. 📦 Install Dependencies

```bash
npm install
```

---

### 3. 🛠️ Configure Environment Variables

Copy the example `.env` file:

```bash
cp .env.sample .env
```

> ⚠️ **WARNING: `.env` File Formatting**
>
> ❗ **Do NOT use spaces around `=` signs in the `.env` file** — this will break the `dreload.sh` Docker startup script.
>
> ✅ Correct:
>
> ```env
> PG_USER=myuser
> PG_PASSWORD=secret123
> ```
>
> ❌ Incorrect:
>
> ```env
> PG_USER = myuser   # ❌ This format will fail
> ```

Edit the values in `.env` to match your environment.

---

### 4. 🐳 Start the App via Docker

> Docker Requirements:
>
> - Docker: `27.3.1`
> - Docker Compose: `v2.29.7`

Make the script executable:

```bash
chmod +x dreload.sh
```

Run the script:

```bash
./dreload.sh
```

---

### ⚠️ Troubleshooting

#### 1. Docker Compose Errors

- Ensure your Docker and Compose versions are compatible.
- If needed, update `dreload.sh` to match your local Docker version.

#### 2. Network/Subnet Conflicts

- Update the `SUBNET` value in `.env` if Docker reports a network conflict.

**OR**

You can disable the custom docker network configuration by commenting out the following section in your `docker-compose.yml` file:

````yaml
# networks:
#   - default_network

# networks:
#   default_network:
#     name: ${NETWORK_NAME}
#     driver: bridge
#     ipam:
#       config:
#         - subnet: "${SUBNET}"


#### 3. Node.js Compatibility

If `npm install` fails:

```bash
rm -rf node_modules package-lock.json
````

Ensure your Node.js version matches the Docker image.

Then reinstall:

```bash
npm install
./dreload.sh
```

---

### 5. 🧱 Access the Running Container

To enter the container:

```bash
sudo docker exec -it api_server bash
```

To view logs:

```bash
pm2 log 0
```

---

## 🧚️ API Testing with Postman

A Postman collection is included for quick API testing.

1. Open Postman
2. Click **Import**
3. Select the provided `.postman_collection.json` file
4. Start testing the endpoints right away

---
