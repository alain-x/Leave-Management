package com.africahr.service;

import com.africahr.entity.Leave;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendLeaveRequestNotification(String to, Leave leave) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("New Leave Request");
        message.setText(String.format(
            "A new leave request has been submitted by %s %s.\n\n" +
            "Leave Type: %s\n" +
            "Start Date: %s\n" +
            "End Date: %s\n" +
            "Reason: %s",
            leave.getUser().getFirstName(),
            leave.getUser().getLastName(),
            leave.getLeaveType().getName(),
            leave.getStartDate(),
            leave.getEndDate(),
            leave.getReason()
        ));
        mailSender.send(message);
    }

    public void sendLeaveApprovalNotification(String to, Leave leave) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Leave Request Approved");
        message.setText(String.format(
            "Your leave request has been approved.\n\n" +
            "Leave Type: %s\n" +
            "Start Date: %s\n" +
            "End Date: %s\n" +
            "Approver Comment: %s",
            leave.getLeaveType().getName(),
            leave.getStartDate(),
            leave.getEndDate(),
            leave.getApproverComment()
        ));
        mailSender.send(message);
    }

    public void sendLeaveRejectionNotification(String to, Leave leave) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Leave Request Rejected");
        message.setText(String.format(
            "Your leave request has been rejected.\n\n" +
            "Leave Type: %s\n" +
            "Start Date: %s\n" +
            "End Date: %s\n" +
            "Rejection Reason: %s",
            leave.getLeaveType().getName(),
            leave.getStartDate(),
            leave.getEndDate(),
            leave.getApproverComment()
        ));
        mailSender.send(message);
    }
}
