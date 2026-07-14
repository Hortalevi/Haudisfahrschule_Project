package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.CourseDate;
import ch.haudis.verkehrsschule.domain.RegistrationStatus;
import java.time.Instant;
import java.util.List;

// Dashboard shape (admin/instructor) - used by the Kalender/Angebote views.
public record CourseDateResponse(
        String id,
        String courseSlug,
        String courseTitle,
        String dateLabel,
        List<String> timeSlots,
        Instant startsAt,
        Instant endsAt,
        String location,
        int price,
        int capacity,
        String instructorId,
        String instructorName,
        String instructorColor,
        String notes,
        long confirmedCount,
        Instant createdAt,
        Instant updatedAt) {
    public static CourseDateResponse from(CourseDate cd) {
        long confirmed = cd.getRegistrations().stream()
                .filter(r -> r.getStatus() == RegistrationStatus.CONFIRMED)
                .count();
        return new CourseDateResponse(
                cd.getId().toString(),
                cd.getCourse().getSlug(),
                cd.getCourse().getTitle(),
                cd.getDateLabel(),
                cd.getTimeSlots(),
                cd.getStartsAt(),
                cd.getEndsAt(),
                cd.getLocation(),
                cd.getPrice(),
                cd.getCapacity(),
                cd.getInstructor() != null ? cd.getInstructor().getId().toString() : null,
                cd.getInstructor() != null ? cd.getInstructor().getName() : null,
                cd.getInstructor() != null ? cd.getInstructor().getColor() : null,
                cd.getNotes(),
                confirmed,
                cd.getCreatedAt(),
                cd.getUpdatedAt());
    }
}
