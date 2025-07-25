import React, { useState } from "react";
import axios from "axios";
import "./PaymentForm.css";
import shraddhaadzLogo from "./assets/shraddhaadz-logo.jpg";
const PaymentForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    purpose: "",
    amount: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpay();
    if (!res) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:8080/api/payment/create-order",
        { amount: form.amount }
      );

      const { amount, id: order_id, currency } = result.data;

      const options = {
       key: process.env.REACT_APP_RAZORPAY_KEY, 
        amount: amount.toString(),
        currency: currency,
        name: "Shraddhaaz",
        description: form.purpose,
        order_id: order_id,
        handler: function (response) {
          alert("Payment Successful!");
          console.log("Razorpay Payment ID:", response.razorpay_payment_id);
        },
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#0a75ad",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error creating Razorpay order");
    }
  };

  return (
    <div className="payment-form-split">
      <div className="payment-form-left">
        <img src={shraddhaadzLogo} alt="Shraddhaadz Logo" className="payment-form-logo" />
        <div className="payment-form-company">Shraddhaadz</div>
        <div className="payment-form-quote">"Making payments simple, secure, and seamless for you."</div>
        <div className="payment-form-watermark">Developed By Nilson It Services</div>
      </div>
      <div className="payment-form-right">
        <div className="payment-form-card">
          <h2 className="payment-form-title">Payment Gateway</h2>
          <form className="payment-form-form" onSubmit={(e) => e.preventDefault()}>
            <label>Full Name:</label>
            <input type="text" name="fullName" onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" onChange={handleChange} required />

            <label>Phone Number:</label>
            <input type="tel" name="phone" onChange={handleChange} required />

            <label>Purpose:</label>
            <input type="text" name="purpose" onChange={handleChange} required />

            <label>Amount (₹):</label>
            <input type="number" name="amount" onChange={handleChange} required />

            <button type="submit" onClick={handlePayment}>Proceed to Pay</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
