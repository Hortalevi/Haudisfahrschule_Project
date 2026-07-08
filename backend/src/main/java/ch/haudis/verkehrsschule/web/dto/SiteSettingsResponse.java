package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.OpeningHour;
import ch.haudis.verkehrsschule.domain.SiteSettings;
import ch.haudis.verkehrsschule.domain.SocialLink;
import java.time.Instant;
import java.util.List;

public record SiteSettingsResponse(
        String name,
        String legalName,
        String shortName,
        String url,
        String description,
        String phone,
        String phoneDisplay,
        String email,
        String addressStreet,
        String addressPostalCode,
        String addressCity,
        String addressRegion,
        String addressCountry,
        Double geoLatitude,
        Double geoLongitude,
        List<String> founders,
        List<OpeningHour> openingHours,
        List<SocialLink> socials,
        Instant updatedAt) {
    public static SiteSettingsResponse from(SiteSettings s) {
        return new SiteSettingsResponse(
                s.getName(),
                s.getLegalName(),
                s.getShortName(),
                s.getUrl(),
                s.getDescription(),
                s.getPhone(),
                s.getPhoneDisplay(),
                s.getEmail(),
                s.getAddressStreet(),
                s.getAddressPostalCode(),
                s.getAddressCity(),
                s.getAddressRegion(),
                s.getAddressCountry(),
                s.getGeoLatitude(),
                s.getGeoLongitude(),
                s.getFounders(),
                s.getOpeningHours(),
                s.getSocials(),
                s.getUpdatedAt());
    }
}
