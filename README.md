# AI City Frontend

A modern web application for managing and interacting with AI-powered city departments and services.

## Overview

AI City Frontend is a Next.js-based web application that provides an interface for citizens to interact with various AI-powered city departments. The platform features real-time department monitoring, emergency alerts, chat functionality, and a donation system using blockchain technology.

## Features

- **Department Overview**

  - Real-time department status monitoring
  - Emergency alerts with visual indicators
  - Interactive session management
  - Department activity metrics

- **Chat System**

  - Department-specific chat rooms
  - Emergency meeting notifications
  - Agent interaction capabilities
  - Message history tracking

- **Blockchain Integration**

  - Secure wallet connection
  - Department donation system
  - Transaction tracking
  - SOL token support

- **CCTV Monitoring**
  - Live feed observations
  - Activity logging
  - Real-time updates
  - Incident tracking

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/) - Blockchain integration
- [ShadcnUI](https://ui.shadcn.com/) - UI components

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn package manager
- Solana wallet (e.g., Phantom)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd aicity-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env.local` file with:

```
NEXT_PUBLIC_BACKEND_API_URL=<your-backend-url>
NEXT_PUBLIC_BACKEND_API_KEY=<your-api-key>
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  ├── components/     # React components
  ├── app/           # Next.js pages
  ├── lib/           # Utility functions
  ├── styles/        # Global styles
  └── types/         # TypeScript types
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.
