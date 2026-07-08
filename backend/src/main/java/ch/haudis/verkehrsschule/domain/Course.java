package ch.haudis.verkehrsschule.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

// An editable "Kursangebot" — the content behind /kursangebot/[slug] on the public site.
@Entity
@Table(name = "course")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    private String slug;

    private String title;
    private String tagline;
    private String icon;
    private String category;
    private String audience;

    @Column(name = "price_from")
    private Integer priceFrom;

    @Column(name = "price_unit")
    private String priceUnit;

    @Column(name = "price_note")
    private String priceNote;

    private String summary;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> highlights;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> languages;

    private String duration;

    @Column(name = "cta_label")
    private String ctaLabel;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<CourseSection> sections;

    @Column(name = "cost_per_session", nullable = false)
    @Builder.Default
    private BigDecimal costPerSession = BigDecimal.ZERO;

    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
