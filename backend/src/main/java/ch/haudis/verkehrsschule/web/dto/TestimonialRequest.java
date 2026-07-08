package ch.haudis.verkehrsschule.web.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record TestimonialRequest(
        @NotBlank String name, @NotBlank String course, @Min(1) @Max(5) int rating, @NotBlank String quote, int sortOrder) {}
