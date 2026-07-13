package ch.haudis.verkehrsschule.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import ch.haudis.verkehrsschule.domain.AppUser;
import ch.haudis.verkehrsschule.exception.ApiException;
import ch.haudis.verkehrsschule.repo.AppUserRepository;
import ch.haudis.verkehrsschule.web.dto.CreateUserRequest;
import ch.haudis.verkehrsschule.web.dto.UpdateRolesRequest;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

// Covers the last-admin guard - the one invariant this app can never violate,
// since violating it would lock everyone out of admin-only screens.
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private AppUserRepository users;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(users, passwordEncoder);
    }

    private AppUser adminUser(UUID id) {
        return AppUser.builder().id(id).name("Admin").email("admin@example.com").admin(true).instructor(false).build();
    }

    @Test
    void cannotDemoteTheLastAdmin() {
        UUID id = UUID.randomUUID();
        AppUser admin = adminUser(id);
        when(users.findById(id)).thenReturn(Optional.of(admin));
        when(users.countByAdminTrue()).thenReturn(1L);

        assertThatThrownBy(() -> userService.updateRoles(id, new UpdateRolesRequest(false, true)))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("letzte Admin");
    }

    @Test
    void canDemoteAnAdminWhenAnotherAdminExists() {
        UUID id = UUID.randomUUID();
        AppUser admin = adminUser(id);
        when(users.findById(id)).thenReturn(Optional.of(admin));
        when(users.countByAdminTrue()).thenReturn(2L);
        when(users.save(any())).thenAnswer(inv -> inv.getArgument(0));

        AppUser result = userService.updateRoles(id, new UpdateRolesRequest(false, true));

        assertThat(result.isAdmin()).isFalse();
        assertThat(result.isInstructor()).isTrue();
    }

    @Test
    void cannotDeleteTheLastAdmin() {
        UUID id = UUID.randomUUID();
        AppUser admin = adminUser(id);
        when(users.findById(id)).thenReturn(Optional.of(admin));
        when(users.countByAdminTrue()).thenReturn(1L);

        assertThatThrownBy(() -> userService.delete(id))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("letzte Admin");
    }

    @Test
    void canDeleteAnAdminWhenAnotherAdminExists() {
        UUID id = UUID.randomUUID();
        AppUser admin = adminUser(id);
        when(users.findById(id)).thenReturn(Optional.of(admin));
        when(users.countByAdminTrue()).thenReturn(2L);

        userService.delete(id);
        // no exception - deletion proceeds
    }

    @Test
    void cannotCreateUserWithDuplicateEmail() {
        when(users.existsByEmail("taken@example.com")).thenReturn(true);

        CreateUserRequest request = new CreateUserRequest("Name", "taken@example.com", "password123", false, true);

        assertThatThrownBy(() -> userService.create(request))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("existiert bereits");
    }

    @Test
    void generatesAUsernameFromTheInstructorsName() {
        when(users.existsByEmail(any())).thenReturn(false);
        when(users.existsByUsername(any())).thenReturn(false);
        when(users.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(passwordEncoder.encode(any())).thenReturn("hashed");

        CreateUserRequest request =
                new CreateUserRequest("Nadja Frei", "nadja@example.com", "password123", false, true);

        AppUser result = userService.create(request);

        assertThat(result.getUsername()).isEqualTo("nfr");
    }

    @Test
    void appendsASuffixWhenTheGeneratedUsernameIsAlreadyTaken() {
        when(users.existsByEmail(any())).thenReturn(false);
        when(users.existsByUsername("nfr")).thenReturn(true);
        when(users.existsByUsername("nfr2")).thenReturn(false);
        when(users.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(passwordEncoder.encode(any())).thenReturn("hashed");

        CreateUserRequest request =
                new CreateUserRequest("Nadja Frei", "nadja2@example.com", "password123", false, true);

        AppUser result = userService.create(request);

        assertThat(result.getUsername()).isEqualTo("nfr2");
    }
}
