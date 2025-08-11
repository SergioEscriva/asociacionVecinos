package com.asociacion.services;

import com.asociacion.models.Member;
import com.asociacion.models.SignedDocument;
import java.io.InputStream;

import java.io.IOException;
import java.util.List;

public interface DocumentService {


    byte[] agregarFirmaAPdf(Member member, String pdfBase64, String firmaBase64) throws IOException;

    public SignedDocument guardarDocumentoFirmado(Long memberNumber, byte[] contenidoPdf, String originalFileName);

    List<SignedDocument> buscarDocumentosPorMemberNumber(Long memberNumber);

    SignedDocument buscarDocumentoPorId(Long id);

    public byte[] generarPdfDesdePlantilla(Member member, InputStream plantillaDocxStream) throws Exception;

    String generarHash(byte[] input) throws IOException;

    String obtenerNombreBase(String fileName);

    byte[] convertirDocxApdf(byte[] docxBytes) throws IOException;

    SignedDocument crearYGuardarDocumentoFirmado(Member member, InputStream plantillaDocxStream, String firmaBase64, String originalFileName) throws Exception;
}