package ch.haudis.verkehrsschule.web.dto;

import jakarta.validation.constraints.Pattern;

public record UpdateColorRequest(
        @Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "Bitte gib eine gültige Hex-Farbe an (z.B. #2a78d6).")
                String color) {}
