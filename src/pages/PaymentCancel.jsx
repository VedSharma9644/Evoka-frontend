import React from "react";
import {Link} from "react-router-dom";
function PaymentCancel() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-lg text-gray-700 mb-6">Your payment has been cancelled. Please try again.</p>
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Go Back to Home
        </Link>
        </div>
    );
    }
    export default PaymentCancel;