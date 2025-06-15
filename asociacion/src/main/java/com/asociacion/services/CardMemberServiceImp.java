package com.asociacion.services;

import java.io.ByteArrayOutputStream;
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
public byte[] generarPdf(Long id) throws IOException {
    File plantillaFile = ResourceUtils.getFile("classpath:templates/tarjeta.html");
    String plantillaHtml = Files.readString(plantillaFile.toPath(), StandardCharsets.UTF_8);

    Member socio = memberRepository.findByMemberNumber(id)
        .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

    String htmlConDatos = plantillaHtml
            .replace("${nombre}", socio.getName())
            .replace("${apellidos}", socio.getLastName1() + " " + socio.getLastName2())
            .replace("${numeroSocio}", String.valueOf(socio.getMemberNumber()))
            .replace("${dni}", socio.getDni())
            .replace("${address}", socio.getAddress())
            .replace("${address_number}", socio.getAddressNumber())
            .replace("${address_door}", socio.getAddressDoor())
            .replace("${location}", socio.getLocation())
            .replace("${phone}", String.valueOf(socio.getPhone()));

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    try {
        Document document = new Document();
        PdfWriter.getInstance(document, outputStream);
        document.open();

        HTMLWorker worker = new HTMLWorker(document);
        worker.parse(new StringReader(htmlConDatos));
        worker.close();

        document.close();
        return outputStream.toByteArray();
    } catch (Exception e) {
        throw new RuntimeException("Error al generar PDF", e);
    }
}

    }
