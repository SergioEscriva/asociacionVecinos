package com.asociacion.services;

import com.asociacion.dto.MemberDTO;
import com.asociacion.models.Member;
import com.asociacion.models.SignedDocument;
import java.io.InputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface DocumentService {


    public SignedDocument guardarDocumentoFirmado(Long memberNumber, byte[] contenidoPdf, String originalFileName) throws IOException;

    List<SignedDocument> buscarDocumentosPorMemberNumber(Long memberNumber);

    SignedDocument buscarDocumentoPorId(Long id);

    String generarHash(byte[] input) throws IOException;

    String obtenerNombreBase(String fileName);

    SignedDocument crearYGuardarDocumentoFirmado(Long memberNumber, MultipartFile plantilla, String firmaBase64, String originalFileName, Date fechaAlta) throws Exception;

    List<MemberDTO> getFilteredMembers(String nombreArchivo, boolean incluidos);

    void delDocumentById(Long id);

     byte[] agregarFirmaAPdf(Member member, String firmaBase64, String pdfBase64) throws IOException;
}