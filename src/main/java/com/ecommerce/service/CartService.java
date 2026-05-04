package com.ecommerce.service;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.dto.CartResponse;

public interface CartService {
    CartResponse addToCart(String userEmail, AddToCartRequest request);
    CartResponse getCart(String userEmail);
}