package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.config.AppProperties;
import ch.haudis.verkehrsschule.domain.Registration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

// Transactional emails to students. Best-effort, like RealtimeNotifier: a broken
// or unconfigured mail server must never break a sign-up. With SMTP_HOST unset
// (the local-dev default), this logs the would-be email instead of sending it.
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final AppProperties props;
    private final boolean smtpConfigured;

    public EmailService(JavaMailSender mailSender, AppProperties props, @Value("${spring.mail.host:}") String smtpHost) {
        this.mailSender = mailSender;
        this.props = props;
        this.smtpConfigured = !smtpHost.isBlank();
    }

    public void sendRegistrationConfirmation(Registration registration) {
        String courseTitle = registration.getCourseDate().getCourse().getTitle();
        String dateLabel = registration.getCourseDate().getDateLabel();
        String location = registration.getCourseDate().getLocation();
        int price = registration.getCourseDate().getPrice();

        String subject = "Anmeldebestätigung – " + courseTitle;
        String body = """
                Hallo %s,

                wir bestätigen dir hiermit deine Anmeldung:

                Kurs:    %s
                Termin:  %s
                Ort:     %s
                Preis:   CHF %d.–

                Wir melden uns bei dir, falls sich noch etwas ändert. Bis bald!

                Haudis Verkehrsschule
                """
                .formatted(registration.getFirstName(), courseTitle, dateLabel, location, price);

        send(registration.getEmail(), subject, body);
    }

    private void send(String to, String subject, String body) {
        if (!smtpConfigured) {
            log.info("SMTP not configured, skipping email to {}: [{}]\n{}", to, subject, body);
            return;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(props.mail().from());
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
