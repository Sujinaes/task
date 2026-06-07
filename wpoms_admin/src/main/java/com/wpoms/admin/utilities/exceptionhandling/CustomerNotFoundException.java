package com.wpoms.admin.utilities.exceptionhandling;

public class CustomerNotFoundException extends RuntimeException {

    public CustomerNotFoundException(String message) {
        super(message);
    }

}
