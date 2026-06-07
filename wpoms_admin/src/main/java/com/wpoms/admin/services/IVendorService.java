package com.wpoms.admin.services;

import java.util.List;

import com.wpoms.admin.models.payloads.EditVendorPayload;
import com.wpoms.admin.models.payloads.RegisterVendorPayload;
import com.wpoms.admin.models.payloads.VendorStaffPayload;
import com.wpoms.admin.models.response.EditVendorResponse;
import com.wpoms.admin.models.response.RegisterVendorResponse;
import com.wpoms.admin.models.response.VendorStaffResponse;

public interface IVendorService {

    RegisterVendorResponse registerVendor(RegisterVendorPayload payload);

    RegisterVendorResponse getVendor(Integer id);

    EditVendorResponse editVendor(Integer id, EditVendorPayload payload);

    List<VendorStaffResponse> getAllStaffByVendorId(int vendorId);

    VendorStaffResponse createVendorStaff(VendorStaffPayload payload);

}
