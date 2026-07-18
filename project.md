# BookEx — Project Documentation

## 1. Overview

BookEx is a credit-based, peer-to-peer book exchange application. Members register, receive an initial credit balance, list physical books, submit offers for other members' books, and complete exchanges when the owner approves an offer. The application records transactions and lets buyers review sellers after an exchange.

The repository contains two TypeScript applications:

| Area | Location | Purpose |
| --- | --- | --- |
| Frontend | `frontend/` | Next.js 15 client application for browsing books and managing exchanges. |
| Backend | `backend/` | Express 5 REST API, authentication, business rules, image uploads, and persistence. |
| Database | PostgreSQL 16 | Relational data store managed through Prisma ORM and migrations. |
| Container setup | `docker-compose.yml` | Starts PostgreSQL and the backend development container. |

## 2. Product capabilities

- Register through an OTP verification flow, then sign in and sign out using HTTP-only JWT cookies.
- Receive 10 credits on account creation.
- Create, browse, view, and delete book listings.
- Upload a book-cover image to Cloudinary.
- Maintain a profile, bio, address, phone number, and preferred contact method.
- Request a book with a credit offer and optional message.
- Let a seller approve or reject incoming requests.
- On approval, transfer credits, create a transaction, mark the book unavailable, and reject competing pending requests.
- Show exchange/request state, credit summaries, transaction history, public profiles, and reviews.
- Let the buyer leave one 1–5-star review for each transaction.

## 3. Architecture

```text
Browser
  │
  │ Next.js client pages, React Hook Form, Zod, Zustand, Tailwind/Radix UI
  ▼
Frontend (default port 3000)
  │  fetch(..., credentials: "include")
  │  NEXT_PUBLIC_API_URL
  ▼
Express API (default port 8080)
  ├─ cookie/JWT authentication and refresh
  ├─ validation and exchange business rules
  ├─ Multer memory upload → Cloudinary
  ▼
Prisma ORM ─────────────────────────────► PostgreSQL
```

The backend exposes REST endpoints below `/api/v1`. Owner and user route groups use the same authenticated identity; “owner” means the authenticated user owns the resource being changed, while “user” represents the buyer/public-facing action.

## 4. Technology stack

### Frontend

- Next.js 15.5 with the App Router, React 19, and TypeScript.
- Tailwind CSS 4 with `tw-animate-css`.
- Radix UI primitives and locally wrapped shadcn-style UI components.
- React Hook Form and Zod for client form validation.
- Zustand for transient auth, credit, and user-ID state.
- Lucide and Radix icons.

### Backend

- Node.js 20+ and TypeScript (ES2022/CommonJS output).
- Express 5, Prisma 6, and PostgreSQL.
- JWT, `cookie-parser`, bcrypt, and CORS for session/authentication handling.
- `express-validator` for input validation and escaping.
- Multer memory storage and Cloudinary for image uploads.
- Helmet, compression, Morgan request logs, and dotenv.

## 5. Repository layout

```text
platform-dev/
├── project.md                 # This document
├── docker-compose.yml         # PostgreSQL + backend development service
├── frontend/
│   ├── src/app/               # Next.js routes, root layout, global styles
│   ├── src/components/custom/ # Product-specific UI and forms
│   ├── src/components/ui/     # Reusable Radix/Tailwind UI primitives
│   ├── src/lib/               # API client, models, schemas, Zustand stores
│   ├── public/                # Logo and static assets
│   └── Dockerfile
└── backend/
    ├── src/controllers/       # HTTP handlers and request validation
    ├── src/routes/            # API route composition
    ├── src/services/          # Prisma data-access helpers
    ├── src/middlewares/       # JWT auth and image upload handling
    ├── src/utils/             # Errors, checks, dates, token/OTP helpers
    ├── src/type/              # API/domain TypeScript types
    ├── prisma/                # Schema and migration history
    └── Dockerfile
```

## 6. Local development

### Prerequisites

- Node.js 20 or later.
- npm.
- PostgreSQL 16, either installed locally or started through Docker.
- Cloudinary credentials when creating listings with images.

