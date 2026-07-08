package ch.haudis.verkehrsschule.web.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotBlank(message = "Bitte gib einen Namen an.") String name,
        @NotBlank(message = "Bitte gib eine E-Mail-Adresse an.") @Email(message = "Bitte gib eine gültige E-Mail-Adresse an.")
                String email,
        @Size(min = 8, message = "Das Passwort muss mindestens 8 Zeichen lang sein.") String password,
        boolean isAdmin,
        boolean isInstructor) {

    @AssertTrue(message = "Bitte wähle mindestens eine Rolle (Admin oder Fahrlehrer/-in).")
    public boolean isRoleValid() {
        return isAdmin || isInstructor;
    }
}
