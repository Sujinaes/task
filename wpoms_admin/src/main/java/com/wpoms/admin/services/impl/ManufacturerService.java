package com.wpoms.admin.services.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.wpoms.admin.models.entities.ManufacturerMaster;
import com.wpoms.admin.models.entities.ManufacturerStaff;
import com.wpoms.admin.models.entities.UserMaster;
import com.wpoms.admin.models.payloads.EditManufacturerPayload;
import com.wpoms.admin.models.payloads.ManufacturerStaffPayload;
import com.wpoms.admin.models.payloads.RegisterManufacturerPayload;
import com.wpoms.admin.models.response.EditManufacturerResponse;
import com.wpoms.admin.models.response.ManufacturerStaffResponse;
import com.wpoms.admin.models.response.RegisterManufacturerResponse;
import com.wpoms.admin.repositories.ManufacturerMasterRepository;
import com.wpoms.admin.repositories.ManufacturerStaffRepository;
import com.wpoms.admin.repositories.UserMasterRepository;
import com.wpoms.admin.services.IManufacturerService;

@Service
public class ManufacturerService implements IManufacturerService {

    @Autowired
    private UserMasterRepository userMasterRepository;

    @Autowired
    private ManufacturerMasterRepository manufacturerMasterRepository;

    @Autowired
    private ManufacturerStaffRepository manufacturerStaffRepository;

    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public RegisterManufacturerResponse registerManufacturer(RegisterManufacturerPayload payload) {

        RegisterManufacturerResponse response = new RegisterManufacturerResponse();

        if (manufacturerMasterRepository.existsByCompanyEmail(payload.getCompanyEmail())) {
            throw new RuntimeException("Company email already exists");
        }

        if (manufacturerMasterRepository.existsByGstNumber(payload.getGstNumber().toUpperCase())) {
            throw new RuntimeException("GST number already exists");
        }

        if (userMasterRepository.existsByEmail(payload.getEmail())) {
            throw new RuntimeException("User email already exists");
        }

        if (manufacturerMasterRepository.existsByPhone(payload.getCompanyPhone())) {
            throw new IllegalArgumentException("Phone number already exists");
        }

        UserMaster user = new UserMaster();
        user.setEmail(payload.getEmail());
        user.setPasswordHash(bCryptPasswordEncoder.encode(payload.getPassword()));
        user.setRole(payload.getRole());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setActive(true);

        userMasterRepository.save(user);

        ManufacturerMaster manufacturer = new ManufacturerMaster();
        manufacturer.setCompanyName(payload.getCompanyName());
        manufacturer.setCompanyEmail(payload.getCompanyEmail());
        manufacturer.setAddress(payload.getCompanyAddress());
        manufacturer.setPhone(payload.getCompanyPhone());
        manufacturer.setGstNumber(payload.getGstNumber());
        manufacturer.setUserId(user.getId());

        manufacturerMasterRepository.save(manufacturer);

        response.setUserId(user.getId());
        response.setManufacturerId(manufacturer.getManufacturerId());
        response.setCompanyName(manufacturer.getCompanyName());
        response.setCompanyEmail(manufacturer.getCompanyEmail());
        response.setAddress(manufacturer.getAddress());
        response.setPhone(manufacturer.getPhone());
        response.setGstNumber(manufacturer.getGstNumber().toUpperCase());
        response.setMessage("Manufacturer registered successfully");

        return response;
    }

    @Override
    public RegisterManufacturerResponse getManufacturerById(int id) {

        RegisterManufacturerResponse response = new RegisterManufacturerResponse();

        ManufacturerMaster manufacture = manufacturerMasterRepository.findByUserId(id)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found"));
        response.setManufacturerId(manufacture.getManufacturerId());
        response.setCompanyEmail(manufacture.getCompanyEmail());
        response.setCompanyName(manufacture.getCompanyName());
        response.setPhone(manufacture.getPhone());
        response.setAddress(manufacture.getAddress());
        response.setGstNumber(manufacture.getGstNumber());
        response.setMessage("Manufacturer fetched successfully");

        return response;
    }

