# Contributing to Legally Legit AI

First off, thank you for considering contributing to Legally Legit AI! It's people like you that make this such a great project.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

### Fork & Clone

1. Fork the repository on GitHub.
2. Clone your fork locally:

   ```bash
   git clone https://github.com/your-username/legally-legit-ai.git
   cd legally-legit-ai
   ```

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

### Local Development Setup

1. Create a `.env.local` file by copying the example:

   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your development keys for Supabase, Stripe, and OpenAI. Refer to `ENVIRONMENT_SETUP.md` for more details.

3. Start the development server:

   ```bash
   npm run dev
   ```

   The app should now be running on [http://localhost:3000](http://localhost:3000).

## Making Changes

- Create a new branch for your feature or bug fix.
- Write clean, commented code and follow the existing code style.
- Ensure your changes are well-tested.
- Update documentation if necessary.

## Submitting a Pull Request

- Push your changes to your fork.
- Open a pull request to the `main` branch.
- Provide a clear description of your changes.
- Link any relevant issues.

Thank you for your contribution!
