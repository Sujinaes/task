package com.wpoms.admin.services;

import com.wpoms.admin.models.payloads.AddToCartPayload;
import com.wpoms.admin.models.response.AddToCartResponse;
import com.wpoms.admin.models.response.RemoveCartItemResponse;
import com.wpoms.admin.models.response.ViewCartResponse;


public interface IVendorCartService {


    AddToCartResponse addToCart(int vendorId, AddToCartPayload payload);


    ViewCartResponse viewCart(int vendorId);


    RemoveCartItemResponse removeItem(int cartItemId);
}
