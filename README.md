# Real-Time Chat Application

## Overview

This project is a real-time, two-way chat application built using Next.js and integrated with PubNub.

## Tech Stack

- Next.js
- TailwindCSS
- Pubnub
- Playwright

## Getting Started

### Prerequisites:

- Node.js (v18 or later)
- npm (v9 or later)
- A free PubNub account

First, install the dependencies:

```bash
npm run install
```

Add publishKey and subscribeKey in .env file and run command

```
npm run dev
```

## Features

- Create or Join Chat: Users can create a new chat or join an existing chat using a provided code.
- Real-Time Messaging: Messages are exchanged in real-time between participants.
- Chat View: Mimics standard chat experiences with text balloons for each participant.
- Message Formatting: Supports single-line, multi-line (using Shift+Enter), and emojis.
- Responsive Design: Ensures usability across various devices and screen sizes.
- TypeScript: Codebase is written in TypeScript with proper typing.
- Edit Past Messages: Allows editing of previously sent messages.
- Reactions: Users can react to messages.
- Timestamps: Displays timestamps for each message.
- NextJS: Utilizes NextJS for server-side rendering and improved performance.
