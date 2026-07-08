package ch.haudis.verkehrsschule.security;

import java.util.List;

// Authentication#getPrincipal() for a request authenticated via the JWT cookie.
public record AuthenticatedUser(String id, String name, List<String> roles) {
    public boolean isAdmin() {
        return roles.contains("ADMIN");
    }
}
