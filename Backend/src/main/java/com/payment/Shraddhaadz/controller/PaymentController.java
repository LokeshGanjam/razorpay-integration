package com.payment.Shraddhaadz.controller;


import com.payment.Shraddhaadz.dto.PaymentRequest;
import com.payment.Shraddhaadz.service.RazorpayService;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final RazorpayService razorpayService;

    public PaymentController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestBody PaymentRequest request) throws RazorpayException {
        Order order = razorpayService.createOrder(request.getAmount());

        Map<String, Object> response = new HashMap<>();
        response.put("id", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));

        return response;
    }
}
