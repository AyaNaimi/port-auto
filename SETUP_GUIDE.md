# Smart Portfolio - Setup and Usage Guide

## Overview

Smart Portfolio is a comprehensive portfolio module management system that allows users to create professional portfolios using customizable templates. The system includes admin capabilities for managing portfolio modules, payment integration for premium templates, and export functionality for both PDF and source code.

## Features

### Core Functionality

1. **User Authentication**
   - Secure registration and login using Supabase Auth
   - Role-based access control (admin vs regular users)
   - Session management

2. **Portfolio Module Management (Admin)**
   - Create, edit, and delete portfolio templates
   - Set modules as free or paid
   - Upload preview images
   - Activate/deactivate modules
   - Categorize modules

3. **Portfolio Creation**
   - Select from available templates
   - Fill out detailed portfolio forms with:
     - Personal information
     - Professional skills
     - Projects showcase
     - Tools and technologies
     - Custom color schemes
   - AI-powered bio generation
   - Image uploads for profile and projects

4. **Portfolio Preview & Export**
   - Live preview of generated portfolios
   - Export as PDF
   - Download source code as ZIP file
   - Multiple template styles (Modern, Minimal, Creative, Professional)

5. **Payment Integration**
   - Secure payment processing for premium modules
   - Transaction tracking
   - Automatic access granting after successful payment
   - Payment history for admins

6. **User Dashboard**
   - View all created portfolios
   - Publish/unpublish portfolios
   - Delete portfolios
   - Quick access to portfolio previews

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Payment**: Simulated payment system (ready for Stripe integration)
- **Export**: jsPDF, html2canvas, JSZip

## Database Schema

### Tables

1. **users**
   - User accounts with role-based permissions
   - Links to Supabase Auth

2. **portfolio_modules**
   - Template definitions
   - Pricing information
   - Template code and metadata

3. **user_portfolios**
   - User-created portfolios
   - Portfolio data and settings
   - Publication status

4. **payments**
   - Payment transactions
   - Transaction status tracking

5. **user_module_access**
   - Tracks which users have access to which modules
   - Links payments to module access

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**

   The `.env` file already contains Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://bulhaavdhgxpmohycdxb.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. **Database Migration**

   The database schema has been automatically created with the following:
   - All necessary tables
   - Row Level Security (RLS) policies
   - Indexes for performance
   - Triggers for automatic timestamps
   - Helper functions

### Creating an Admin User

1. **Register a new user** through the application
2. **Connect to your Supabase database** via the Supabase Dashboard
3. **Update the user's role** to admin:
   ```sql
   UPDATE users
   SET role = 'admin'
   WHERE email = 'your-admin-email@example.com';
   ```

### Running the Application

1. **Development mode**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5000`

2. **Production build**
   ```bash
   npm run build
   npm start
   ```

## Usage Guide

### For Users

1. **Register/Login**
   - Navigate to the application
   - Click "Register" to create an account
   - Or "Login" if you already have an account

2. **Create a Portfolio**
   - Click "Create New Portfolio" from the home page or header
   - Select a template (free or paid)
   - If paid, complete the payment process
   - Fill out the portfolio form:
     - Personal tab: Basic info, bio generation
     - Projects tab: Add your projects
     - Tools tab: List your tools/technologies
     - Design tab: Customize colors and template
   - Click "Create Portfolio"

3. **Preview and Export**
   - View your portfolio in real-time
   - Download as PDF for sharing
   - Download source code for self-hosting
   - Publish to make it publicly viewable

4. **Manage Portfolios**
   - Access "My Portfolios" from the header
   - View all your created portfolios
   - Publish/unpublish portfolios
   - Delete unwanted portfolios

### For Admins

1. **Access Admin Dashboard**
   - Click "Admin" in the header (only visible to admin users)

2. **Manage Modules**
   - Create new portfolio templates
   - Set pricing (free or paid)
   - Upload preview images
   - Write template code
   - Activate/deactivate modules

3. **View Users**
   - See all registered users
   - View user roles and registration dates

4. **Monitor Payments**
   - View all payment transactions
   - Track payment status
   - See which users purchased which modules

## Payment System

The current implementation uses a simulated payment system for demonstration purposes. To integrate with a real payment processor:

### Stripe Integration (Recommended)

1. **Setup Stripe Account**
   - Create a Stripe account at https://stripe.com
   - Get your API keys from the Stripe Dashboard

2. **Add Environment Variables**
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

3. **Update Payment Component**
   - Replace `StripeCheckout.tsx` with actual Stripe Elements
   - Implement server-side payment intent creation
   - Handle webhooks for payment confirmation

## Security Considerations

1. **Row Level Security**
   - All tables have RLS enabled
   - Users can only access their own data
   - Admins have elevated permissions

2. **Authentication**
   - Secure password hashing via Supabase
   - JWT-based session management
   - Automatic token refresh

3. **Data Validation**
   - Input validation on both client and server
   - SQL injection prevention via parameterized queries
   - XSS protection

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify Supabase credentials in `.env`
   - Check if user table was created correctly
   - Ensure RLS policies are applied

2. **Module Access Issues**
   - Check `user_module_access` table
   - Verify payment status is 'completed'
   - Ensure triggers are functioning

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run check`

## API Endpoints

The application uses Supabase's auto-generated REST API:

- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `GET /portfolio_modules` - Fetch available modules
- `POST /user_portfolios` - Create portfolio
- `GET /user_portfolios` - Fetch user's portfolios
- `POST /payments` - Create payment record
- `POST /user_module_access` - Grant module access

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions:
- Check the troubleshooting section
- Review Supabase documentation
- Contact the development team

## License

MIT License - See LICENSE file for details
