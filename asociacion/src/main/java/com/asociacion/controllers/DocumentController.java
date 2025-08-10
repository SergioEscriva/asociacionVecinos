// Archivo: src/main/java/com/asociacion/controllers/DocumentController.java

package com.asociacion.controllers;

import com.asociacion.models.SignedDocument;
import com.asociacion.models.Member;
import com.asociacion.services.DocumentService; // Cambiado para usar el nombre de clase correcto
import com.asociacion.services.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.io.InputStream;

/**
 * Controlador REST para manejar las peticiones de firma de documentos.
 */
@RestController
@RequestMapping("/api/documentos")
//@CrossOrigin(origins = "http://localhost:8080")
public class DocumentController {

    @Autowired
    private DocumentService documentService; // Inyecta el servicio con el nombre de clase correcto

    @Autowired
    private MemberService memberService;

    /**
     * Endpoint para obtener la lista de documentos firmados de un miembro.
     * Se busca por memberNumber.
     * @param memberNumber El número de miembro.
     * @return Una lista de objetos SignedDocument.
     */
    @GetMapping("/member-number/{memberNumber}")
    public List<SignedDocument> buscarDocumentos(@PathVariable Long memberNumber) {
        Member member = memberService.findByMemberNumber(memberNumber)
                                     .orElseThrow(() -> new RuntimeException("Miembro no encontrado con numero de miembro: " + memberNumber));
        return documentService.buscarDocumentosPorMemberNumber(member.getMemberNumber());
    }

/* 
@PostMapping("/firmar")
@ResponseStatus(HttpStatus.CREATED)
public SignedDocument firmarDocumento(@Valid @RequestBody SignedRequest request) {
    Member member = memberService.findByMemberNumber(request.getMemberNumber())
                                .orElseThrow(() -> new RuntimeException("Miembro no encontrado con número: " + request.getMemberNumber()));

    try {
        byte[] pdfBytes = documentService.agregarFirmaAPdf(member, request.getFirmaBase64(), request.getPdfBase64());
        return documentService.guardarDocumentoFirmado(member.getMemberNumber(), pdfBytes);
    } catch (IOException e) {
        e.printStackTrace();
        throw new RuntimeException("Error al generar o guardar el PDF.", e);
    }
}
*/
@PostMapping("/firmar")
@ResponseStatus(HttpStatus.CREATED)
public SignedDocument firmarDocumento(
        @RequestParam Long memberNumber,
        @RequestParam MultipartFile plantilla,
        @RequestParam String firmaBase64
        ) {

    System.out.println("memberNumber: " + memberNumber);
    System.out.println("plantilla: " + plantilla.getOriginalFilename() + " (" + plantilla.getSize() + " bytes)");
    System.out.println("firmaBase64: " + (firmaBase64 != null ? firmaBase64.substring(0, 30) + "..." : "null"));

    Member member = memberService.findByMemberNumber(memberNumber)
            .orElseThrow(() -> new RuntimeException("Miembro no encontrado con número: " + memberNumber));

    try (InputStream plantillaStream = plantilla.getInputStream()) {
        return documentService.crearYGuardarDocumentoFirmado(member, plantillaStream, firmaBase64);
    } catch (Exception e) {
        throw new RuntimeException("Error al crear y guardar documento firmado", e);
    }
}
    @GetMapping("/descargar/{id}")
    public ResponseEntity<byte[]> descargarDocumento(@PathVariable Long id) {
        SignedDocument documento = documentService.buscarDocumentoPorId(id);
        if (documento == null || documento.getContenidoPdf() == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", documento.getNombreArchivo());

        return new ResponseEntity<>(documento.getContenidoPdf(), headers, HttpStatus.OK);
    }
}
