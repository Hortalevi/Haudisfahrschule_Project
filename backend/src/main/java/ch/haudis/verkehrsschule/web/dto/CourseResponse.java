package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.Course;
import ch.haudis.verkehrsschule.domain.CourseSection;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

// Full dashboard shape (admin/instructor) - includes cost/active/timestamps.
public record CourseResponse(
        String slug,
        String title,
        String tagline,
        String icon,
        String category,
        String audience,
        Integer priceFrom,
        String priceUnit,
        String priceNote,
        String summary,
        List<String> highlights,
        List<String> languages,
        String duration,
        String ctaLabel,
        List<CourseSection> sections,
        BigDecimal costPerSession,
        boolean active,
        Instant createdAt,
        Instant updatedAt) {
    public static CourseResponse from(Course c) {
        return new CourseResponse(
                c.getSlug(),
                c.getTitle(),
                c.getTagline(),
                c.getIcon(),
                c.getCategory(),
                c.getAudience(),
                c.getPriceFrom(),
                c.getPriceUnit(),
                c.getPriceNote(),
                c.getSummary(),
                c.getHighlights(),
                c.getLanguages(),
                c.getDuration(),
                c.getCtaLabel(),
                c.getSections(),
                c.getCostPerSession(),
                c.isActive(),
                c.getCreatedAt(),
                c.getUpdatedAt());
    }
}
