package com.example.website_backend.service.helper;


import com.example.website_backend.dto.website.EmailDto;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import org.springframework.stereotype.Service;


import java.io.IOException;
import java.time.format.DateTimeFormatter;


@Service
public class EmailService {
    private final SendGrid sendGrid;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");


    public EmailService(SendGrid sendGrid) {
        this.sendGrid = sendGrid;
    }


    /**
     * Sends a templated email via SendGrid dynamic template using data from EmailDto.
     */
    public void sendBookingConfirmationEmail(EmailDto emailDto) throws IOException {

        // Build the Mail object
        Mail mail = new Mail();
        mail.setFrom(new Email("stefanif100@gmail.com", "stefanos"));
        mail.setTemplateId("d-2ecdbbbd01b04ff4b278d53ea280771e");

        // Add personalization and dynamic data
        Personalization personalization = new Personalization();
        personalization.addTo(new Email(emailDto.getEmail(), emailDto.getName()));
        personalization.addDynamicTemplateData("booking_id", emailDto.getBookingId().toString());
        personalization.addDynamicTemplateData("name", emailDto.getName());
        personalization.addDynamicTemplateData("telephone", emailDto.getTelephone());
        personalization.addDynamicTemplateData("start_date", emailDto.getStart().format(FORMATTER));
        personalization.addDynamicTemplateData("end_date", emailDto.getEnd().format(FORMATTER));
        personalization.addDynamicTemplateData("start_location", emailDto.getStartLocation());
        personalization.addDynamicTemplateData("end_location", emailDto.getEndLocation());
        mail.addPersonalization(personalization);

        // Prepare and send the request
        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        sendGrid.api(request);

    }

}