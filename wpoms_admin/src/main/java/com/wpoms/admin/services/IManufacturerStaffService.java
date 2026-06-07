package com.wpoms.admin.services;

import java.util.List;

import com.wpoms.admin.models.payloads.ManufacturerStaffPayload;
import com.wpoms.admin.models.response.ManufacturerStaffResponse;

public interface IManufacturerStaffService {

    ManufacturerStaffResponse createStaff(ManufacturerStaffPayload payload, int manufacturerId);

    List<ManufacturerStaffResponse> getStaffByManufacturer(int manufacturerId);

}
