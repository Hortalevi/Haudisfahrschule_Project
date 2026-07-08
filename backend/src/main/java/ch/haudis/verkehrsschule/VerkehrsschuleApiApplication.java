package ch.haudis.verkehrsschule;

import ch.haudis.verkehrsschule.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

// UserDetailsServiceAutoConfiguration is excluded because auth is handled entirely
// by our own JWT cookie filter (see security/JwtAuthFilter) - Spring's default
// in-memory user/generated-password mechanism is unused and would just be noise.
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
@EnableConfigurationProperties(AppProperties.class)
public class VerkehrsschuleApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(VerkehrsschuleApiApplication.class, args);
	}

}
