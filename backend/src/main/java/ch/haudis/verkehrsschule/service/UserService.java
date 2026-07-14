package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.domain.AppUser;
import ch.haudis.verkehrsschule.domain.InstructorColors;
import ch.haudis.verkehrsschule.exception.ApiException;
import ch.haudis.verkehrsschule.repo.AppUserRepository;
import ch.haudis.verkehrsschule.web.dto.CreateUserRequest;
import ch.haudis.verkehrsschule.web.dto.UpdateRolesRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;

    public UserService(AppUserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    public List<AppUser> listAll() {
        return users.findAllByOrderByNameAsc();
    }

    @Transactional
    public AppUser create(CreateUserRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmail(email)) {
            throw ApiException.conflict("Für diese E-Mail-Adresse existiert bereits ein Konto.");
        }
        String name = request.name().trim();
        String username = UsernameGenerator.unique(name, users::existsByUsername);
        AppUser user = AppUser.builder()
                .name(name)
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(request.password()))
                .admin(request.isAdmin())
                .instructor(request.isInstructor())
                .color(InstructorColors.forIndex(users.count()))
                .build();
        return users.save(user);
    }

    @Transactional
    public AppUser updateColor(UUID id, String color) {
        AppUser user = getOrThrow(id);
        user.setColor(color);
        return users.save(user);
    }

    @Transactional
    public AppUser updateRoles(UUID id, UpdateRolesRequest request) {
        AppUser user = getOrThrow(id);
        boolean wouldRemoveLastAdmin = user.isAdmin() && !request.isAdmin() && isLastRemainingAdmin(user);
        if (wouldRemoveLastAdmin) {
            throw ApiException.conflict("Der letzte Admin-Account kann nicht herabgestuft werden.");
        }
        user.setAdmin(request.isAdmin());
        user.setInstructor(request.isInstructor());
        return users.save(user);
    }

    @Transactional
    public void delete(UUID id) {
        AppUser user = getOrThrow(id);
        deleteInternal(user);
    }

    @Transactional
    public void deleteSelf(UUID id) {
        AppUser user = getOrThrow(id);
        deleteInternal(user);
    }

    private void deleteInternal(AppUser user) {
        if (user.isAdmin() && isLastRemainingAdmin(user)) {
            throw ApiException.conflict("Der letzte Admin-Account kann nicht gelöscht werden.");
        }
        users.delete(user);
    }

    private boolean isLastRemainingAdmin(AppUser user) {
        return user.isAdmin() && users.countByAdminTrue() <= 1;
    }

    private AppUser getOrThrow(UUID id) {
        return users.findById(id).orElseThrow(() -> ApiException.notFound("Benutzer nicht gefunden."));
    }
}
