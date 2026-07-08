package ch.haudis.verkehrsschule.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;

public record CourseDateRequest(
        @NotBlank String courseSlug,
        @NotBlank String dateLabel,
        @NotEmpty List<String> timeSlots,
        @NotNull Instant startsAt,
        Instant endsAt,
        @NotBlank String location,
        @Min(0) int price,
        @Min(1) int capacity,
        String instructorId,
        String notes) {}
