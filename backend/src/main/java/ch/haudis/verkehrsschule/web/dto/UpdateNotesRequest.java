package ch.haudis.verkehrsschule.web.dto;

import jakarta.validation.constraints.Size;

public record UpdateNotesRequest(@Size(max = 1000) String notes) {}
