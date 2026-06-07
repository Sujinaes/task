package com.wpoms.admin.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wpoms.admin.models.payloads.EditManufacturerPayload;
import com.wpoms.admin.models.payloads.ManufacturerStaffPayload;
import com.wpoms.admin.models.payloads.RegisterManufacturerPayload;
import com.wpoms.admin.models.response.EditManufacturerResponse;
import com.wpoms.admin.models.response.ManufacturerStaffResponse;
import com.wpoms.admin.models.response.RegisterManufacturerResponse;
import com.wpoms.admin.services.IManufacturerService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class ManufactureController {

    private final IManufacturerService ManufacturerService;

    public ManufactureController(IManufacturerService manufacturerService) {
        this.ManufacturerService = manufacturerService;
    }

    @PostMapping("/register-manufacturer")
    public RegisterManufacturerResponse registerManufacturer(@Valid @RequestBody RegisterManufacturerPayload payload) {
        RegisterManufacturerResponse response = ManufacturerService.registerManufacturer(payload);
        return response;
    }

    @GetMapping("/manufacturer")
    public RegisterManufacturerResponse getManufacturerById(@RequestParam int id) {
        return ManufacturerService.getManufacturerById(id);
    }

    @PutMapping("/update-manufacture")
    public EditManufacturerResponse updateManufacture(
            @RequestParam int id,
            @Valid @RequestBody EditManufacturerPayload payload) {
        return ManufacturerService.updateManufacture(id, payload);
    }

    @PostMapping("/manufacturer/create-staff")
    public ManufacturerStaffResponse createManufacturerStaff(
            @Valid @RequestBody ManufacturerStaffPayload payload) {

        ManufacturerStaffResponse response = ManufacturerService.createManufacturerStaff(payload);
        return response;
    }

    @GetMapping("/manufacturer/staff-list")
    public List<ManufacturerStaffResponse> getAllStaffByManufacturerId(
            @RequestParam int manufacturerId) {

        List<ManufacturerStaffResponse> response = ManufacturerService.getAllStaffByManufacturerId(manufacturerId);
        return response;
    }
}