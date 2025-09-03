import React from "react";
function PaymentSuccess() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
            <p className="text-lg text-gray-700 mb-6">Your payment has been processed successfully.</p>
            <a href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Go Back to Home
            </a>
        </div>
    );
}
export default PaymentSuccess;