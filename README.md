# Transaction App

This mern-stack app to carry out transaction between 2 users.

## Installation (For local)

Clone the repository and follow the setups.

```bash
  cd notes_app
  chmod +x ./dev.sh
```

Build (Make sure you have .env file inside the directory. Use .env.example for reference)

```bash
  ./dev.sh build
```

Run

```bash
  ./dev.sh up
```

Frontend: http://localhost:3000

Backend: http://localhost:8000

DB: http://localhost:27017

Redis: http://localhost:6379

Initialize user (once the server is running)

```bash
  docker exec -it transaction-app-backend-1 sh
  npm run init-db
```

## Documentation

Have included doctrings.
