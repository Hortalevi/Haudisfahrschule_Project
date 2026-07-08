package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.Registration;
import ch.haudis.verkehrsschule.domain.RegistrationStatus;
import java.time.Instant;

public record RegistrationResponse(
        String id,
        String courseDateId,
        String courseTitle,
        String dateLabel,
        String firstName,
        String lastName,
        String email,
        String phone,
        String language,
        String message,
        RegistrationStatus status,
        Instant createdAt) {
    public static RegistrationResponse from(Registration r) {
        return new RegistrationResponse(
                r.getId().toString(),
                r.getCourseDate().getId().toString(),
                r.getCourseDate().getCourse().getTitle(),
                r.getCourseDate().getDateLabel(),
                r.getFirstName(),
                r.getLastName(),
                r.getEmail(),
                r.getPhone(),
                r.getLanguage(),
                r.getMessage(),
                r.getStatus(),
                r.getCreatedAt());
    }
}
