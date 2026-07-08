package ch.haudis.verkehrsschule.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Bitte gib deine E-Mail-Adresse an.") @Email(message = "Bitte gib eine gültige E-Mail-Adresse an.")
                String email,
        @NotBlank(message = "Bitte gib dein Passwort an.") String password) {}
