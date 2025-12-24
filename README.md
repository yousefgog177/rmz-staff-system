# RMZ Staff Management System

A comprehensive staff management system for RMZ merchants built with Node.js, Express, MongoDB, and Next.js.

## Features

- 🔐 **Authentication System**: Email/password login with MFA (6-digit OTP via SendGrid)
- 👥 **Staff Management**: Invite staff members, assign permissions, manage roles
- 📦 **Order Management**: View, create, and update orders
- 🛍️ **Product Management**: Browse products, view details
- 📊 **Analytics Dashboard**: Store statistics and insights
- 📂 **Categories Management**: Organize product categories
- 💳 **Subscriptions**: Manage customer subscriptions
- 🎨 **Beautiful UI**: Dark blue gradient theme with responsive design

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose ODM
- SendGrid for email services
- RMZ Merchant API integration

### Frontend
- Next.js 14
- React 18
- Tailwind CSS
- Responsive design with dark theme

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- SendGrid account and API key
- RMZ Merchant API access

### 1. Clone the Repository
```bash
git clone https://github.com/yousefgog177/rmz-staff-system
cd rmz-staff
```

### 2. Configure Environment Variables

Copy the example config file and fill in your credentials:
```bash
cp config.example.js config.js
```

Edit `config.js` with your actual credentials:
```javascript
module.exports = {
    MONGODB_URI: "mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE",
    SENDGRID_API_KEY: "SG.YOUR_SENDGRID_API_KEY",
    RMZ_API_URL: "https://merchant-api.rmz.gg/shawarma",
    BACKEND_API_URL: "http://localhost:3001",
    PORT: 3001
};
```

### 3. Install Backend Dependencies
```bash
npm install
```

### 4. Install Frontend Dependencies
```bash
cd ui
npm install
cd ..
```

### 5. Run the Application

**Backend (Terminal 1):**
```bash
node index.js
```
The backend will run on http://localhost:3001

**Frontend (Terminal 2):**
```bash
cd ui
npm run dev
```
The frontend will run on http://localhost:3000

## Project Structure

```
rmz-staff/
├── config.example.js      # Configuration template
├── db.js                  # Database connection
├── heart.js               # Core functions (email, etc.)
├── rmz.js                 # RMZ API wrapper
├── index.js               # Express server
├── models/                # MongoDB models
│   ├── users.js
│   ├── sessions.js
│   ├── stores.js
│   ├── invites.js
│   └── ticketsOTP.js
├── routes/                # API routes
│   ├── auth/
│   ├── user/
│   ├── stores/
│   ├── orders/
│   ├── products/
│   ├── categories/
│   ├── subscriptions/
│   ├── invites/
│   └── staffs/
├── messages/              # Email templates
│   ├── OTP.html
│   └── Invite.html
└── ui/                    # Next.js frontend
    ├── app/
    │   ├── page.js        # Landing page
    │   ├── signin/
    │   ├── signup/
    │   ├── verify-mfa/
    │   ├── setup-store/
    │   ├── accept-invite/
    │   ├── set-password/
    │   └── dashboard/     # Dashboard pages
    ├── components/
    │   ├── DashboardLayout.js
    │   ├── Sidebar.js
    │   ├── LoadingSpinner.js
    │   └── Alert.js
    └── lib/
        ├── api.js         # API functions
        ├── config.js      # Frontend config
        └── utils.js       # Utility functions
```

## Permissions System

The system supports granular permissions:
- `see_orders` - View orders list
- `see_order` - View order details
- `create_order` - Create new orders
- `update_order` - Update order status
- `products_list` - View products list
- `product_details` - View product details
- `categories_list` - View categories
- `subscriptions_list` - View subscriptions
- `subscription_details` - View subscription details
- `statics` - View statistics dashboard
- `add_staff` - Invite new staff members
- `remove_staff` - Remove staff members
- `see_staffs` - View staff list

## API Documentation

### Authentication Flow
1. User signs up with email/password
2. System sends MFA code via email
3. User verifies MFA code
4. User sets up store with RMZ API token
5. Dashboard access granted

### Invite Flow
1. Admin creates invite with email and permissions
2. System sends invitation email
3. Recipient accepts invite
4. System creates user account
5. User sets password
6. User gains access based on assigned permissions

## License

This project is private and proprietary.

## Support

For support, please contact the development team.
Discord: @teamlog
