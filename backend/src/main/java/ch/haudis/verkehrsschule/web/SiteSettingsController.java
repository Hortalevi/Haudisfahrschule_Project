package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.service.SiteSettingsService;
import ch.haudis.verkehrsschule.web.dto.SiteSettingsRequest;
import ch.haudis.verkehrsschule.web.dto.SiteSettingsResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SiteSettingsController {

    private final SiteSettingsService service;

    public SiteSettingsController(SiteSettingsService service) {
        this.service = service;
    }

    @GetMapping("/api/public/site-settings")
    public SiteSettingsResponse get() {
        return SiteSettingsResponse.from(service.get());
    }

    @PutMapping("/api/content/site-settings")
    public SiteSettingsResponse update(@Valid @RequestBody SiteSettingsRequest request) {
        return SiteSettingsResponse.from(service.update(request));
    }
}
