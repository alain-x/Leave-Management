package com.africahr.exception;

public class LeaveManagementException extends RuntimeException {
    public LeaveManagementException(String message) {
        super(message);
    }

    public LeaveManagementException(String message, Throwable cause) {
        super(message, cause);
    }
}