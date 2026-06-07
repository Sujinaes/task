package com.wpoms.admin.services;

import com.wpoms.admin.models.payloads.RegisterCustomerPayload;
import com.wpoms.admin.models.payloads.UpdateCustomerPayload;
import com.wpoms.admin.models.response.RegisterCustomerResponse;
import com.wpoms.admin.models.response.UpdateCustomerResponse;

public interface ICustomerService{

    RegisterCustomerResponse registerCustomer(RegisterCustomerPayload payload);

    public RegisterCustomerResponse getCustomerById(Integer id);

    UpdateCustomerResponse updateCustomer(Integer id, UpdateCustomerPayload payload);

}
