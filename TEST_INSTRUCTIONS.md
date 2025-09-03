# 🧪 Local Testing Instructions for Multi-Participant Booking

## 🚀 Quick Start

I've set up a **local development mode** that allows you to test the multi-participant booking feature without needing the live backend or Google OAuth.

## 🔑 Test User Credentials

**Username:** `testuser`  
**Password:** `testpass`

## 📋 How to Test

### 1. Start the Development Server
```bash
cd evoka
npm run dev
```

### 2. Login with Test User
1. Go to `http://localhost:5173/login`
2. Use the test credentials:
   - **Username:** `testuser`
   - **Password:** `testpass`
3. Click "Login"

### 3. Test the Multi-Participant Booking
1. Navigate to any event page (e.g., `http://localhost:5173/events/25`)
2. Click the **"Participate"** button
3. You'll see the new enhanced modal with:
   - Event information
   - Multiple participant form
   - Real-time cost calculation
   - Booking summary

### 4. Test the Booking Flow
1. **Add Participants:**
   - Enter names for multiple people
   - Add email addresses (optional)
   - Click "Add Another Participant" to add more

2. **Review Summary:**
   - Check total participants count
   - Verify total cost calculation
   - Review booking details

3. **Complete Booking:**
   - Click "Book Tickets"
   - You'll see a success message with participant names

## 🎯 What You Can Test

✅ **Multi-participant form** - Add/remove participants  
✅ **Real-time cost calculation** - See total price update  
✅ **Form validation** - Try empty names, duplicate names  
✅ **Booking summary** - Review before confirming  
✅ **Success feedback** - See confirmation with participant names  
✅ **Responsive design** - Test on different screen sizes  

## 🔧 Technical Details

- **Development Mode:** Automatically detects localhost
- **Mock API:** Provides realistic responses for testing
- **No Backend Required:** Works completely offline
- **Real UI:** Full user interface experience

## 🐛 Troubleshooting

**If login doesn't work:**
- Make sure you're using exactly: `testuser` / `testpass`
- Check browser console for any errors
- Try refreshing the page

**If booking doesn't work:**
- Check browser console for mock API logs
- Ensure you're on localhost:5173
- Try with different participant combinations

**If you see blank pages or errors:**
- The mock system has been fixed to handle all API endpoints
- Refresh the page to clear any cached errors
- Check browser console for any remaining issues

## 🗄️ Alternative: Create Real Database User

If you prefer to use a real database user instead of the mock system:

### Option 1: Using PHP Script
```bash
cd evoka
php create_test_user.php
```

### Option 2: Using SQL Script
1. Open your MySQL database
2. Run the SQL commands from `create_test_user.sql`
3. The user will be created with:
   - **Username:** testuser
   - **Password:** testpass
   - **Email:** test@example.com

### Option 3: Manual Database Entry
1. Open your database management tool (phpMyAdmin, MySQL Workbench, etc.)
2. Go to the `users` table
3. Insert a new record with:
   - username: `testuser`
   - email: `test@example.com`
   - password: `$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi` (this is the hashed version of 'testpass')
   - name: `Test User`
   - accountType: `private`
   - created_at: current timestamp
   - updated_at: current timestamp

## 🎉 Success Indicators

When everything works correctly, you should see:
1. ✅ Successful login with test user
2. ✅ Enhanced participate modal opens
3. ✅ Can add multiple participants
4. ✅ Cost calculation updates in real-time
5. ✅ Success message shows all participant names

---

**Happy Testing!** 🚀

The multi-participant booking system is now ready for local testing without any backend dependencies.
