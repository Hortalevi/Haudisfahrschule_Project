package ch.haudis.verkehrsschule.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Jwt jwt, Cors cors, Realtime realtime, boolean cookieSecure) {

    public record Jwt(String secret, String cookieName, long ttlSeconds) {}

    public record Cors(String allowedOrigins) {}

    public record Realtime(String nextInternalUrl, String sharedSecret) {}
}
