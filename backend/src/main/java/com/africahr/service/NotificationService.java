package com.africahr.service;

import com.africahr.entity.LeaveRequest;
import com.africahr.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendLeaveRequestNotification(LeaveRequest leaveRequest) {
        User requester = leaveRequest.getUser();
        User approver = leaveRequest.getApprover();
        
        // Notify approver
        SimpleMailMessage approverMessage = new SimpleMailMessage();
        approverMessage.setTo(approver.getEmail());
        approverMessage.setSubject("New Leave Request - Action Required");
        approverMessage.setText(String.format(
            "Dear %s,\n\nYou have a new leave request from %s.\n" +
            "Leave Type: %s\n" +
            "Start Date: %s\n" +
            "End Date: %s\n" +
            "\nPlease review and take appropriate action.\n\n" +
            "Best regards,\nAfrica HR Leave Management System",
            approver.getFullName(),
            requester.getFullName(),
            leaveRequest.getLeaveType().getName(),
            leaveRequest.getStartDate(),
            leaveRequest.getEndDate()
        ));
        mailSender.send(approverMessage);
        
        // Notify requester
        SimpleMailMessage requesterMessage = new SimpleMailMessage();
        requesterMessage.setTo(requester.getEmail());
        requesterMessage.setSubject("Leave Request Submitted");
        requesterMessage.setText(String.format(
            "Dear %s,\n\nYour leave request has been submitted successfully.\n" +
            "Leave Type: %s\n" +
            "Start Date: %s\n" +
            "End Date: %s\n" +
            "\nYour request is pending approval from %s.\n\n" +
            "Best regards,\nAfrica HR Leave Management System",
            requester.getFullName(),
            leaveRequest.getLeaveType().getName(),
            leaveRequest.getStartDate(),
            leaveRequest.getEndDate(),
            approver.getFullName()
        ));
        mailSender.send(requesterMessage);
    }

    public void sendLeaveApprovalNotification(LeaveRequest leaveRequest, boolean approved) {
        User requester = leaveRequest.getUser();
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(requester.getEmail());
        message.setSubject(approved ? "Leave Request Approved" : "Leave Request Rejected");
        message.setText(String.format(
            "Dear %s,\n\nYour leave request has been %s.\n" +
            "Leave Type: %s\n" +
            "Start Date: %s\n" +
            "End Date: %s\n" +
            "%s\n\n" +
            "Best regards,\nAfrica HR Leave Management System",
            requester.getFullName(),
            approved ? "approved" : "rejected",
            leaveRequest.getLeaveType().getName(),
            leaveRequest.getStartDate(),
            leaveRequest.getEndDate(),
            leaveRequest.getComments() != null ? "Comments: " + leaveRequest.getComments() : ""
        ));
        mailSender.send(message);
    }
}
