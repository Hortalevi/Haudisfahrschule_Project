package ch.haudis.verkehrsschule.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

// Singleton row (id is always 1) holding the site-wide contact/settings info
// that used to live hardcoded in src/content/site.ts.
@Entity
@Table(name = "site_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSettings {

    @Id
    @Builder.Default
    private short id = 1;

    private String name;

    @Column(name = "legal_name")
    private String legalName;

    @Column(name = "short_name")
    private String shortName;

    private String url;
    private String description;
    private String phone;

    @Column(name = "phone_display")
    private String phoneDisplay;

    private String email;

    @Column(name = "address_street")
    private String addressStreet;

    @Column(name = "address_postal_code")
    private String addressPostalCode;

    @Column(name = "address_city")
    private String addressCity;

    @Column(name = "address_region")
    private String addressRegion;

    @Column(name = "address_country")
    private String addressCountry;

    @Column(name = "geo_latitude")
    private Double geoLatitude;

    @Column(name = "geo_longitude")
    private Double geoLongitude;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> founders;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "opening_hours")
    private List<OpeningHour> openingHours;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<SocialLink> socials;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
