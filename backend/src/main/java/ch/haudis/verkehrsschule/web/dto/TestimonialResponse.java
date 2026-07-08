package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.Testimonial;

public record TestimonialResponse(String id, String name, String course, int rating, String quote, int sortOrder) {
    public static TestimonialResponse from(Testimonial t) {
        return new TestimonialResponse(t.getId().toString(), t.getName(), t.getCourse(), t.getRating(), t.getQuote(), t.getSortOrder());
    }
}
