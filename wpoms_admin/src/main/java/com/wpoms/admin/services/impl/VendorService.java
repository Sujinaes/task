package com.wpoms.admin.services.impl;

import com.wpoms.admin.models.entities.UserMaster;
import com.wpoms.admin.models.entities.VendorMaster;
import com.wpoms.admin.models.entities.VendorStaff;
import com.wpoms.admin.models.payloads.EditVendorPayload;
import com.wpoms.admin.models.payloads.RegisterVendorPayload;
import com.wpoms.admin.models.payloads.VendorStaffPayload;
import com.wpoms.admin.models.response.EditVendorResponse;
import com.wpoms.admin.models.response.RegisterVendorResponse;
import com.wpoms.admin.models.response.VendorStaffResponse;
import com.wpoms.admin.repositories.UserMasterRepository;
import com.wpoms.admin.repositories.VendorMasterRepository;
import com.wpoms.admin.repositories.VendorStaffRepository;
import com.wpoms.admin.services.IVendorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class VendorService implements IVendorService {

    @Autowired
    private UserMasterRepository userRepository;

    @Autowired
    private VendorMasterRepository vendorRepository;

    @Autowired
    VendorStaffRepository vendorStaffRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // ========================= REGISTER VENDOR =========================
    @Transactional
    @Override
    public RegisterVendorResponse registerVendor(RegisterVendorPayload payload) {

        RegisterVendorResponse response = new RegisterVendorResponse();

        if (vendorRepository.existsByBusinessEmail(payload.getVendorEmail())) {
            throw new IllegalStateException("Email already exists for vendor");
        }

        if (vendorRepository.existsByGstNumber(payload.getGstNumber().toUpperCase())) {
            throw new IllegalStateException("Gst number already exists for vendor");
        }

        if (userRepository.existsByEmail(payload.getEmail())) {
            throw new IllegalStateException("Email already exists for user");
        }

        if (vendorRepository.existsByPhone(payload.getPhone())) {
            throw new IllegalStateException("Phone number already exists for vendor");
        }

        // Create User
        UserMaster user = new UserMaster();
        user.setEmail(payload.getEmail());
        user.setPasswordHash(bCryptPasswordEncoder.encode(payload.getPassword()));
        user.setRole(payload.getRole());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setActive(true);

        UserMaster savedUser = userRepository.save(user);

        // Create Vendor
        VendorMaster vendor = new VendorMaster();
        vendor.setUserId(savedUser.getId());
        vendor.setVendorName(payload.getVendorName());
        vendor.setBusinessEmail(payload.getVendorEmail());
        vendor.setAddress(payload.getAddress());
        vendor.setPhone(payload.getPhone());
        vendor.setGstNumber(payload.getGstNumber().toUpperCase());

        response.setMessage("Vendor registration successful");
        response.setVendorId(vendor.getVendorId());
        response.setUserId(user.getId());

        vendorRepository.save(vendor);

        response.setMessage("Vendor registration successful");

        return response;
    }

    // ========================= GET VENDOR =========================
    @Override
    public RegisterVendorResponse getVendor(Integer id) {

        RegisterVendorResponse response = new RegisterVendorResponse();

        VendorMaster vendor = vendorRepository.findByUserId(id)
                .orElseThrow(() -> new NoSuchElementException("Vendor not found"));
        response.setVendorName(vendor.getVendorName());
        response.setVendorEmail(vendor.getBusinessEmail());
        response.setAddress(vendor.getAddress());
        response.setPhone(vendor.getPhone());
        response.setGstNumber(vendor.getGstNumber());
        response.setVendorId(vendor.getVendorId());
        response.setUserId(vendor.getUserId());
        return response;
    }

    // ========================= CREATE VENDOR STAFF =========================
    @Override
    public VendorStaffResponse createVendorStaff(VendorStaffPayload payload) {

        VendorStaffResponse response = new VendorStaffResponse();

        // 1. Check email already exists
        if (userRepository.existsByEmail(payload.getEmail())) {
            throw new RuntimeException("Email already exists: " + payload.getEmail());
        }

        // 2. Check vendor exists
        if (!vendorRepository.existsByVendorId(payload.getVendorId())) {
            throw new RuntimeException("Vendor not found with ID: " + payload.getVendorId());
        }

        // 3. Check duplicate phone
        if (vendorStaffRepository.existsByPhoneAndVendorId(
                payload.getPhone(), payload.getVendorId())) {

            throw new RuntimeException(
                    "Phone number " + payload.getPhone() + " already exists for this vendor");
        }

        // 4. Create UserMaster
        UserMaster user = new UserMaster();
        user.setEmail(payload.getEmail());
        user.setPasswordHash(bCryptPasswordEncoder.encode(payload.getPassword()));
        user.setRole("VENDOR_STAFF");
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        UserMaster savedUser = userRepository.save(user);

        // 5. Create VendorStaff
        VendorStaff staff = new VendorStaff();
        staff.setName(payload.getName());
        staff.setPhone(payload.getPhone());
        staff.setDepartment(payload.getDepartment());
        staff.setVendorId(payload.getVendorId());
        staff.setUserId(savedUser.getId());

        VendorStaff savedStaff = vendorStaffRepository.save(staff);

        // 6. Prepare response
        response.setSId(savedStaff.getSId());
        response.setName(savedStaff.getName());
        response.setPhone(savedStaff.getPhone());
        response.setDepartment(savedStaff.getDepartment());
        response.setVendorId(savedStaff.getVendorId());

        return response;
    }

    // ========================= EDIT VENDOR =========================
    @Override
    public EditVendorResponse editVendor(Integer id, EditVendorPayload payload) {

        EditVendorResponse response = new EditVendorResponse();
        VendorMaster vendor = vendorRepository.findByUserId(id)
                .orElseThrow(() -> new NoSuchElementException("Vendor not found"));

        if (vendorRepository.existsByBusinessEmailAndUserIdNot(payload.getVendorEmail(), id)) {
            throw new IllegalStateException("Email already exists for another vendor");
        }

        if (vendorRepository.existsByGstNumberAndUserIdNot(payload.getGstNumber().toUpperCase(), id)) {
            throw new IllegalStateException("Gst number already exists for another vendor");
        }

        if (vendorRepository.existsByPhoneAndUserIdNot(payload.getPhone(), id)) {
            throw new IllegalStateException("Phone number already exists for another vendor");
        }

        vendor.setVendorName(payload.getVendorName());
        vendor.setAddress(payload.getAddress());
        vendor.setPhone(payload.getPhone());
        vendor.setGstNumber(payload.getGstNumber().toUpperCase());
        vendor.setBusinessEmail(payload.getVendorEmail());

        vendorRepository.save(vendor);

        response.setMessage("Vendor profile edited successfully");

        return response;
    }

    // GET ALL STAFF BY VENDOR ID
    @Override
    public List<VendorStaffResponse> getAllStaffByVendorId(int vendorId) {

        System.out.println("=== GET VENDOR STAFF DEBUG ===");
        System.out.println("Vendor ID: " + vendorId);

        // Verify vendor exists using vendorId
        if (!vendorRepository.existsByVendorId(vendorId)) {
            throw new RuntimeException("Vendor not found with ID: " + vendorId);
        }

        // Get all staff for this vendor
        List<VendorStaff> staffList = vendorStaffRepository.findByVendorId(vendorId);

        if (staffList.isEmpty()) {
            return new ArrayList<>();
        }

        // Convert each staff entity to response object
        List<VendorStaffResponse> staffResponses = staffList.stream().map(staff -> {
            VendorStaffResponse staffResponse = new VendorStaffResponse();

            // Get email from UserMaster using userId
            UserMaster user = userRepository.findById(staff.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found for staff ID: " + staff.getSId()));

            staffResponse.setSId(staff.getSId());
            staffResponse.setName(staff.getName());
            staffResponse.setPhone(staff.getPhone());
            staffResponse.setDepartment(staff.getDepartment());
            staffResponse.setVendorId(staff.getVendorId());
            staffResponse.setUserId(staff.getUserId());
            staffResponse.setEmail(user.getEmail());

            return staffResponse;
        }).collect(Collectors.toList());

        System.out.println("Found " + staffResponses.size() + " staff records");
        System.out.println("=== END DEBUG ===");

        return staffResponses;
    }

}