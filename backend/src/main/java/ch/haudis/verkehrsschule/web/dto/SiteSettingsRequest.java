package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.OpeningHour;
import ch.haudis.verkehrsschule.domain.SocialLink;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record SiteSettingsRequest(
        @NotBlank String name,
        @NotBlank String legalName,
        @NotBlank String shortName,
        @NotBlank String url,
        @NotBlank String description,
        @NotBlank String phone,
        @NotBlank String phoneDisplay,
        @NotBlank String email,
        @NotBlank String addressStreet,
        @NotBlank String addressPostalCode,
        @NotBlank String addressCity,
        @NotBlank String addressRegion,
        @NotBlank String addressCountry,
        Double geoLatitude,
        Double geoLongitude,
        List<String> founders,
        List<OpeningHour> openingHours,
        List<SocialLink> socials) {}
