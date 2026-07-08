package ch.haudis.verkehrsschule.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ProcessStepRequest(@Min(1) int step, @NotBlank String title, @NotBlank String description, int sortOrder) {}
