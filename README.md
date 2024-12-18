# Felt Sense

<div>
    <a href="https://www.loom.com/share/d73dcd71a85645b98cfaa75190e3c550">
      <p>Felt Sense: AI Voice Companion</p>
    </a>
    <a href="https://www.loom.com/share/d73dcd71a85645b98cfaa75190e3c550">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/d73dcd71a85645b98cfaa75190e3c550-21806859b3343b0a-full-play.gif">
    </a>
  </div>

Felt Sense is an AI Assistant that helps you navigate your emotional life through patient natural conversations and emotional intelligence.

## Project Overview

Felt Sense is a modern web application that provides an AI-powered emotional support companion. It combines speech recognition, natural language processing, LLM intelligence and voice synthesis to create a seamless conversational experience focused on emotional well-being.

### Key Features

- 🎙️ Speech-to-text transcription using Deepgram
- 🤖 Advanced AI responses powered by Claude 3.5 Sonnet
- 🔊 Natural voice synthesis via OpenAI TTS
- 🔐 Secure authentication with WorkOS AuthKit
- 💾 Persistent conversation history
- 🎯 Real-time emotional analysis and support

### Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API routes (serverless)
- **Database**: Neon (Postgres)
- **Authentication**: WorkOS AuthKit
- **AI/ML**:
  - Claude 3.5 Sonnet (LLM)
  - Deepgram (Speech-to-Text)
  - OpenAI TTS (Text-to-Speech)

## Project Structure

```bash
felt-sense/
├── docker/              # Container configuration
├── prisma/             # Database schema and migrations
├── src/
│   ├── app/            # Next.js app router pages and components
│   │   ├── api/        # API route handlers
│   │   ├── auth/       # Authentication related components
│   │   ├── chat/       # Chat interface pages
│   │   ├── components/ # Reusable React components
│   │   ├── store/      # State management (Zustand)
│   │   ├── page.tsx    # Landing page with hero section
│   │   └── layout.tsx  # Root layout with metadata
│   ├── lib/            # Core application logic
│   │   ├── api/        # API client functions
│   │   ├── db/         # Database interactions
│   │   └── utils/      # Utility functions for AI services
│   ├── types/          # TypeScript type definitions
│   └── middleware.ts   # Auth protection & routing middleware
├── public/             # Static assets
├── .env               # Environment variables (gitignored)
└── config files        # Various configuration files at root
```

## API Routes

The application uses Next.js API routes for serverless backend functionality:

- **Authentication (`/api/auth/`)**

  - `GET /api/auth` - Get current session
  - `GET /api/auth/callback` - Handle OAuth callback

- **Language Model (`/api/LLM/`)**

  - `POST /api/LLM` - Process conversations with Claude 3.5 Sonnet

- **Speech-to-Text (`/api/stt/`)**

  - `POST /api/stt` - Convert audio to text using Deepgram

- **Text-to-Speech (`/api/tts/`)**
  - `POST /api/tts` - Generate speech from text using OpenAI TTS

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/your-repo/felt-sense.git
cd felt-sense
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Required environment variables:

- DATABASE_URL="your-neon-db-url"
- WORKOS_API_KEY="your-workos-key"
- WORKOS_CLIENT_ID="your-workos-client-id"
- ANTHROPIC_API_KEY="your-claude-api-key"
- DEEPGRAM_API_KEY="your-deepgram-key"
- OPENAI_API_KEY="your-openai-key"

4. Initialize the database:

```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the development server:

```bash
bun run dev
or
npm run dev
```

6. Access the application at `http://localhost:3000`.

