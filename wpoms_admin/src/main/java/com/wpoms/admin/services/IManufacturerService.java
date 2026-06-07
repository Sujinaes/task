package com.wpoms.admin.services;

import java.util.List;

import com.wpoms.admin.models.payloads.EditManufacturerPayload;
import com.wpoms.admin.models.payloads.ManufacturerStaffPayload;
import com.wpoms.admin.models.payloads.RegisterManufacturerPayload;
import com.wpoms.admin.models.response.EditManufacturerResponse;
import com.wpoms.admin.models.response.ManufacturerStaffResponse;
import com.wpoms.admin.models.response.RegisterManufacturerResponse;

public interface IManufacturerService {

    RegisterManufacturerResponse registerManufacturer(RegisterManufacturerPayload payload);

    RegisterManufacturerResponse getManufacturerById(int id);

    EditManufacturerResponse updateManufacture(int id, EditManufacturerPayload payload);

    ManufacturerStaffResponse createManufacturerStaff(ManufacturerStaffPayload payload);

    List<ManufacturerStaffResponse> getAllStaffByManufacturerId(int manufacturerId);

}