### Environment variables

Create `backend/.env` from `backend/envExample.txt` and supply the missing values:

```dotenv
NODE_ENV=development
PORT=8080
DATABASE_URL="postgresql://postgres:password@localhost:5432/bookex?schema=public"
ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET=replace-with-a-different-long-random-secret

# Required by the active Cloudinary upload middleware
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Present in the example but not used by the current OTP implementation
OTP_EMAIL=...
OTP_EMAIL_PW=...
```

Create `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8080
```

`NEXT_PUBLIC_API_URL` must not end with a slash because the shared client appends one before every API path.

### Run locally

```bash
# Terminal 1: install and start the API
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
npm run dev

# Terminal 2: install and start the web app
cd frontend
npm ci
npm run dev
```

The frontend runs at `http://localhost:3000`; the API normally runs at `http://localhost:8080`.

### Docker development database/backend

```bash
docker compose up --build
docker compose exec backend npx prisma migrate deploy
```

Compose starts `db` and `backend`, maps API port `8080` (and Prisma Studio's common port `5555`), and persists database data in the `bookex_db_data` volume. It does **not** start the frontend, so run the frontend locally or build/run `frontend/Dockerfile` separately. Inside Compose, the backend uses the database hostname `db`.

## 7. Backend design

### Request pipeline

`src/app.ts` configures Morgan, URL-encoded/JSON body parsing, CORS, Helmet, cookie parsing, and compression. It serves `upload/images` statically, although the current book-upload path stores Cloudinary URLs rather than local image filenames. A final error handler returns:

```json
{ "message": "...", "error": "..." }
```

The CORS allowlist contains the production Railway frontend plus `http://localhost:5173` and `http://localhost:3000`. Cross-origin browser requests must use `credentials: "include"` so JWT cookies are sent.

### Authentication and session lifecycle

1. `POST /api/v1/register` validates an email, creates/updates an OTP record, and returns a `rememberToken`.
2. `POST /api/v1/verify-otp` verifies the one-time code and returns a `verifiedToken`.
3. `POST /api/v1/confirm-password` validates the verified token, hashes the password, creates the `User`, `Credits` (balance 10), and `TransactionHistory` records, then sets access and refresh cookies.
4. `POST /api/v1/login` verifies the password and sets new cookies.
5. The `auth` middleware reads `accessToken`; when it has expired it verifies `refreshToken`, verifies it matches the token stored in `User.randToken`, rotates both cookies, and sets `req.userId`.
6. `POST /api/v1/logout` rotates the stored refresh token and clears both cookies.

Access tokens last 15 minutes and refresh tokens last 30 days. Cookies are HTTP-only; in production they use `Secure` and `SameSite=None`, while development uses `SameSite=Strict`.

### Book listing and image handling

The protected create endpoint accepts `multipart/form-data` with a `book` image field. Multer only allows PNG, JPG/JPEG, and WebP images, keeps them in memory, and limits them to 10 MB. The Cloudinary middleware uploads to `bookex/images` and the controller stores `secure_url` in `Book.image`.

Book prices are integer credits from 1 through 10. The backend enum spelling for non-fiction is `NONFICTON`; the frontend maps its `NONFICTION` UI value to this API/database value before posting.

### Exchange rules

- A request requires a valid authenticated buyer, saved contact information, sufficient current credits, an available book, and a different owner.
- A buyer cannot have more than one pending request for the same book.
- The seller alone may approve/reject an incoming pending request.
- Approval rechecks the buyer balance, creates a `Transaction`, deducts the buyer balance, increments the seller balance, makes the book unavailable, approves the selected request, and rejects all competing pending requests for that book.
- Buyers can modify a pending request, retry a rejected request while the book remains available, and delete pending or rejected requests. Approved requests cannot be deleted.
- A buyer may create only one review for an approved transaction, and only for a transaction where they are the buyer.

## 8. Database schema

Prisma schema: `backend/prisma/schema.prisma`.

| Model | Important fields and relationships |
| --- | --- |
| `Otp` | Unique email, hashed OTP, remember/verified tokens, rate/error counters, expiration timestamps. |
| `User` | Identity, password hash, contact/profile fields, refresh-token surrogate (`randToken`), account status; owns books, requests, credits, and transaction history. |
| `Credits` | One-to-one user balance. |
| `Book` | Title, author, optional ISBN/description, Cloudinary image URL, category, condition, credit price, availability, owner. |
| `RequestedBook` | A buyer's offer, seller/book references, message, and `PENDING`, `REJECT`, or `APPROVE` status. |
| `Transaction` | One approved request and one book, buyer/seller, price, and pointers to both users' histories. |
| `TransactionHistory` | One per user; exchange count, credit totals, cumulative rating field, buyer/seller transaction collections, and reviews. |
| `Review` | One per transaction, rating, description, reviewer, reviewee, and seller's transaction history. |

Enums:

- `Category`: `NONE`, `OTHER`, `NONFICTON`, `TEXTBOOK`, `BIOGRAPHY`, `SCIENCE`, `HISTORY`, `ROMANCE`, `MYSTERY`, `FANTASY`, `SELFHELP`, `BUSINESS`, `ART`, `COOKING`, `TRAVEL`, `CHILDREN`, `YOUNG`, `ADULT`, `PHYLOSOPHY`, `RELIGION`, `HEALTH`, `EDUCATION`.
- `Condition`: `LIKENEW`, `VERYGOOD`, `GOOD`, `FAIR`, `POOR`.
- `RequestStatus`: `PENDING`, `REJECT`, `APPROVE`.
- `Status`: `ACTIVE`, `INACTIVE`, `FREEZE`.
- `PreferredContact`: `PHONE`, `EMAIL`.

## 9. REST API reference

All routes are rooted at `/api/v1`. `Auth` means the cookie-based `auth` middleware protects the route.

### Authentication

| Method | Endpoint | Auth | Body / behavior |
| --- | --- | --- | --- |
| POST | `/register` | No | `{ email }`; issues an OTP record and returns `rememberToken`. |
| POST | `/verify-otp` | No | `{ email, otp, rememberToken }`; returns `verifiedToken`. |
| POST | `/confirm-password` | No | `{ email, name, verifiedToken, password, confirmPassword }`; creates account and sets cookies. |
| POST | `/login` | No | `{ email, password }`; sets cookies and returns `userId`. |
| POST | `/logout` | No* | Requires the refresh cookie; clears cookies. |

### Public/book discovery

| Method | Endpoint | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/public/books?cursor=&limit=` | No | Cursor-paginated public book list; default limit is 3 and limit must be greater than 2. |
| GET | `/user/books/get-all-books?cursor=&limit=` | Yes | Authenticated version of the same paginated listing handler. |
| GET | `/user/books/get-book-details/:bookId` | Yes | Returns a `book` and owner information. |
| GET | `/owner/books/get-book-details/:bookId` | Yes | Same book-detail handler for owners. |
| GET | `/user/books/get-user-books/:ownerId` | Yes | Listings for one owner plus an `isOwner` flag. |

### Owner profile, books, and metrics

| Method | Endpoint | Body / behavior |
| --- | --- | --- |
| GET | `/owner/profile` | Current profile, contact info, balance, book count, exchanges, and rating. |
| PUT | `/owner/update-profile` | `{ name, bio?, address? }`. |
| PUT | `/owner/update-contact-info` | `{ phone?, address?, preferredContact: "EMAIL" | "PHONE" }`. |
| POST | `/owner/books/create-new-book` | Multipart listing fields and `book` image. |
| DELETE | `/owner/books/delete-book/:bookId` | Owner only; available books without requests only. |
| GET | `/owner/credits/get-credits` | Current balance, totals, exchanges, and rating. |
| GET | `/owner/transactions/get-all-transactions` | Combined buyer/seller transaction records. |
| GET | `/owner/reviews/get-all-reviews` | Reviews received by the current user. |

### Requests and reviews

| Method | Endpoint | Body / behavior |
| --- | --- | --- |
| POST | `/user/books/request-book` | `{ bookId, requestedPrice, message? }`; profile contact info must already exist. |
| GET | `/user/requests/pending` | Current buyer's pending requests. |
| GET | `/user/requests/approve` | Current buyer's approved requests. |
| GET | `/user/requests/reject` | Current buyer's rejected requests. |
| PUT | `/user/requests/update-request` | `{ requestId, requestedPrice?, message? }`; pending only. |
| PUT | `/user/requests/request-again` | `{ requestId, requestedPrice?, message? }`; rejected only. |
| DELETE | `/user/requests/delete-request/:requestId` | Deletes the current buyer's non-approved request. |
| GET | `/owner/requests/incoming-pending` | Current seller's pending requests, including buyer contact info. |
| GET | `/owner/requests/incoming-approve` | Current seller's approved requests. |
| PUT | `/owner/requests/update-request` | `{ requestId, avaiableStatus: "APPROVE" | "REJECT" }`. Note the API's existing `avaiableStatus` spelling. |
| POST | `/user/reviews/create-review` | `{ transactionId, rating, description }`; buyer only, once per transaction. |
| GET | `/user/reviews/get-all-reviews/:userId` | Public reviews for a user. |
| GET | `/user/profile/:userId` | Public profile, books, contact data, and seller-side reviews. |

Successful handlers generally return `{ message, ...data }`; the exact payload key differs by endpoint (`data`, `resData`, `booksList`, `myRequestLists`, or `reviews`). Client integrations should follow the controller response shape rather than assume one uniform envelope.

## 10. Frontend application

### Routing and screens

| Route | Screen / current behavior |
| --- | --- |
| `/` | Static landing composition with welcome/search UI and placeholder book cards. |
| `/books` | Auth-gated browse page; loads a large list through the authenticated book route. |
| `/books/[id]` | Book details, owner details, and request form. |
| `/books/new` | Form for creating a listing and uploading its image. |
| `/exchanges` | Outgoing buyer requests and seller-side incoming/approved requests; seller can approve/reject. |
| `/credits` | Balance, total credit summaries, exchanges, and rating. |
| `/profile` | Current user profile, edit-profile dialog, contact-information display, navigation cards, and logout. |
| `/profile/list` | Current user's listings and delete controls. |
| `/profile/rating` | Reviews received by the current user. |
| `/profile/[id]` | Public user profile, books, and reviews. |

### Client data flow

`src/lib/base-client.ts` is the shared wrapper around `fetch`. It joins the base URL and a path, parses common error response shapes, and throws an `Error` for non-2xx responses. Authenticated page calls pass `credentials: "include"` to use the API's HTTP-only cookies.

Zustand stores provide in-memory UI state:

- `auth-store.ts`: signed-in UI flag and auth-dialog visibility.
- `credit-store.ts`: balance and summary metrics used by the credit screen.
- `user-id-store.ts`: a selected/current user ID used by the listings page.

The app has no server-side session hydration, route middleware, or persistent client auth store. API authorization remains the source of truth.

### UI composition

- `components/custom/` contains domain UI: navbar, auth dialog, book cards/forms, request form, exchange cards, credit panels, profile/contact panels, search bar, and image picker.
- `components/ui/` contains reusable inputs, dialogs, cards, tabs, tables, selectors, sidebar primitives, and related Radix wrappers.
- `globals.css` defines Tailwind 4 theme tokens plus light/dark CSS values. `layout.tsx` applies Geist and Geist Mono fonts and renders the navbar globally.

## 11. Deployment

### Backend image

`backend/Dockerfile` uses a multi-stage Node 20 Alpine build, runs `prisma generate` and TypeScript compilation, installs production dependencies, applies Prisma migrations at container start, and executes `dist/index.js`.

### Frontend image

`frontend/Dockerfile` uses a multi-stage Node 20 Alpine build. Pass `NEXT_PUBLIC_API_URL` as a build argument because Next.js exposes it to the browser bundle:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  -t bookex-frontend ./frontend
```

The production frontend container exposes port 3000 and runs `next start`.

### Production checklist

- Use a managed PostgreSQL database and production `DATABASE_URL`.
- Configure a secure, allowed frontend origin in the backend CORS allowlist.
- Provide strong independent JWT secrets.
- Configure all three Cloudinary variables.
- Run `prisma migrate deploy` as part of release/startup (already in the backend Dockerfile).
- Set `NODE_ENV=production` so cookies use `Secure` and `SameSite=None`.
- Build the frontend with the public API URL that browsers should call.

## 12. Current implementation notes and follow-up work

These points describe the repository as implemented; they are useful priorities before production use.

| Area | Current behavior / risk | Recommended follow-up |
| --- | --- | --- |
| OTP delivery | Registration uses a hard-coded development OTP (`123456`); Nodemailer/email variables are not wired into the flow. | Generate and deliver a random OTP through a verified email provider; remove the development code. |
| OTP timing | The response says five minutes, but verification checks two minutes from the record's update time. | Define one expiration source and enforce it consistently. |
| Transaction integrity | Approval updates several tables in independent database calls. A failure midway can leave credits, status, and transaction data inconsistent. | Wrap approval and competing-request rejection in one Prisma interactive transaction. |
| Credit labels | Approval increments buyer `totalIncome` and seller `totalOutcome`, while the credit screen calls them earned/spent. | Swap or rename the fields and add migration/data correction if needed. |
| Rating calculation | Reviews increment `averageRating` as a sum. Current profile divides it by all transactions, while public/book views expose the raw stored value. | Store a review count and calculate a consistent average from seller reviews. |
| Client auth | Zustand auth state resets on refresh; the navbar can show signed-out despite valid cookies. | Add an authenticated-session endpoint and hydrate state, with Next route protection where appropriate. |
| Login response mismatch | Frontend reads `newUserId` after login, but backend returns `userId`. | Align the response type/field and set the user ID from `userId`. |
| Sign-up sequencing | The dialog advances verification screens without awaiting the API result. Client password validation accepts six characters but backend requires 8–15. | Await each call, show errors, and share the same validation constraints. |
| Credit page effect | The credits `useEffect` has no dependency array, causing repeated fetches after each state update. | Add `[]` or controlled dependencies. |
| Public browsing | A public `/public/books` API exists, but the main browse screen uses the protected `/user/books/get-all-books` route and the navbar blocks it when UI auth is false. | Use the public endpoint for anonymous browsing or intentionally remove it. |
| Image cleanup | Book deletion removes only the database row; Cloudinary public IDs are not stored. | Persist the public ID and delete the remote asset when its listing is removed. |
| Validation/build policy | Next config ignores TypeScript and ESLint errors during production builds. | Re-enable build failures after resolving existing errors. |
| Test coverage | A Jest command exists but the repository has no test files. | Add controller/service integration tests, especially auth refresh and approval atomicity. |
| Configuration | Cloudinary variables required by code are missing from `envExample.txt`; compose does not include frontend. | Complete the env template and add frontend service if one-command full-stack startup is desired. |

## 13. Available npm scripts

| Project | Script | Command |
| --- | --- | --- |
| Backend | development | `npm run dev` — Nodemon runs `src/index.ts`. |
| Backend | build | `npm run build` — TypeScript compiler. |
| Backend | production | `npm start` — runs `dist/index.js`. |
| Backend | migration | `npm run migrate:deploy` — applies Prisma migrations. |
| Backend | tests | `npm test` — Jest. |
| Frontend | development | `npm run dev` — Next dev with Turbopack. |
| Frontend | build | `npm run build` — Next production build with Turbopack. |
| Frontend | production | `npm start` — Next production server. |
| Frontend | lint | `npm run lint` — ESLint. |

## 14. Verification status

Documentation was checked against the route definitions, controllers, services, Prisma schema, Dockerfiles, frontend pages, shared client code, and package scripts on 2026-07-18.

Build, test, and lint commands could not be executed in the checked workspace because project dependencies are not installed: the commands report missing `tsc`, `jest`, `eslint`, and `next`. Run `npm ci` in both `backend/` and `frontend/` before executing the scripts in section 13.
