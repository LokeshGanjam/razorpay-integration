package com.payment.Shraddhaadz.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Service
public class RazorpayService {

    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret}")
    private String secret;

    public Order createOrder(int amount) throws RazorpayException {
        RazorpayClient client = new RazorpayClient(key, secret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100); // convert to paise
        orderRequest.put("currency", "INR");
        orderRequest.put("payment_capture", true);

        return client.orders.create(orderRequest);
    }
}