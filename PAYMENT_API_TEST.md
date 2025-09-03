# 💳 Payment API Data Structure Test

## 🔍 **What Data is Being Sent to Payment API**

When a user books multiple tickets, the following data structure is sent to `api/events/{eventId}/participate`:

### **📋 Complete Data Structure:**

```json
{
  "participants": [
    {
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "name": "Jane Smith", 
      "email": "jane@example.com"
    }
  ],
  "total_tickets": 2,
  "total_amount": 50.00,
  "currency": "EUR",
  "event_id": 25,
  "event_title": "Test Event",
  "user_id": "1",
  "payment_method": "paypal"
}
```

### **🔧 How to Test the Data Structure:**

1. **Start the development server:**
   ```bash
   cd evoka
   npm run dev
   ```

2. **Login with test credentials:**
   - Username: `testuser`
   - Password: `testpass`

3. **Navigate to an event page:**
   - Go to `http://localhost:5173/events/25`

4. **Open browser console** (F12 → Console tab)

5. **Click "Participate" button** and fill out the form:
   - Add 2-3 participants with names and emails
   - Click "Book Tickets"

6. **Check the console output** - you'll see:
   ```
   🔍 Payment API Data Being Sent: {
     participants: [...],
     total_tickets: 2,
     total_amount: 50.00,
     currency: "EUR",
     event_id: 25,
     event_title: "Test Event",
     user_id: "1",
     payment_method: "paypal"
   }
   ```

### **✅ Data Structure Validation:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `participants` | Array | ✅ | List of participant objects with name/email |
| `total_tickets` | Number | ✅ | Number of tickets being purchased |
| `total_amount` | Number | ✅ | Total cost (price × tickets) |
| `currency` | String | ✅ | Currency code (EUR) |
| `event_id` | Number | ✅ | Event identifier |
| `event_title` | String | ✅ | Event name for payment reference |
| `user_id` | String | ✅ | User making the booking |
| `payment_method` | String | ✅ | Payment gateway (paypal) |

### **🎯 Payment Flow:**

1. **Free Events:** `total_amount: 0` → No payment redirect
2. **Paid Events:** `total_amount > 0` → Redirects to PayPal checkout

### **🔧 Backend Integration:**

Your backend should handle this data structure and:
1. Validate the participants data
2. Calculate the total amount
3. Create payment session with PayPal
4. Return redirect URL for payment
5. Handle payment success/failure callbacks

### **📝 Example Backend Response:**

```json
{
  "message": "Payment session created",
  "success": true,
  "redirect": "https://paypal.com/checkout?token=ABC123",
  "payment_id": "PAY-123456789"
}
```

## 🚀 **Ready for Production!**

The data structure is now complete and ready for integration with your payment API. All necessary fields are included for proper payment processing.

