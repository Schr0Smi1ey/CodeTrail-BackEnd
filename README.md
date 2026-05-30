# CodeTrail Backend

Express + MongoDB API for CodeTrail.

## Features

- REST API for tracks, topics, resources, check-ins, stats, heatmaps
- MongoDB/Mongoose models
- Firebase Admin authentication
- Verified-email access control
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
FIREBASE_SERVICE_ACCOUNT_KEY={"project_id":"codetrail-karim","client_email":"firebase-adminsdk@example.iam.gserviceaccount.com","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"}
```

## Auth

All app APIs require:

```text
Authorization: Bearer <firebase-id-token>
```

Any user with a valid Firebase ID token and verified email can access data.

For Vercel, set `FIREBASE_SERVICE_ACCOUNT_KEY` to the Firebase service account JSON on one line. Keep escaped newlines in `private_key` as `\\n`.

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
