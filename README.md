# YaYa Wallet Dashboard Challenge

## Overview
This project implements a **Transaction Dashboard** for the YaYa Wallet API. It has two main parts:

1. **Backend (Node.js + Express)**
   - Proxies requests to YaYa Wallet sandbox API.
   - Handles **HMAC-SHA256 signing** of requests as required by YaYa’s authentication scheme.
   - Provides simplified endpoints (`/api/transactions`, `/api/search`) that the frontend can call without worrying about signing.

2. **Frontend (React + Vite + TailwindCSS)**
   - Displays transactions in a **paginated, searchable table**.
   - Supports search by sender, receiver, cause, or ID.
   - Highlights **incoming transactions (green)** and **outgoing transactions (red)** for better UX.

---

## ⚙️ Backend Details

### Endpoints
- `GET /api/transactions?p=1` → Fetch paginated transactions.
- `POST /api/search` with `{ "query": "string" }` → Search transactions by keyword.

### Authentication & Signing
- Uses `YAYA-API-KEY`, `YAYA-API-TIMESTAMP`, and `YAYA-API-SIGN` headers.
- Signature = HMAC-SHA256(secret, prehash), where:
  ```
  prehash = timestamp + method + endpoint + body
  ```
- **Assumptions:**
  - Timestamp must be in **microseconds (16 digits)**.
  - Endpoint for signing uses `/api/en/...` as documented.
  - Request body must match exactly what is sent (empty string for GET).

### How We Tested
- Used **Postman** to call backend endpoints.
- Logged full signing details (timestamp, prehash string, base64 signature) for debugging.
- Adjusted secret handling and timestamp format until consistent with docs.

---

## 🎨 Frontend Details

### Features
- Transactions table with Tailwind styling.
- Pagination controls(next/prev page).
- earch input that triggers on Enter.
- Row highlighting:
  - Incoming → green background.
  - Outgoing → red background.
- Mobile-friendly.

### Assumptions
- The "current user" = the account associated with the API key/secret.
- To determine incoming vs outgoing:
  - If `receiver === currentAccount` → incoming.
  - If `sender === receiver === currentAccount` → top-up (also incoming).
  - Otherwise → outgoing.

### How We Tested
- Mocked sample transactions from mock backend api response   api/mock.
- Verified search filters correctly match ID, sender, receiver, or cause.
- Verified pagination changes pages without reloading.

---

## ▶️ How to Run

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend will run on `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`

---

## 🔍 Problem-Solving Approach
1. **Understand API requirements**: Carefully read YaYa Wallet’s signing documentation.
2. **Isolate authentication**: Built a `authUtils` helper.
3. **Debug signature mismatches**: Iteratively tested timestamp units, endpoint formatting, and secret encoding.
4. **Frontend-first design**: Planned table + search + pagination before wiring data.
5. **Iterative testing**: Used Postman for backend API verification, mocked data for frontend testing, then integrated.

---

## ✅ Final Notes
- The solution is modular: frontend and backend can run independently.


