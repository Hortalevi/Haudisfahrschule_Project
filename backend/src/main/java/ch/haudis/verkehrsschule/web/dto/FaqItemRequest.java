package ch.haudis.verkehrsschule.web.dto;

import jakarta.validation.constraints.NotBlank;

public record FaqItemRequest(@NotBlank String question, @NotBlank String answer, int sortOrder) {}
