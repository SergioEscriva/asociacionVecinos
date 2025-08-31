package com.asociacion.services;

import com.asociacion.Utils.PdfManager;
import com.asociacion.dto.MemberDTO;
import com.asociacion.models.Config;
import com.asociacion.models.Member;
import com.asociacion.models.SignedDocument;
import com.asociacion.repositories.MemberRepository;
import com.asociacion.repositories.SignedDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.io.IOException;
import java.util.ArrayList;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import java.io.InputStream;

import java.util.Base64;
// Importaciones de PDFBox, etc.
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;


@Service
public class DocumentServiceImp implements DocumentService {

    @Autowired
    private SignedDocumentRepository signedDocumentRepository;

    @Autowired
    private ConfigServiceImp configServiceImp;

    @Autowired
    private MemberRepository memberRepository;

    @Override
    public SignedDocument crearYGuardarDocumentoFirmado(Long memberNumber, MultipartFile plantilla, String firmaBase64, String originalFileName, Date fechaAlta) throws Exception {
        Optional<Config> attributoVecinal =  configServiceImp.findById(1L);
        Optional<Config> attributoSocio = configServiceImp.findById(3L);
        Member member = memberRepository.findById(memberNumber).orElseThrow(() -> new Exception("Member not found"));
        String fechaActual = new SimpleDateFormat("dd 'de' MMMM 'de' yyyy", new Locale("es", "ES")).format(new Date());
        String fechaAltaString = new SimpleDateFormat("dd 'de' MMMM 'de' yyyy", new Locale("es", "ES")).format(fechaAlta);
        System.out.println("fechaActual: " + fechaActual);
        System.out.println("fechaAlta: " + fechaAltaString);

        byte[] plantillaBytes = plantilla.getBytes();
        
        Map<String, String> datos = new HashMap<>();
        datos.put("memberNumber", String.valueOf(memberNumber));
        datos.put("fechaAlta", new SimpleDateFormat("dd 'de' MMMM 'de' yyyy", new Locale("es", "ES")).format(fechaAlta));
        datos.put("nombre", member.getName());
        datos.put("apellido1", member.getLastName1());
        datos.put("apellido2", member.getLastName2());
        datos.put("dni", member.getDni());
        datos.put("numeroSocio", member.getMemberNumber().toString());
        datos.put("direccion", member.getAddress() + ", " + member.getAddressNumber() + ", " + member.getAddressDoor());
        datos.put("asociacion", attributoVecinal.get().getAttribute());
        datos.put("atributoSocio", attributoSocio.get().getAttribute());
        datos.put("fecha", fechaActual);
        datos.put("postal", member.getPostal().toString());
        datos.put("localidad", member.getLocation());
        datos.put("telefono", member.getPhone().toString());
        datos.put("email", member.getEmail());
        datos.put("alta", fechaAltaString);

        PdfManager pdfManager = new PdfManager();
        byte[] documentoRellenadoBytes = pdfManager.firmarPdf(plantillaBytes, datos, firmaBase64);
        
        String documentoRellenadoBase64 = Base64.getEncoder().encodeToString(documentoRellenadoBytes);

        byte[] documentoFinalBytes = agregarFirmaAPdf(null, firmaBase64, documentoRellenadoBase64);
        
        SignedDocument documentoGuardado = guardarDocumentoFirmado(memberNumber, documentoFinalBytes, originalFileName);

        return documentoGuardado;
    }


    @Override
    public SignedDocument guardarDocumentoFirmado(Long memberNumber, byte[] contenidoPdf, String originalFileName) {
        SignedDocument documento = new SignedDocument();
        documento.setMemberNumber(memberNumber);
        String nombreArchivoFirmado = memberNumber + "_" + obtenerNombreBase(originalFileName) + ".pdf";
        documento.setNombreArchivo(nombreArchivoFirmado);
        documento.setSignedDate(new Date());
        
        // El hash se genera a partir del contenido del PDF para asegurar su integridad
        if (contenidoPdf != null && contenidoPdf.length > 0) {
            documento.setContenidoPdf(contenidoPdf);
            try {
                documento.setDocumentoHash(generarHash(contenidoPdf));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        
        return signedDocumentRepository.save(documento);
    }


    public String generarHash(byte[] input) throws IOException {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input);
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IOException("Algoritmo de hash no encontrado", e);
        }
    }

    public String obtenerNombreBase(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0) {
            return fileName.substring(0, dotIndex);
        }
        return fileName;
    }

    @Override
    public byte[] agregarFirmaAPdf(Member member, String firmaBase64, String pdfBase64) throws IOException {
        String[] partes = pdfBase64.split(",");
        String pdfData;
        
        if (partes.length > 1) {
            pdfData = partes[1];
        } else {
            pdfData = partes[0];
        }

        byte[] pdfBytes = Base64.getDecoder().decode(pdfData);

        try (InputStream templateInputStream = new ByteArrayInputStream(pdfBytes);
            PDDocument document = PDDocument.load(templateInputStream)) {

            // Añadir firma como imagen.
            byte[] firmaBytes = Base64.getDecoder().decode(firmaBase64.split(",")[1]);
            BufferedImage signatureImage = ImageIO.read(new ByteArrayInputStream(firmaBytes));
            PDImageXObject pdImage = LosslessFactory.createFromImage(document, signatureImage);

            PDPage page = document.getPage(0);
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true)) {
                contentStream.drawImage(pdImage, 100, 30, 250, 155); // Posición de la firma
            }

            // Añadir hash de integridad
            ByteArrayOutputStream baosBeforeHash = new ByteArrayOutputStream();
            document.save(baosBeforeHash);
            byte[] pdfBytesWithSignature = baosBeforeHash.toByteArray();
            String hash = generarHash(pdfBytesWithSignature); // ✅ Generar el hash aquí
            
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 8);
                contentStream.newLineAtOffset(100, 20);
                contentStream.showText("Hash de integridad (SHA-256): " + hash); // ✅ Imprimir el hash en el PDF
                contentStream.endText();
            }

            ByteArrayOutputStream finalOutput = new ByteArrayOutputStream();
            document.save(finalOutput);
            return finalOutput.toByteArray();
        }
    }

    @Override
    public List<SignedDocument> buscarDocumentosPorMemberNumber(Long memberNumber) {
        return signedDocumentRepository.findByMemberNumber(memberNumber);
    }

    @Override
    public SignedDocument buscarDocumentoPorId(Long id) {
        return signedDocumentRepository.findById(id).orElse(null);
    }

    public List<MemberDTO> getFilteredMembers(String nombreArchivo, boolean incluidos) {
        String normalizedNombre = nombreArchivo.trim().toLowerCase();
        List<Member> miembrosActivos = memberRepository.findActives();
        List<MemberDTO> resultado = new ArrayList<>();
        for (Member miembro : miembrosActivos) {
            List<SignedDocument> documentos = signedDocumentRepository.findByMemberNumber(miembro.getMemberNumber());
            boolean tieneDocumento = documentos.stream().anyMatch(doc -> {
                String nombre = doc.getNombreArchivo();
                String[] partes = nombre.split("_", 2);
                if (partes.length == 2) {
                    String nombreLimpio = partes[1].replace(".pdf", "").toLowerCase();
                    return nombreLimpio.equals(normalizedNombre);
                }
                return false;
            });
            if ((incluidos && tieneDocumento) || (!incluidos && !tieneDocumento)) {
                resultado.add(new MemberDTO(miembro));
            }
        }
        return resultado;
    }

    @Override
    public void delDocumentById(Long id) {
        signedDocumentRepository.deleteById(id);
    }
}