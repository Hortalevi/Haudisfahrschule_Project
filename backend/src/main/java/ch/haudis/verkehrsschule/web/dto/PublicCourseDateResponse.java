package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.CourseDate;
import ch.haudis.verkehrsschule.domain.RegistrationStatus;
import java.util.List;

// Public shape for /kursdaten-anmeldung - seat status instead of raw capacity/count.
public record PublicCourseDateResponse(
        String id,
        String courseSlug,
        String courseName,
        String dateLabel,
        List<String> timeSlots,
        String location,
        int price,
        String seatStatus) {

    public static PublicCourseDateResponse from(CourseDate cd) {
        long confirmed = cd.getRegistrations().stream()
                .filter(r -> r.getStatus() == RegistrationStatus.CONFIRMED)
                .count();
        return new PublicCourseDateResponse(
                cd.getId().toString(),
                cd.getCourse().getSlug(),
                cd.getCourse().getTitle(),
                cd.getDateLabel(),
                cd.getTimeSlots(),
                cd.getLocation(),
                cd.getPrice(),
                seatStatus(cd.getCapacity(), confirmed));
    }

    private static String seatStatus(int capacity, long taken) {
        if (taken >= capacity) return "ausgebucht";
        if (capacity - taken <= 3) return "wenige";
        return "viele";
    }
}
