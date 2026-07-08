package ch.haudis.verkehrsschule.web.dto;

import jakarta.validation.constraints.AssertTrue;

public record UpdateRolesRequest(boolean isAdmin, boolean isInstructor) {

    @AssertTrue(message = "Bitte wähle mindestens eine Rolle (Admin oder Fahrlehrer/-in).")
    public boolean isRoleValid() {
        return isAdmin || isInstructor;
    }
}
