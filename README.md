# Krishan Traders Client

A modern web application for managing agricultural supplies and fertilizer
inventory. Built with Next.js and TypeScript.

## Features

- 🔐 **Authentication & Authorization**

  - Secure login system
  - Role-based access control (Admin/User)

- 📦 **Stock Management**

  - Add, edit, and delete stock items
  - Track expiry dates
  - Monitor inventory levels
  - Stock status tracking (Accepted/Rejected/Expired)

- 💰 **Transaction Management**

  - Record sales transactions
  - View transaction history
  - Generate transaction reports

- 👤 **User Management**
  - User profiles
  - Role management
  - Account settings

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**:
  - Shadcn/ui
  - Radix UI
  - Lucide Icons
- **Form Handling**: React Hook Form + Zod
- **State Management**: React Context
- **Date Handling**: date-fns
- **Notifications**: Sonner

## Getting Started

1. Clone the repository:

```bash
git clone <your-repo-url>
```

2.create .env.local file

```
BASE_API=https://pos-development-express.vercel.app/api
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

Remember to:

1. Replace placeholder URLs with actual repository and live demo links
2. Update the environment variables section with your actual required variables
3. Add any additional project-specific setup instructions
4. Update the API routes section if your endpoints are different

## Related Links

- Client Repository:
  [Krishan Traders Server](https://github.com/pallabKumarS/krishan-traders-server)
- Live Server:
  [https://krishan-traders.vercel.app](https://krishan-traders.vercel.app)
