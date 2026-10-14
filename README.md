# CV to Venture

**Upload your CV, get a business idea built around your skills.**

CV to Venture is a small web app that reads a person's CV (PDF) and uses a large language model to suggest a startup idea that fits their experience. It is a portfolio project, built step by step while learning.

> Status: early development. The plan below shows what is done and what comes next.

## How it works

1. The user signs up and logs in.
2. The user uploads a CV as a PDF. The file is stored privately.
3. The server extracts the text from the PDF.
4. The text is sent to a language model together with a JSON schema. The model must answer in that exact structure (structured output).
5. The server validates the answer and saves the idea in the database.
6. The user sees the idea and can come back to it later.

```
Browser ──> Next.js server ──> Supabase Storage (CV PDF)
                │
                ├──> PDF text extraction
                ├──> Azure OpenAI (Microsoft Foundry) ──> JSON business idea
                └──> Supabase Postgres (saved ideas)
```

The model API key lives only on the server and is never sent to the browser.

## Example output (planned format)

```json
{
  "title": "Short name of the business idea",
  "problem": "What problem it solves",
  "solution": "What the product or service is",
  "targetCustomers": "Who pays for it",
  "whyYou": "Which parts of the CV make this person a good founder for it",
  "firstSteps": ["Step 1", "Step 2", "Step 3"]
}
```

## Tech stack

| Part | Choice | Why |
|---|---|---|
| App (frontend + backend) | Next.js (App Router), TypeScript | One project for pages and server code; types catch errors early |
| Styling | Tailwind CSS | Fast, consistent styling without separate CSS files |
| Authentication | Supabase Auth | Secure sign-up, login and sessions without building them from scratch |
| Database | Supabase Postgres (EU region) | SQL database with Row Level Security, so each user only sees their own data |
| File storage | Supabase Storage (private bucket) | CVs stored per user, protected by access policies |
| PDF text extraction | `unpdf` | Lightweight, runs server-side |
| Language model | Azure OpenAI via Microsoft Foundry (Sweden Central) | EU data residency, structured outputs |
| Validation | Zod | Checks the model's JSON before it is saved |
| Hosting | Vercel | Deploys automatically from GitHub |

## Roadmap

- [x] Project idea, architecture and tech stack
- [ ] Azure / Microsoft Foundry subscription set up
- [x] Next.js project setup
- [ ] Sign up, login and logout with Supabase Auth
- [ ] CV upload (PDF) to Supabase Storage
- [ ] Text extraction from PDF
- [ ] Business idea generation with structured JSON output
- [ ] Save and list ideas in Postgres (with Row Level Security)
- [ ] Deploy to Vercel
- [ ] GDPR basics: consent before upload, clear AI-generated label, delete my data
- [ ] Polish: loading states, error handling, nicer UI

## Privacy by design

A CV contains personal data, so the app is planned with GDPR in mind from the start:

- All data is stored in the EU (Supabase EU region, Azure Sweden Central).
- CV files are private and only accessible to their owner.
- The user gives explicit consent before a CV is processed by AI.
- AI-generated content is clearly labeled (EU AI Act transparency).
- The user can delete their CV, ideas and account.

## Running locally

Requirements: Node.js 20 or newer and a free [Supabase](https://supabase.com) project.

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/MarijaGojkov/cv-to-venture.git
   cd cv-to-venture
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your Supabase project URL and publishable key
   (Supabase dashboard: Project Settings, API Keys).
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000, sign up, confirm your email and log in.

## Project structure

```
src/
  app/
    page.tsx              Landing page
    login/                Login and sign-up form + Server Actions
    auth/confirm/         Handles the link in the confirmation email
    dashboard/            Protected page (only for logged-in users) + logout
  lib/supabase/
    server.ts             Supabase client for server code
    proxy.ts              Refreshes the session and protects pages
  proxy.ts                Runs before each request (Next.js proxy)
```

## About

Built by Marija Gojkov as a portfolio project while learning to build AI-powered applications.
