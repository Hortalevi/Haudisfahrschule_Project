package ch.haudis.verkehrsschule.security;

import ch.haudis.verkehrsschule.config.AppProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

// Signs/verifies the same HS256 session cookie the Next.js frontend reads
// (see src/proxy.ts, server.ts) - both sides must share app.jwt.secret verbatim,
// UTF-8 encoded (not base64-decoded), to stay compatible with `jose` there.
@Component
public class JwtService {

    private final SecretKey key;
    private final Duration ttl;

    public JwtService(AppProperties props) {
        this.key = Keys.hmacShaKeyFor(props.jwt().secret().getBytes(StandardCharsets.UTF_8));
        this.ttl = Duration.ofSeconds(props.jwt().ttlSeconds());
    }

    public String generate(String userId, String name, List<String> roles) {
        Instant now = Instant.now();
        return Jwts.builder()
                .claim("userId", userId)
                .claim("name", name)
                .claim("roles", roles)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(ttl)))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public Optional<Claims> parse(String token) {
        try {
            Jws<Claims> jws = Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return Optional.of(jws.getPayload());
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
