package ch.haudis.verkehrsschule.web.dto;

import jakarta.validation.constraints.NotBlank;

public record GalleryImageRequest(@NotBlank String src, @NotBlank String alt, @NotBlank String category, int sortOrder) {}
