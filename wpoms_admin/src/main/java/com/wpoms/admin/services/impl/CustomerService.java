package com.wpoms.admin.services.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.wpoms.admin.models.entities.CustomerMaster;
import com.wpoms.admin.models.entities.UserMaster;
import com.wpoms.admin.models.payloads.RegisterCustomerPayload;
import com.wpoms.admin.models.payloads.UpdateCustomerPayload;
import com.wpoms.admin.models.response.RegisterCustomerResponse;
import com.wpoms.admin.models.response.UpdateCustomerResponse;
import com.wpoms.admin.repositories.CustomerRepository;
import com.wpoms.admin.repositories.UserMasterRepository;
import com.wpoms.admin.services.ICustomerService;
import com.wpoms.admin.utilities.exceptionhandling.CustomerNotFoundException;

@Service
public class CustomerService implements ICustomerService {

    private UserMasterRepository _userMasterRepository;
    private CustomerRepository _customerRepository;

    public CustomerService(UserMasterRepository _userMasterRepository, CustomerRepository _customerRepository) {
        this._userMasterRepository = _userMasterRepository;
        this._customerRepository = _customerRepository;
    }

    // Register customer

    @Autowired
    BCryptPasswordEncoder bcrypt;

    @Override
    public RegisterCustomerResponse registerCustomer(RegisterCustomerPayload payload) {
        RegisterCustomerResponse response = new RegisterCustomerResponse();

        if (_customerRepository.existsByCustomerEmail(payload.getEmail())) {
            throw new IllegalArgumentException("Customer email already exists");
        }

        if (_customerRepository.existsByPhoneNo(payload.getPhoneNo())) {
            throw new IllegalArgumentException("Phone number already exists");
        }

        UserMaster user = new UserMaster();
        user.setEmail(payload.getEmail());

        user.setPasswordHash(bcrypt.encode(payload.getPasswordHash()));
        user.setRole(payload.getRole());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setActive(true);

        UserMaster savedUser = _userMasterRepository.save(user);

        CustomerMaster customer = new CustomerMaster();
        customer.setUserId(savedUser.getId());
        customer.setCustomerEmail(savedUser.getEmail());

        customer.setCustomerName(payload.getCustomerName());
        customer.setPhoneNo(payload.getPhoneNo());
        customer.setDob(payload.getDateOfBirth());
        customer.setShippingAddress(payload.getShippingAddress());
        customer.setContactPreference(payload.getContactPreference());

        CustomerMaster savedCustomer = _customerRepository.save(customer);
        response.setCustomerId(savedCustomer.getCustomerId());
        response.setUserId(savedUser.getId());
        response.setCustomerName(savedCustomer.getCustomerName());
        response.setCustomerEmail(savedUser.getEmail());

        response.setPhoneNo(savedCustomer.getPhoneNo());
        response.setDateOfBirth(savedCustomer.getDob());
        response.setShippingAddress(savedCustomer.getShippingAddress());
        response.setContactPreference(savedCustomer.getContactPreference());

        response.setMessage("Customer Registered Successfully");
        return response;

    }

    // View customer
    @Override
    public RegisterCustomerResponse getCustomerById(Integer id) {

        CustomerMaster customer = _customerRepository.findByUserId(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id : " + id));

        RegisterCustomerResponse viewResponse = new RegisterCustomerResponse();

        viewResponse.setUserId(customer.getUserId());
        viewResponse.setCustomerId(customer.getCustomerId());
        viewResponse.setCustomerEmail(customer.getCustomerEmail());
        viewResponse.setCustomerName(customer.getCustomerName());
        viewResponse.setPhoneNo(customer.getPhoneNo());
        viewResponse.setDateOfBirth(customer.getDob());
        viewResponse.setShippingAddress(customer.getShippingAddress());
        viewResponse.setContactPreference(customer.getContactPreference());

        return viewResponse;
    }

    // update customer

    @Override
    public UpdateCustomerResponse updateCustomer(Integer id, UpdateCustomerPayload payload) {

        CustomerMaster customer = _customerRepository.findByUserId(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id : " + id));

        if (_customerRepository.existsByPhoneNoAndUserIdNot(payload.getPhoneNo(), id)) {
            throw new IllegalArgumentException("Phone number already exists for another customer");
        }

        customer.setCustomerName(payload.getCustomerName());
        customer.setPhoneNo(payload.getPhoneNo());
        customer.setDob(payload.getDateOfBirth());
        customer.setShippingAddress(payload.getShippingAddress());
        customer.setContactPreference(payload.getContactPreference());

        CustomerMaster updatedCustomer = _customerRepository.save(customer);

        UpdateCustomerResponse response = new UpdateCustomerResponse();

        response.setCustomerName(updatedCustomer.getCustomerName());
        response.setPhoneNo(updatedCustomer.getPhoneNo());
        response.setDateOfBirth(updatedCustomer.getDob());
        response.setShippingAddress(updatedCustomer.getShippingAddress());
        response.setContactPreference(updatedCustomer.getContactPreference());
        response.setMessage("Customer Updated Successfully");

        return response;
    }
}
