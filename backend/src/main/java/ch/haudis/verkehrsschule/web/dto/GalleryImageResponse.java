package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.GalleryImage;

public record GalleryImageResponse(String id, String src, String alt, String category, int sortOrder) {
    public static GalleryImageResponse from(GalleryImage g) {
        return new GalleryImageResponse(g.getId().toString(), g.getSrc(), g.getAlt(), g.getCategory(), g.getSortOrder());
    }
}
