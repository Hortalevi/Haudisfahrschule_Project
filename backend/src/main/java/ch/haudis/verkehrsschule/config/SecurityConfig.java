package ch.haudis.verkehrsschule.config;

import ch.haudis.verkehrsschule.security.CsrfCookieFilter;
import ch.haudis.verkehrsschule.security.JwtAuthFilter;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter, AppProperties props)
            throws Exception {
        CookieCsrfTokenRepository csrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        // Match the session cookie's lifetime - otherwise the (session-scoped by
        // default) XSRF-TOKEN cookie can quietly disappear on browser restart
        // while the JWT is still valid, breaking every mutation until next login.
        csrfTokenRepository.setCookieMaxAge((int) props.jwt().ttlSeconds());
        CsrfTokenRequestAttributeHandler csrfRequestHandler = new CsrfTokenRequestAttributeHandler();

        http.cors(cors -> cors.configurationSource(corsConfigurationSource(props)))
                .csrf(csrf -> csrf.csrfTokenRepository(csrfTokenRepository).csrfTokenRequestHandler(csrfRequestHandler))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()
                        // Uptime monitors (e.g. UptimeRobot) send HEAD by default,
                        // which must be allowed anywhere GET is public.
                        .requestMatchers(HttpMethod.HEAD, "/api/public/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/public/registrations").permitAll()
                        .requestMatchers("/api/auth/login", "/api/auth/csrf").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/users/me").authenticated()
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/content/**").hasRole("ADMIN")
                        // Money is admin-only: an instructor may teach and be assigned
                        // students, but only the admin sees revenue/commission figures
                        // or reassigns commission credit between instructors.
                        .requestMatchers(HttpMethod.GET, "/api/stats/revenue", "/api/stats/commissions")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/registrations/*/assign-instructor")
                        .hasRole("ADMIN")
                        .requestMatchers(
                                "/api/courses/**",
                                "/api/course-dates/**",
                                "/api/registrations/**",
                                "/api/stats/**",
                                "/api/instructors")
                        .hasAnyRole("ADMIN", "INSTRUCTOR")
                        .anyRequest().authenticated())
                .exceptionHandling(e -> e
                        // Write the error directly rather than response.sendError(): sendError()
                        // triggers a servlet ERROR forward that re-enters this same filter chain,
                        // and JwtAuthFilter (a OncePerRequestFilter) skips ERROR dispatches by
                        // default - that second, now-anonymous pass would overwrite a 403 with 401.
                        .authenticationEntryPoint((req, res, ex) -> writeJsonError(res, 401, "Unauthorized"))
                        .accessDeniedHandler((req, res, ex) -> writeJsonError(res, 403, "Forbidden")))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(new CsrfCookieFilter(), CsrfFilter.class);

        return http.build();
    }

    private static void writeJsonError(HttpServletResponse response, int status, String message) throws java.io.IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }

    private CorsConfigurationSource corsConfigurationSource(AppProperties props) {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(props.cors().allowedOrigins().split(",")));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Content-Type", "X-XSRF-TOKEN"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
