package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.CourseSection;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.util.List;

public record CourseRequest(
        @NotBlank @Pattern(regexp = "^[a-z0-9-]+$", message = "Nur Kleinbuchstaben, Ziffern und Bindestriche.") String slug,
        @NotBlank String title,
        @NotBlank String tagline,
        @NotBlank String icon,
        @NotBlank String category,
        @NotBlank String audience,
        Integer priceFrom,
        @NotBlank String priceUnit,
        String priceNote,
        @NotBlank String summary,
        @NotEmpty List<String> highlights,
        List<String> languages,
        String duration,
        @NotBlank String ctaLabel,
        @NotEmpty List<CourseSection> sections,
        @DecimalMin("0") BigDecimal costPerSession,
        boolean active) {}
