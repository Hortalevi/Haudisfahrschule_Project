package ch.haudis.verkehrsschule.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Gallery images are managed by path/URL + metadata - no file upload pipeline in v1.
// `src` is expected to be either an existing /public path or an external URL.
@Entity
@Table(name = "gallery_image")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GalleryImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String src;
    private String alt;
    private String category;

    @Column(name = "sort_order")
    @Builder.Default
    private int sortOrder = 0;
}
