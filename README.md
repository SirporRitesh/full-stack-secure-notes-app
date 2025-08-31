# Full Stack Secure Notes App

## Table of Contents

- [Project Overview](#1-project-overview)
- [Features](#2-features)
- [Setup Instructions](#3-setup-instructions)
- [Usage Instructions](#4-usage-instructions)
- [API Documentation](#5-api-documentation)
- [Folder Structure](#6-folder-structure)

  ---


## 1) Project Overview

### This project is a secure notes application where users can:

- Register using email OTP authentication

- Log in securely with JWT stored in HttpOnly cookies

- Perform CRUD operations on personal notes (Create, Read, Update, Delete)

- Manage sessions with sign out functionality

### The backend is built with Node.js, Express, MongoDB, and the frontend is powered by React + Vite + Tailwind + shadcn/ui.

  ---

## 2) Features

- **Dual Authentication Methods**: Users can sign up and sign in using either a classic Email/OTP flow or through their Google Account for a streamlined experience. All user inputs are properly validated with clear error handling.

- **JWT-Based Authorization**: User sessions and access to private routes (like creating or deleting notes) are secured using JSON Web Tokens (JWTs), ensuring that users can only access their own data.

- **Full CRUD Functionality for Notes**: After logging in, authenticated users are greeted with a welcome dashboard where they can perform full Create, Read, Update, and Delete operations on their notes.

- **Responsive Design**: The frontend is mobile-friendly and built to closely replicate the provided design specifications.


  ---

## 3) Setup Instructions

- Clone the Repository
```markdown
git clone https://github.com/SirporRitesh/full-stack-secure-notes-app.git
cd full-stack-secure-notes-app
```

### Backend Setup
- Navigate to the backend directory:

```markdown
cd backend
```
- Install dependencies:

```markdown
npm install
```

- Create a .env file in the backend/ directory and add the following variables:

```markdown
DATABASE_URL="your_mongodb_connection_string"
JWT_SECRET="a_very_long_and_random_secret_string"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your_google_cloud_oauth_client_id"
GOOGLE_CLIENT_SECRET="your_google_cloud_oauth_client_secret"

# Gmail Credentials for sending OTP emails
GMAIL_USER="your_gmail_address_for_otp"
GMAIL_APP_PASSWORD="your_16_digit_gmail_app_password"
```
- Run the backend server:

```markdown
npm run dev
```
- **The server will run at → http://localhost:4000**

### Frontend Setup
- Navigate to the frontend directory:

```markdown
cd frontend
```
- Install dependencies:
  
```markdown
npm install
```

- Create a .env.local file in the frontend/ directory and add the following variable:

```markdown
VITE_GOOGLE_CLIENT_ID="your_google_cloud_oauth_client_id"
```

- Run the frontend development server:

```markdown
npm run dev
```
- **The application will run at → http://localhost:8080**

  ---


## 4) Usage Instructions

### Authentication:

- **Sign Up (Email)**: Enter your name, DOB, and email to receive an OTP.

- **Verify OTP**: Enter the 6-digit OTP to create your account and sign in.

- **Sign In (Email)**: Enter your email to receive an OTP for signing in.

- **Google OAuth**: Sign up or sign in instantly with your Google account.

- **Logout: Clears the httpOnly session cookie from the browser.**

### Notes:

- Once logged in, you will be redirected to the **dashboard**.

- Click **"Create Note"** to be taken to a new editor page.

- Write your note and click **"Save Note."** You will be redirected back to the dashboard.


  ---



## 5) API Documentation

### All `/notes` routes and the `/auth/me` route are protected by the `requireAuth` middleware.  

| Endpoint        | Method | Description                                                                 |
| :-------------- | :----: | :-------------------------------------------------------------------------- |
| /auth/send-otp  | POST   | Sends a 6-digit OTP to the provided email.                                  |
| /auth/verify-otp| POST   | Verifies the OTP, creates a user if they don't exist, and sets the session cookie. |
| /auth/google    | POST   | Verifies a Google ID token, creates a user if they don't exist, and sets the session cookie. |
| /auth/me        | GET    | Gets the details of the currently logged-in user.                           |
| /auth/logout    | POST   | Clears the session cookie.                                                  |


## Notes Routes (Protected)

| Endpoint    | Method | Description                                    |
| :---------- | :----: | :--------------------------------------------- |
| /notes      | GET    | Gets all notes for the authenticated user.     |
| /notes      | POST   | Creates a new note for the authenticated user. |
| /notes/:id  | GET    | Gets a single note by its ID.                  |
| /notes/:id  | PUT    | Updates a note by its ID.                      |
| /notes/:id  | DELETE | Deletes a note by its ID.                      |


  ---


## 6) Folder Structure
```markdown
full-stack-secure-notes-app/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── middleware/       # requireAuth.ts
│   │   ├── models/           # User.ts, Note.ts, Otp.ts
│   │   ├── routes/           # auth.ts, notes.ts
│   │   ├── utils/            # sendEmail.ts
│   │   └── index.ts          # Express server entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/                 # React + Vite Frontend
    ├── src/
    │   ├── components/       # Reusable UI components (auth, ui)
    │   ├── hooks/            # Custom hooks (useAuth, useToast)
    │   ├── lib/              # api.ts (Axios instance), utils.ts
    │   ├── pages/            # SignIn, SignUp, NotesPage, NoteEditorPage
    │   └── main.tsx          # React application entry point
    ├── .env.local.example
    └── package.json

```
