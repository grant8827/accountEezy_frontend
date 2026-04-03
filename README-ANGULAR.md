# AccountEezy Angular Frontend

This is the Angular frontend for AccountEezy, matching the structure and design of the React client.

## Features

- **Authentication**: Login and Multi-Step Business Registration with JWT
  - 4-step registration wizard with Material Stepper
  - Personal information, business details, address, and contact info
  - TRN (9 digits) and NIS validation
  - Jamaica parishes dropdown
  - Business types and industries selection
  - Auto-population of business name and email
  - Selected plan integration from pricing page
- **Dashboard**: Overview of business metrics and quick actions
- **Employee Management**: Track and manage employees
- **Payroll Processing**: Automated payroll calculation
- **Transaction Tracking**: Monitor financial transactions
- **Tax Reports**: Generate tax compliance reports
- **Business Management**: Multi-business support

## Tech Stack

- **Angular 21**: Modern standalone components
- **Angular Material**: UI component library
- **RxJS**: Reactive programming
- **TypeScript**: Type-safe development
- **Material Icons**: Icon library
- **Chart.js & ng2-charts**: Data visualization

## Project Structure

```
src/
├── app/
│   ├── components/          # Feature components
│   │   ├── auth/           # Login, Register
│   │   ├── business/       # Business management
│   │   ├── employees/      # Employee management
│   │   ├── payroll/        # Payroll processing
│   │   ├── transactions/   # Transaction tracking
│   │   ├── tax/            # Tax reports
│   │   └── debug/          # Debugging tools
│   ├── pages/              # Page components
│   │   ├── dashboard.component.ts
│   │   ├── landing-page.component.ts
│   │   ├── admin-panel.component.ts
│   │   ├── pricing-page.component.ts
│   │   └── payment-page.component.ts
│   ├── services/           # Business logic
│   │   ├── auth.service.ts
│   │   └── api.service.ts
│   ├── guards/             # Route guards
│   │   └── auth.guard.ts
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts
│   ├── app.routes.ts       # Route configuration
│   ├── app.config.ts       # App configuration
│   └── app.ts              # Root component
├── environments/           # Environment configs
├── styles.css             # Global styles
└── index.html             # HTML entry point
```

## Design Theme

The application uses a sophisticated black and gold color scheme:

- **Primary Black**: #000000
- **Primary Gold**: #C7AE6A
- **Light Cream**: #e3d6b4
- **Dark Gold**: #b99a45
- **Dark Gray**: #1a1a1a

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v11 or higher)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Development Server

Run `npm start` to start the dev server. Navigate to `http://localhost:4200/`. The application will automatically reload when you change source files.

## Routes

- `/` - Landing page
- `/login` - User login
- `/register` - Multi-step business registration
- `/dashboard` - Main dashboard (protected)
- `/admin` - Admin panel (protected)
- `/businesses` - Business management (protected)
- `/employees` - Employee management (protected)
- `/payroll` - Payroll processing (protected)
- `/transactions` - Transaction history (protected)
- `/tax` - Tax reports (protected)
- `/pricing` - Pricing plans
- `/payment` - Payment processing

## Registration Form

The multi-step registration form (`/register`) matches the React version exactly:

### Step 1: Personal Information
- First Name, Last Name, Email, Phone
- Password (min 6 characters) with confirmation
- Password mismatch validation

### Step 2: Business Information
- Business Name (auto-populated from name)
- Business Registration Number
- TRN (Tax Registration Number) - 9 digits required
- NIS (National Insurance Scheme) - 9 digits optional
- Business Type dropdown (7 types: Sole Proprietorship, Partnership, LLC, Corporation, etc.)
- Industry dropdown (18 industries from Agriculture to Other)

### Step 3: Business Address
- Street Address
- City/Town
- Parish dropdown (14 Jamaica parishes)
- Postal Code (optional)
- Country (Jamaica - readonly)

### Step 4: Contact & Review
- Business Phone
- Business Email (auto-populated from personal email)
- Website (optional)
- Complete registration summary
- Selected plan display (if coming from pricing page)

### Key Features:
- Material Stepper for visual progress
- Step-by-step validation
- Auto-population of business name and email
- TRN/NIS digit counters and numeric validation
- Summary view before submission
- Stores data in localStorage
- Navigates to `/payment` on completion

## API Integration

The app connects to the .NET backend API:

- **Development**: `http://localhost:5000/api`
- **Production**: Configure in `src/environments/environment.prod.ts`

## Authentication

- Uses JWT token-based authentication
- Tokens stored in localStorage
- Auth guard protects routes
- HTTP interceptor adds auth headers automatically

## Material Theme

The app uses Angular Material with custom theming to match the React client's design. All Material components are styled with the black and gold color palette.

## Contributing

This Angular frontend is designed to be a 1:1 match with the React client in terms of functionality and design.

## License

Copyright © 2026 AccountEezy. All rights reserved.