    @Override
    public EditManufacturerResponse updateManufacture(int id, EditManufacturerPayload payload) {

        EditManufacturerResponse response = new EditManufacturerResponse();

        if (manufacturerMasterRepository.existsByCompanyEmailAndUserIdNot(payload.getCompanyEmail(), id)) {
            throw new RuntimeException("Company email already exists for another manufacturer");
        }

        if (manufacturerMasterRepository.existsByGstNumberAndUserIdNot(payload.getGstNumber().toUpperCase(), id)) {
            throw new RuntimeException("GST number already exists for another manufacturer");
        }

        if (manufacturerMasterRepository.existsByPhoneAndUserIdNot(payload.getCompanyPhone(), id)) {
            throw new IllegalArgumentException("Phone number already exists for another manufacturer");
        }

        ManufacturerMaster manufacturerMaster = manufacturerMasterRepository.findByUserId(id)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found"));

        manufacturerMaster.setCompanyName(payload.getCompanyName());
        manufacturerMaster.setCompanyEmail(payload.getCompanyEmail());
        manufacturerMaster.setAddress(payload.getCompanyAddress());
        manufacturerMaster.setPhone(payload.getCompanyPhone());
        manufacturerMaster.setGstNumber(payload.getGstNumber().toUpperCase());

        manufacturerMasterRepository.save(manufacturerMaster);

        response.setCompanyEmail(manufacturerMaster.getCompanyEmail());
        response.setCompanyName(manufacturerMaster.getCompanyName());
        response.setPhone(manufacturerMaster.getPhone());
        response.setGstNumber(manufacturerMaster.getGstNumber());
        response.setMessage("Manufacturer updated successfully");

        return response;
    }

    // CREATE STAFF

    @Override
    public ManufacturerStaffResponse createManufacturerStaff(ManufacturerStaffPayload payload) {

        ManufacturerStaffResponse response = new ManufacturerStaffResponse();

        // Check if email already exists in UserMaster
        if (userMasterRepository.existsByEmail(payload.getEmail())) {
            throw new RuntimeException("Email already exists: " + payload.getEmail());
        }

        // Verify manufacturer exists using manufacturerId
        if (!manufacturerMasterRepository.existsByManufacturerId(payload.getManufacturerId())) {
            throw new RuntimeException("Manufacturer not found with ID: " + payload.getManufacturerId());
        }

        // Check if phone already exists for this manufacturer
        if (manufacturerStaffRepository.existsByPhoneAndManufacturerId(payload.getPhone(),
                payload.getManufacturerId())) {
            throw new RuntimeException("Phone number " + payload.getPhone() + " already exists for this manufacturer");
        }

        // Create UserMaster record for staff login
        UserMaster user = new UserMaster();
        user.setEmail(payload.getEmail());
        user.setPasswordHash(bCryptPasswordEncoder.encode(payload.getPassword()));
        user.setRole("MANUFACTURER_STAFF");
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        UserMaster savedUser = userMasterRepository.save(user);

        // Create ManufacturerStaff record
        ManufacturerStaff staff = new ManufacturerStaff();
        staff.setName(payload.getName());
        staff.setPhone(payload.getPhone());
        staff.setDepartment(payload.getDepartment());
        staff.setManufacturerId(payload.getManufacturerId());
        staff.setUserId(savedUser.getId());

        ManufacturerStaff savedStaff = manufacturerStaffRepository.save(staff);

        // Prepare response
        response.setSId(savedStaff.getSId());
        response.setName(savedStaff.getName());
        response.setPhone(savedStaff.getPhone());
        response.setDepartment(savedStaff.getDepartment());
        response.setManufacturerId(savedStaff.getManufacturerId());
        response.setUserId(savedStaff.getUserId());
        response.setEmail(savedUser.getEmail());
        response.setMessage("Manufacturer staff created successfully");

        return response;
    }

    @Override
    public List<ManufacturerStaffResponse> getAllStaffByManufacturerId(int manufacturerId) {

        // Verify manufacturer exists
        if (!manufacturerMasterRepository.existsByManufacturerId(manufacturerId)) {
            throw new RuntimeException("Manufacturer not found with ID: " + manufacturerId);
        }

        // Get all staff for this manufacturer
        List<ManufacturerStaff> staffList = manufacturerStaffRepository.findByManufacturerId(manufacturerId);

        if (staffList.isEmpty()) {
            return new ArrayList<>();
        }

        // Convert each staff entity to response object
        List<ManufacturerStaffResponse> staffResponses = staffList.stream().map(staff -> {
            ManufacturerStaffResponse staffResponse = new ManufacturerStaffResponse();

            // Get email from UserMaster using userId
            UserMaster user = userMasterRepository.findById(staff.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found for staff ID: " + staff.getSId()));

            staffResponse.setSId(staff.getSId());
            staffResponse.setName(staff.getName());
            staffResponse.setPhone(staff.getPhone());
            staffResponse.setDepartment(staff.getDepartment());
            staffResponse.setManufacturerId(staff.getManufacturerId());
            staffResponse.setUserId(staff.getUserId());
            staffResponse.setEmail(user.getEmail());

            return staffResponse;
        }).collect(Collectors.toList());

        return staffResponses;
    }
}