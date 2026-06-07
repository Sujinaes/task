package com.wpoms.admin.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.wpoms.admin.models.payloads.RegisterCustomerPayload;
import com.wpoms.admin.models.payloads.UpdateCustomerPayload;
import com.wpoms.admin.models.response.RegisterCustomerResponse;
import com.wpoms.admin.models.response.UpdateCustomerResponse;
import com.wpoms.admin.services.ICustomerService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin
public class CustomerController {

    ICustomerService customerService;
    public CustomerController(ICustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/register-customer")
    public RegisterCustomerResponse registerCustomer(@Valid @RequestBody RegisterCustomerPayload payload) {
        RegisterCustomerResponse response = customerService.registerCustomer(payload);
        return response;

    }

    @GetMapping("/view-customer")
    public RegisterCustomerResponse getCustomerById(@RequestParam Integer id) {
        return customerService.getCustomerById(id);
    }

    @PutMapping("/update-customer")
    public UpdateCustomerResponse updateCustomer(@RequestParam Integer id,
            @Valid @RequestBody UpdateCustomerPayload payload) {

        return customerService.updateCustomer(id, payload);
    }

}
