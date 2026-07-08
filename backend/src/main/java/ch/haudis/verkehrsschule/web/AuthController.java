package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.domain.AppUser;
import ch.haudis.verkehrsschule.exception.ApiException;
import ch.haudis.verkehrsschule.repo.AppUserRepository;
import ch.haudis.verkehrsschule.security.AuthenticatedUser;
import ch.haudis.verkehrsschule.security.JwtService;
import ch.haudis.verkehrsschule.security.LoginRateLimiter;
import ch.haudis.verkehrsschule.security.SessionCookieFactory;
import ch.haudis.verkehrsschule.web.dto.LoginRequest;
import ch.haudis.verkehrsschule.web.dto.UserResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SessionCookieFactory cookieFactory;
    private final LoginRateLimiter rateLimiter;

    public AuthController(
            AppUserRepository users,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            SessionCookieFactory cookieFactory,
            LoginRateLimiter rateLimiter) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.cookieFactory = cookieFactory;
        this.rateLimiter = rateLimiter;
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String email = request.email().trim().toLowerCase();
        String rateLimitKey = httpRequest.getRemoteAddr() + ":" + email;
        if (!rateLimiter.tryAcquire(rateLimitKey)) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Zu viele Anmeldeversuche. Bitte versuche es später erneut.");
        }

        AppUser user = users.findByEmail(email).orElse(null);
        // Deliberately identical error for unknown email vs. wrong password - no user enumeration.
        if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "E-Mail oder Passwort ist falsch.");
        }

        String jwt = jwtService.generate(user.getId().toString(), user.getName(), user.roleNames());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieFactory.create(jwt).toString())
                .body(UserResponse.from(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookieFactory.clear().toString())
                .build();
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal AuthenticatedUser principal) {
        AppUser user = users.findById(UUID.fromString(principal.id()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Session ist ungültig."));
        return UserResponse.from(user);
    }

    // No-op endpoint the frontend calls once before login to make sure the
    // XSRF-TOKEN cookie has been issued (see CsrfCookieFilter).
    @GetMapping("/csrf")
    public ResponseEntity<Void> csrf() {
        return ResponseEntity.noContent().build();
    }
}
