package com.asociacion.services;


import com.asociacion.models.Config;
import com.asociacion.models.Member;
import com.asociacion.models.SignedDocument;
import com.asociacion.repositories.SignedDocumentRepository;

import org.docx4j.XmlUtils;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.wml.R;
import org.docx4j.wml.Tbl;
import org.docx4j.wml.Tc;
import org.docx4j.wml.Tr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Base64;
import org.docx4j.wml.P;
import org.docx4j.wml.Text;



@Service
public class DocumentServiceImp implements DocumentService {

    @Autowired
    private SignedDocumentRepository signedDocumentRepository;

    @Autowired
    private ConfigServiceImp configServiceImp;

    public SignedDocument crearYGuardarDocumentoFirmado(Member member, InputStream plantillaDocxStream, String firmaBase64, String originalFileName) throws Exception {
        byte[] pdfBytes = generarPdfDesdePlantilla(member, plantillaDocxStream);
        byte[] pdfFirmado = agregarFirmaAPdf(member, firmaBase64, Base64.getEncoder().encodeToString(pdfBytes));
        return guardarDocumentoFirmado(member.getMemberNumber(), pdfFirmado, originalFileName);
    }




    // Método para generar un PDF desde una plantilla DOCX
    @Override
    public byte[] generarPdfDesdePlantilla(Member member, InputStream plantillaDocxStream) throws Exception {
        Optional<Config> attributoVecinal =  configServiceImp.findById(1L);
        Optional<Config> attributoSocio = configServiceImp.findById(3L);
        String fechaActual = new SimpleDateFormat("dd 'de' MMMM 'de' yyyy", new Locale("es", "ES")).format(new Date());

        
        // 1. Cargar la plantilla DOCX
        WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.load(plantillaDocxStream);

        // 2. Definir los placeholders a reemplazar con datos del miembro
        Map<String, String> placeholders = new HashMap<>();
        placeholders.put("${nombre}", member.getName());
        placeholders.put("${apellido1}", member.getLastName1());
        placeholders.put("${apellido2}", member.getLastName2());
        placeholders.put("${dni}", member.getDni());
        placeholders.put("${numeroSocio}", member.getMemberNumber().toString());
        placeholders.put("${direccion}", member.getAddress() + ", " + member.getAddressNumber() + ", " + member.getAddressDoor());
        placeholders.put("${asociacion}", attributoVecinal.get().getAttribute());
        placeholders.put("${atributoSocio}", attributoSocio.get().getAttribute());
        placeholders.put("${fecha}", fechaActual);

        // 3. Reemplazar el texto en el documento   
        this.reemplazarTexto(wordMLPackage, placeholders);

        // 4. Guardar el documento modificado en un flujo de bytes
        ByteArrayOutputStream docxOut = new ByteArrayOutputStream();
        wordMLPackage.save(docxOut);

        // 5. Convertir el DOCX a PDF usando la librería iText
        byte[] pdfBytes = convertirDocxApdf(docxOut.toByteArray());

        return pdfBytes;
    }

    // Método principal para reemplazar texto 
    public void reemplazarTexto(WordprocessingMLPackage wordMLPackage, Map<String, String> replacements) {
        // Obtiene el contenido principal del documento
        List<Object> content = wordMLPackage.getMainDocumentPart().getContent();
        reemplazarTextoRecursivo(content, replacements);
    }

