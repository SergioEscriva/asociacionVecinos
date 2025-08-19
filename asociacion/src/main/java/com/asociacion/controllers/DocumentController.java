package com.asociacion.controllers;

import com.asociacion.models.SignedDocument;
import com.asociacion.dto.MemberDTO;
import com.asociacion.models.Member;
import com.asociacion.services.DocumentService; 
import com.asociacion.services.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;
import java.io.InputStream;

@RestController
@RequestMapping("/api/documentos")
//@CrossOrigin(origins = "http://localhost:8080")
public class DocumentController {

    @Autowired
    private DocumentService documentService; 
    @Autowired
    private MemberService memberService;

    @GetMapping("/member-number/{memberNumber}")
    public List<SignedDocument> buscarDocumentos(@PathVariable Long memberNumber) {
        Member member = memberService.findByMemberNumber(memberNumber)
                                     .orElseThrow(() -> new RuntimeException("Miembro no encontrado con numero de miembro: " + memberNumber));
        return documentService.buscarDocumentosPorMemberNumber(member.getMemberNumber());
    }

    @PostMapping("/firmar")
    @ResponseStatus(HttpStatus.CREATED)
    public SignedDocument firmarDocumento(
            @RequestParam Long memberNumber,
            @RequestParam MultipartFile plantilla,
            @RequestParam String firmaBase64,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date fechaAlta
            ) {

        Member member = memberService.findByMemberNumber(memberNumber)
                .orElseThrow(() -> new RuntimeException("Miembro no encontrado con número: " + memberNumber));

        try (InputStream plantillaStream = plantilla.getInputStream()) {
            return documentService.crearYGuardarDocumentoFirmado(member, plantillaStream, firmaBase64, plantilla.getOriginalFilename(), fechaAlta);

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

        @GetMapping("/activos")
        public List<MemberDTO> getActiveMembersByDocument(
            @RequestParam String nombreArchivo,
            @RequestParam boolean incluidos
        ) {
            return documentService.getFilteredMembers(nombreArchivo, incluidos);
        }

        @DeleteMapping("/eliminar/{id}")
        public ResponseEntity<Void> eliminarDocumento(@PathVariable Long id) {
            documentService.delDocumentById(id);
            return ResponseEntity.noContent().build();
        }

    }


