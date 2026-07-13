package ch.haudis.verkehrsschule.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

// A student sign-up for a specific CourseDate.
@Entity
@Table(name = "registration")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_date_id", nullable = false)
    private CourseDate courseDate;

    // Instructor credited with this sign-up for commission purposes - defaults to
    // the course date's teaching instructor but may be reassigned by an admin.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_instructor_id")
    private AppUser assignedInstructor;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String email;
    private String phone;
    private String language;
    private String message;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RegistrationStatus status = RegistrationStatus.CONFIRMED;

    // Whether the student has paid - toggled by the instructor/admin, independent
    // of the student's own optional message above.
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    // Free-form staff annotation (e.g. "cash at first lesson") - distinct from
    // the student's own `message` field above.
    @Column(name = "internal_notes")
    private String internalNotes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