    private void reemplazarTextoRecursivo(List<Object> content, Map<String, String> replacements) {
        if (content == null) {
            return;
        }

        // Itera sobre todos los elementos del contenido (párrafos, tablas, etc.)
        for (Object o : content) {
            Object resolvedObject = XmlUtils.unwrap(o);

            // Si es un párrafo, procesa su contenido para reemplazar el texto
            if (resolvedObject instanceof P) {
                P paragraph = (P) resolvedObject;
                
                // Unimos todos los fragmentos de texto del párrafo en una sola cadena
                List<Text> textFragments = new ArrayList<>();
                StringBuilder combinedText = new StringBuilder();

                for (Object pContent : paragraph.getContent()) {
                    Object unwrapped = XmlUtils.unwrap(pContent);
                    if (unwrapped instanceof R) {
                        R r = (R) unwrapped;
                        for (Object rContent : r.getContent()) {
                            Object unwrappedRContent = XmlUtils.unwrap(rContent);
                            if (unwrappedRContent instanceof Text) {
                                Text text = (Text) unwrappedRContent;
                                textFragments.add(text);
                                combinedText.append(text.getValue());
                            }
                        }
                    }
                }
                
                String fullText = combinedText.toString();
                boolean replaced = false;

                // Ahora, buscamos y reemplazamos los placeholders en la cadena completa
                for (Map.Entry<String, String> entry : replacements.entrySet()) {
                    String placeholder = entry.getKey();
                    String replacementValue = entry.getValue() != null ? entry.getValue() : "";
                    
                    if (fullText.contains(placeholder)) {
                        String newFullText = fullText.replace(placeholder, replacementValue);
                        
                        // Actualizamos el valor del primer fragmento de texto
                        if (!textFragments.isEmpty()) {
                            textFragments.get(0).setValue(newFullText);
                            // Borramos el valor del resto de fragmentos para evitar duplicados
                            for (int i = 1; i < textFragments.size(); i++) {
                                textFragments.get(i).setValue("");
                            }
                        }
                        
                        fullText = newFullText; 
                        replaced = true;
                    }
                }
                

            } else if (resolvedObject instanceof Tbl) {
                // Si es una tabla, procesa su contenido de forma recursiva
                reemplazarTextoRecursivo(((Tbl) resolvedObject).getContent(), replacements);
            } else if (resolvedObject instanceof Tr) {
                // Si es una fila de tabla, procesa su contenido de forma recursiva
                reemplazarTextoRecursivo(((Tr) resolvedObject).getContent(), replacements);
            } else if (resolvedObject instanceof Tc) {
                // Si es una celda de tabla, procesa su contenido de forma recursiva
                reemplazarTextoRecursivo(((Tc) resolvedObject).getContent(), replacements);
            }
        }
    }



    // Método para convertir docx (en byte[]) a PDF (byte[])
    public byte[] convertirDocxApdf(byte[] docxBytes) throws IOException {
        ByteArrayOutputStream pdfOut = new ByteArrayOutputStream();

        try (
            InputStream docxIn = new ByteArrayInputStream(docxBytes);
            XWPFDocument docx = new XWPFDocument(docxIn);
            XWPFWordExtractor extractor = new XWPFWordExtractor(docx);
            PDDocument pdfDocument = new PDDocument()
        ) {
            String text = extractor.getText();

            PDPage page = new PDPage();
            pdfDocument.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(pdfDocument, page)) {
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.beginText();
                contentStream.setLeading(14.5f); // Espaciado entre líneas
                contentStream.newLineAtOffset(50, 750); // Posición inicial del texto

                // Divide el texto en líneas para ajustarlo a la página
                String[] lines = text.split("\\r?\\n");
                for (String line : lines) {
                    contentStream.showText(line);
                    contentStream.newLine();
                }
                contentStream.endText();
            }

            pdfDocument.save(pdfOut);
            return pdfOut.toByteArray();

        }
    }
    
    public SignedDocument guardarDocumentoFirmado(Long memberNumber, byte[] contenidoPdf, String originalFileName)
 {
        SignedDocument documento = new SignedDocument();
        //String originalFileName = "Documento_Firmado_Socio";
        documento.setMemberNumber(memberNumber);
        String nombreArchivoFirmado = memberNumber + "_" + obtenerNombreBase(originalFileName) + ".pdf";
        documento.setNombreArchivo(nombreArchivoFirmado);
        documento.setSignedDate(new Date());
        documento.setContenidoPdf(contenidoPdf);

        try {
            documento.setDocumentoHash(generarHash(contenidoPdf));
        } catch (IOException e) {
            e.printStackTrace();
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

            PDAcroForm acroForm = document.getDocumentCatalog().getAcroForm();

            if (acroForm != null) {

                
                acroForm.flatten(); 
            }

            // Añadir firma como imagen.
            byte[] firmaBytes = Base64.getDecoder().decode(firmaBase64.split(",")[1]);
            BufferedImage signatureImage = ImageIO.read(new ByteArrayInputStream(firmaBytes));
            PDImageXObject pdImage = LosslessFactory.createFromImage(document, signatureImage);

            PDPage page = document.getPage(0);
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true)) {
                contentStream.drawImage(pdImage, 100, 75, 250, 175); // Posición de la firma
            }

            // Añadir hash de integridad
            ByteArrayOutputStream baosBeforeHash = new ByteArrayOutputStream();
            document.save(baosBeforeHash);
            byte[] pdfBytesWithSignature = baosBeforeHash.toByteArray();
            String hash = generarHash(pdfBytesWithSignature);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 8);
                contentStream.newLineAtOffset(50, 50);
                contentStream.showText("Hash de integridad (SHA-256): " + hash);
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

    
}
