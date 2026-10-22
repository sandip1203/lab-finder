# Labwise frontend

The frontend uses the Express backend at `http://localhost:3000` by default.
Next.js runs on port `3001` and forwards its requests to the backend.

Start the backend in one terminal:

```bash
cd Backend
npm start
```

Start the frontend in another terminal:

```bash
cd Frontend
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). To use a different backend
address, set `LAB_BACKEND_URL` before starting Next.js.
