package ch.haudis.verkehrsschule.repo;

import ch.haudis.verkehrsschule.domain.SiteSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingsRepository extends JpaRepository<SiteSettings, Short> {}
