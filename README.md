# QuickChat

QuickChat is a simple real-time chat application built with React (Vite) on the client and Express + Socket.IO + MongoDB on the server. It supports user signup/login, direct messaging, image attachments (via Cloudinary), and online presence.

---

## Repo structure

- `client/` — React (Vite) frontend
- `server/` — Express backend with Socket.IO and MongoDB

---

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (Atlas or local)
- Cloudinary account (optional, for image uploads)

---

## Environment variables

Create a `.env` file in `server/` with the following variables (example keys):

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `.env` for the client (Vite) or set env vars for development:

```
VITE_BACKEND_URL=http://localhost:5000
```

> Note: Vite expects `VITE_` prefix for env vars used on the client.

---

## Install & Run (development)

Backend (server):

```bash
cd server
npm install
# dev with nodemon (if available)
npm run dev # or: nodemon server.js
```

Frontend (client):

```bash
cd client
npm install
npm run dev
```

Open the browser at the URL shown by Vite (usually `http://localhost:5173`).

---

## Key API endpoints

- `POST /api/auth/signup` — create account (body: `{ fullName, email, password, bio }`)
- `POST /api/auth/login` — login (body: `{ email, password }`) — returns `token` and `userData`
- `GET /api/auth/check` — protected: validate token and return `user`

Messages:
- `GET /api/messages/users` — list users (protected)
- `GET /api/messages/:id` — get messages with user `:id` (protected)
- `POST /api/messages/send/:id` — send message to user `:id` (protected)
- `PUT /api/messages/mark/:id` — mark message as seen (protected)

Socket events:
- Server emits `getOnlineUsers` with array of online user IDs
- Server receives client connections with query param `userId` to map sockets
- Server emits `newMessage` to the receiver socket when a message is created

---

## Auth header

This project currently uses a custom header `token` set by the client in `axios.defaults.headers.common['token'] = <token>` for protected requests. If you prefer standard behavior, switch to `Authorization: Bearer <token>` on both client and server.

---

## Troubleshooting

- Login returns `200 OK` but `success:false` in JSON: check server responses — many API handlers return JSON without setting proper HTTP status codes. Use the `success` field in responses for app logic, and we recommend patching controllers to use `res.status(...)`.

- Socket shows users online when they are not: ensure the server emits updated online list on real socket `disconnect` events (server `socket.on('disconnect', ...)`). Confirm the client connects with the correct `VITE_BACKEND_URL`.

- Images upload fail: confirm Cloudinary env vars are set and valid. The server uploads `profilePic` and message images using Cloudinary SDK.

- CORS errors: server uses `cors()`; ensure the `VITE_BACKEND_URL` origin is allowed or set `cors({ origin: '*' })` for development only.

- If messages are not sent: check the console for errors and ensure `selectedUser` is set and the POST endpoint `/api/messages/send/:id` matches the route in `server/routes/messageRoutes.js`.

---

## Tests & Manual checks

1. Start `server/` and `client/`.
2. Create two users (or use incognito) and log in both.
3. Verify online presence toggles when a client disconnects.
4. Select a user and send text and image messages.
5. Watch server logs for socket connection/disconnect messages.

---

## Notes & TODOs

- Consider standardizing token header to `Authorization: Bearer <token>`.
- Add proper HTTP status codes to controllers for clearer API semantics.
- Add tests for message flows and socket presence.

---

If you want, I can update the server to use `Authorization` headers and add proper status codes across controllers.