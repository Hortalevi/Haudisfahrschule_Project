package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.domain.SiteSettings;
import ch.haudis.verkehrsschule.exception.ApiException;
import ch.haudis.verkehrsschule.repo.SiteSettingsRepository;
import ch.haudis.verkehrsschule.web.dto.SiteSettingsRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteSettingsService {

    private final SiteSettingsRepository repository;

    public SiteSettingsService(SiteSettingsRepository repository) {
        this.repository = repository;
    }

    public SiteSettings get() {
        return repository.findById((short) 1).orElseThrow(() -> ApiException.notFound("Website-Einstellungen fehlen."));
    }

    @Transactional
    public SiteSettings update(SiteSettingsRequest request) {
        SiteSettings settings = get();
        settings.setName(request.name());
        settings.setLegalName(request.legalName());
        settings.setShortName(request.shortName());
        settings.setUrl(request.url());
        settings.setDescription(request.description());
        settings.setPhone(request.phone());
        settings.setPhoneDisplay(request.phoneDisplay());
        settings.setEmail(request.email());
        settings.setAddressStreet(request.addressStreet());
        settings.setAddressPostalCode(request.addressPostalCode());
        settings.setAddressCity(request.addressCity());
        settings.setAddressRegion(request.addressRegion());
        settings.setAddressCountry(request.addressCountry());
        settings.setGeoLatitude(request.geoLatitude());
        settings.setGeoLongitude(request.geoLongitude());
        settings.setFounders(request.founders());
        settings.setOpeningHours(request.openingHours());
        settings.setSocials(request.socials());
        return repository.save(settings);
    }
}
