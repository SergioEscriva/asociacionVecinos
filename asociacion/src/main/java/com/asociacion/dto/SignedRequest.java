package com.asociacion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SignedRequest {
    @NotNull(message = "El numero de miembro no puede ser nulo.")
    private Long memberNumber;

    @NotBlank(message = "La firmaBase64 no puede estar vacía.")
    private String firmaBase64;

    @NotBlank(message = "El contenido del PDF no puede estar vacío.")
    private String pdfBase64;

}