package com.asociacion.services;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import com.asociacion.models.Member;
import com.asociacion.repositories.MemberRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.html.simpleparser.HTMLWorker;
import com.itextpdf.text.pdf.PdfWriter;

@Service
public class CardMemberServiceImp implements CardMemberService {

    @Autowired
    private MemberRepository memberRepository;


    @Override
    public void generarPdf(Long id) throws IOException{
        //Lee la plantilla
        File plantillaFile = ResourceUtils.getFile("classpath:templates/tarjeta.html");
        String plantillaHtml = Files.readString(plantillaFile.toPath(), StandardCharsets.UTF_8);

        //Obtener los datos del socio
        Member socio = memberRepository.findByMemberNumber(id).orElseThrow(() -> new RuntimeException("Socio no encontrado"));
        
        String htmlConDatos = plantillaHtml
                .replace("${nombre}", socio.getName())
                .replace("${apellidos}", socio.getLastName1() + " " + socio.getLastName2())
                .replace("${numeroSocio}", String.valueOf(socio.getMemberNumber()))
                .replace("${dni}", socio.getDni());

        //Generar el PDF (iText 5)
        String rutaEscritorio = System.getProperty("user.home") + "/Escritorio";
        File pdfFile = new File(rutaEscritorio, id + "_carnet_socio" + ".pdf");
        try (FileOutputStream outputStream = new FileOutputStream(pdfFile)) {
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);
            document.open();

            //Convertir HTML a PDF (iText 5 - Limitado)
            HTMLWorker worker = new HTMLWorker(document);
            worker.parse(new StringReader(htmlConDatos));
            worker.close();

            document.close(); // Cierra el documento
        } catch (Exception ex) {
            ex.printStackTrace();
           // throw ex; // Re-lanza la excepción para que se propague y se maneje en otro lugar si es necesario
        }
        System.out.println("PDF generado correctamente en: " + pdfFile.getAbsolutePath());
    }
}