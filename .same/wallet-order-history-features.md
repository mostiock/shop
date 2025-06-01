# Order History and Wallet Features

## Overview

The BOLES Smart Home platform has been enhanced with two key features to improve the user experience and enable seamless purchases:

1. **Order History**: A comprehensive view of past purchases with detailed information about each order
2. **Wallet System**: A digital wallet that users can top up with funds and use for purchases

These features are integrated into the user profile page, providing a centralized location for users to manage their account, orders, and finances.

## Order History Features

### Components and Implementation

- **OrderHistory Component**: Located at `src/components/profile/OrderHistory.tsx`
  - Displays a list of orders with summary information
  - Expandable accordions to view order details
  - Status indicators with appropriate icons and colors
  - Shows product details, quantities, and prices
  - Includes shipping information for shipped orders
  - Provides action buttons based on order status

### Key Features

- **Order Status Tracking**: Visual indicators for different statuses (pending, processing, shipped, delivered, cancelled, refunded)
- **Order Timeline**: Shows order date and relative time (e.g., "3 days ago")
- **Order Details**: Complete breakdown of items, prices, shipping, tax, and discounts
- **Shipping Information**: For shipped orders, displays tracking number and estimated delivery date
- **Action Buttons**: Context-aware buttons for different order statuses (e.g., cancel for pending orders, track for shipped orders)

### Data Structure

The order data structure (`OrderType`) includes:
- Order metadata (ID, user, dates, status)
- Line items with product details
- Shipping and billing addresses
- Payment information
- Price breakdown (subtotal, tax, shipping, discounts)
- Tracking and delivery information

## Wallet Features

### Components and Implementation

- **Wallet Component**: Located at `src/components/profile/Wallet.tsx`
  - Displays current balance
  - Shows transaction history
  - Provides top-up functionality
  - Enables withdrawals to bank accounts
  - Includes transaction filtering by type

### Key Features

- **Balance Management**: Clear display of current wallet balance
- **Top-Up Functionality**: Dialog to add funds with preset amounts
- **Withdrawal System**: Secure process to transfer funds to bank accounts
- **Transaction History**: Comprehensive list of all wallet transactions
- **Transaction Filtering**: Tabs to filter by transaction type (deposits, withdrawals, purchases)
- **Status Indicators**: Visual indicators for transaction status (completed, pending, failed)

### Data Structure

The wallet data structure includes:
- `WalletType`: Contains user information, balance, and transaction history
- `WalletTransactionType`: Detailed information about individual transactions
  - Transaction metadata (ID, user, date)
  - Amount and direction (positive for deposits/refunds, negative for withdrawals/purchases)
  - Transaction type (deposit, withdrawal, purchase, refund)
  - Status (pending, completed, failed)
  - Reference information and descriptions

## Integration with Profile Page

The order history and wallet features are integrated into the user profile page, accessible via tabs:

1. **Orders Tab**: Displays the order history component
2. **Wallet Tab**: Shows the wallet component with balance and transactions
3. **Account Tab**: Provides access to account settings through Clerk's UserProfile component
4. **Security Tab**: Offers security-related settings and payment method management

## Mock Data Implementation

For demonstration purposes, mock data generators are provided:
- `generateMockOrders`: Creates realistic order data with random products, dates, and statuses
- `generateMockWallet`: Builds a wallet with transaction history
- `generateMockWalletTransactions`: Generates various transaction types with appropriate amounts

These generators create a realistic user experience for testing and demonstration without requiring a backend database.

## User Experience Enhancements

- **Toast Notifications**: Feedback for actions like top-ups and withdrawals
- **Responsive Design**: Adapts to different screen sizes with appropriate layout changes
- **Icons and Badges**: Visual indicators to help users quickly understand status and types
- **Currency Formatting**: Consistent formatting of monetary values
- **Date Formatting**: Human-readable date formats including relative time

## Future Enhancements

Potential improvements for these features include:

1. **Backend Integration**: Connect to a real database and payment processing system
2. **Payment Method Management**: Allow users to add and manage payment methods directly
3. **Subscription Management**: Enable recurring payments and subscription tracking
4. **Order Tracking Map**: Visual map of order delivery progress
5. **Receipt Downloads**: Generate and download PDF receipts for orders
6. **Auto-Refill Options**: Set up automatic wallet top-ups when balance is low
7. **Loyalty Points**: Integrate with a loyalty/rewards program
8. **Budget Tools**: Add spending analytics and budget management features
