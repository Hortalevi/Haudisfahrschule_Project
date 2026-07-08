package ch.haudis.verkehrsschule.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistrationRequest(
        @NotBlank(message = "Bitte wähle einen Kurs bzw. Termin aus.") String courseDateId,
        @NotBlank @Size(min = 2, message = "Bitte gib deinen Vornamen an.") String firstName,
        @NotBlank @Size(min = 2, message = "Bitte gib deinen Nachnamen an.") String lastName,
        @NotBlank @Email(message = "Bitte gib eine gültige E-Mail-Adresse an.") String email,
        @NotBlank @Size(min = 6, message = "Bitte gib eine gültige Telefonnummer an.") String phone,
        @NotBlank(message = "Bitte wähle deine bevorzugte Sprache aus.") String language,
        @Size(max = 1000) String message) {}
