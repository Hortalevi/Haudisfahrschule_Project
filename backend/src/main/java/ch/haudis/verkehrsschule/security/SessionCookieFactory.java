package ch.haudis.verkehrsschule.security;

import ch.haudis.verkehrsschule.config.AppProperties;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class SessionCookieFactory {

    private final AppProperties props;

    public SessionCookieFactory(AppProperties props) {
        this.props = props;
    }

    public ResponseCookie create(String jwt) {
        return ResponseCookie.from(props.jwt().cookieName(), jwt)
                .httpOnly(true)
                .secure(props.cookieSecure())
                .sameSite("Lax")
                .path("/")
                .maxAge(props.jwt().ttlSeconds())
                .build();
    }

    public ResponseCookie clear() {
        return ResponseCookie.from(props.jwt().cookieName(), "")
                .httpOnly(true)
                .secure(props.cookieSecure())
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
    }
}
