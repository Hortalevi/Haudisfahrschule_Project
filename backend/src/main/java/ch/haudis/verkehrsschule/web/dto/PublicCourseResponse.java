package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.Course;
import ch.haudis.verkehrsschule.domain.CourseSection;
import java.util.List;

// Public shape for /kursangebot pages - no cost/active/timestamps.
public record PublicCourseResponse(
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
        List<CourseSection> sections) {
    public static PublicCourseResponse from(Course c) {
        return new PublicCourseResponse(
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
                c.getSections());
    }
}
