package com.wpoms.admin.utilities.exceptionhandling;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.validation.ConstraintViolationException;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalException {

        // 1. Validation Errors (@Valid request body)
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {

                Map<String, String> errors = new HashMap<>();

                for (FieldError error : ex.getBindingResult().getFieldErrors()) {
                        errors.putIfAbsent(error.getField(), error.getDefaultMessage());
                }

                // Get first validation message
                String firstErrorMessage = ex.getBindingResult()
                                .getFieldErrors()
                                .get(0)
                                .getDefaultMessage();

                return new ResponseEntity<>(
                                Map.of(
                                                "status", "FAILED",
                                                "code", 400,
                                                "message", firstErrorMessage,
                                                "errors", errors),
                                HttpStatus.BAD_REQUEST);
        }

        // 2. Query param / path variable validation
        @ExceptionHandler(ConstraintViolationException.class)
        public ResponseEntity<?> handleConstraintViolation(ConstraintViolationException ex) {

                Map<String, String> errors = new HashMap<>();

                ex.getConstraintViolations().forEach(v -> errors.put(v.getPropertyPath().toString(), v.getMessage()));

                return new ResponseEntity<>(
                                Map.of(
                                                "status", "FAILED",
                                                "code", 400,
                                                "message", "Validation failed",
                                                "errors", errors),
                                HttpStatus.BAD_REQUEST);
        }

        // 3️Customer Not Found (Custom Exception)
        @ExceptionHandler(CustomerNotFoundException.class)
        public ResponseEntity<?> handleCustomerNotFound(CustomerNotFoundException ex) {

                return new ResponseEntity<>(
                                Map.of(
                                                "status", "FAILED",
                                                "code", 404,
                                                "message", ex.getMessage()),
                                HttpStatus.NOT_FOUND);
        }

        // 3. Bad Request (manual validation like GST, etc.)
        @ExceptionHandler({ IllegalArgumentException.class, RuntimeException.class })
        public ResponseEntity<?> handleBadRequest(RuntimeException ex) {

                return new ResponseEntity<>(
                                Map.of(
                                                "status", "FAILED",
                                                "code", 400,
                                                "message", ex.getMessage()),
                                HttpStatus.BAD_REQUEST);
        }

        // 4. Conflict (duplicate email, phone, GST)
        @ExceptionHandler(IllegalStateException.class)
        public ResponseEntity<?> handleConflict(IllegalStateException ex) {

                return new ResponseEntity<>(
                                Map.of(
                                                "status", "FAILED",
                                                "code", 409,
                                                "message", ex.getMessage()),
                                HttpStatus.CONFLICT);
        }

        // 5. Not Found
        @ExceptionHandler(NoSuchElementException.class)
        public ResponseEntity<?> handleNotFound(NoSuchElementException ex) {

                return new ResponseEntity<>(
                                Map.of(
                                                "status", "FAILED",
                                                "code", 404,
                                                "message", ex.getMessage()),
                                HttpStatus.NOT_FOUND);
        }

        // 6. Catch-all (VERY IMPORTANT)
        @ExceptionHandler(Exception.class)
        public ResponseEntity<?> handleAll(Exception ex) {

                return new ResponseEntity<>(
                                Map.of(
                                                "status", "FAILED",
                                                "code", 500,
                                                "message", "Something went wrong. Please try again."),
                                HttpStatus.INTERNAL_SERVER_ERROR);
        }
}