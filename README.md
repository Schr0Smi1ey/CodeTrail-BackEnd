# CodeTrail Backend

Express + MongoDB API for CodeTrail.

## Features

- REST API for tracks, topics, resources, check-ins, stats, heatmaps
- MongoDB/Mongoose models
- Firebase Admin authentication
- Allowed-email access control
- Vercel serverless deployment

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Required `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codetrail
CLIENT_ORIGIN=http://localhost:5173
FIREBASE_PROJECT_ID=codetrail-karim
ALLOWED_EMAILS=your-email@example.com
```

## Auth

All app APIs require:

```text
Authorization: Bearer <firebase-id-token>
```

Only emails listed in `ALLOWED_EMAILS` can access data.

Public endpoint:

```text
GET /api/health
```

## API

- `GET/POST /api/tracks`
- `GET/PUT/DELETE /api/tracks/:id`
- `GET/POST /api/topics`
- `GET/PUT/DELETE /api/topics/:id`
- `GET/POST /api/resources`
- `GET/PUT/DELETE /api/resources/:id`
- `GET/POST /api/checkins`
- `GET/PUT/DELETE /api/checkins/:date`
- `GET /api/stats/summary`
- `GET /api/stats/heatmap`

## Checks

```bash
npm test
```

## Deploy

Configured for Vercel through `api/index.js` and `vercel.json`.

```bash
vercel deploy --prod
```

Production:

```text
https://codetrail-backend.vercel.app
```
