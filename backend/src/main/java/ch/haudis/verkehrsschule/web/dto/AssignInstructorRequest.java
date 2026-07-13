package ch.haudis.verkehrsschule.web.dto;

import jakarta.validation.constraints.NotBlank;

public record AssignInstructorRequest(@NotBlank(message = "Bitte wähle eine/n Fahrlehrer/-in aus.") String instructorId) {}
