package ch.haudis.verkehrsschule.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ch.haudis.verkehrsschule.config.AppProperties;
import ch.haudis.verkehrsschule.domain.AppUser;
import ch.haudis.verkehrsschule.domain.Course;
import ch.haudis.verkehrsschule.domain.CourseDate;
import ch.haudis.verkehrsschule.domain.Registration;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

// Best-effort like RealtimeNotifier: a broken or unconfigured mail server must
// never break a sign-up (see RegistrationService.create(), which never checks
// the return value of sendRegistrationConfirmation).
@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    private final AppProperties props =
            new AppProperties(null, null, null, new AppProperties.Mail("Haudis <no-reply@haudis-verkehrsschule.ch>"), false);

    private Registration registration(String email) {
        Course course = Course.builder().slug("vku").title("VKU").build();
        CourseDate courseDate = CourseDate.builder()
                .course(course)
                .dateLabel("Mo 20. Juli 2026")
                .location("Baden")
                .price(190)
                .build();
        return Registration.builder()
                .id(UUID.randomUUID())
                .courseDate(courseDate)
                .firstName("Max")
                .lastName("Muster")
                .email(email)
                .build();
    }

    @Test
    void skipsSendingWhenSmtpHostIsNotConfigured() {
        EmailService emailService = new EmailService(mailSender, props, "");

        emailService.sendRegistrationConfirmation(registration("max@example.com"));

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendsAConfirmationWhenSmtpIsConfigured() {
        EmailService emailService = new EmailService(mailSender, props, "smtp.example.com");

        emailService.sendRegistrationConfirmation(registration("max@example.com"));

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());
        SimpleMailMessage sent = captor.getValue();
        org.assertj.core.api.Assertions.assertThat(sent.getTo()).containsExactly("max@example.com");
        org.assertj.core.api.Assertions.assertThat(sent.getSubject()).contains("VKU");
        org.assertj.core.api.Assertions.assertThat(sent.getText()).contains("Max", "Baden", "CHF 190");
    }

    @Test
    void aFailedSendNeverPropagates() {
        EmailService emailService = new EmailService(mailSender, props, "smtp.example.com");
        doThrow(new MailSendException("boom")).when(mailSender).send(any(SimpleMailMessage.class));

        assertThatCode(() -> emailService.sendRegistrationConfirmation(registration("max@example.com")))
                .doesNotThrowAnyException();
    }
}
