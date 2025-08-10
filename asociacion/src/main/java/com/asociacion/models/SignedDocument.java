// Archivo: src/main/java/com/asociacion/models/SignedDocument.java

package com.asociacion.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;
import java.util.Date;

/**
 * Entidad que representa un documento firmado en la base de datos.
 * El contenido del PDF se almacena como un BLOB.
 */
@Data
@Entity
@Table(name = "signed_documents")
public class SignedDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long memberNumber;

    private String nombreArchivo;

    @Column(name = "signed_date", nullable = false)
    private Date signedDate;

    // @Lob se usa para almacenar objetos grandes, como el contenido del PDF.
    @Lob
    private byte[] contenidoPdf;

    private String documentoHash;
}
