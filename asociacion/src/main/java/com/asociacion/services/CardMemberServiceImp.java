

package com.asociacion.services;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.asociacion.models.Config;
import com.asociacion.models.Member;
import com.asociacion.repositories.MemberRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.html.simpleparser.HTMLWorker;
import com.itextpdf.text.pdf.PdfWriter;

@Service
public class CardMemberServiceImp implements CardMemberService {

    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private ConfigServiceImp configServiceImp;
    

    @Override
    public byte[] generarPdf(Long id) {
        try {

            Optional<Config> cardPathConfig = configServiceImp.findById(5L);
            String cardPath = cardPathConfig.orElseThrow(() -> new RuntimeException("Configuración no encontrada")).getAttribute();
            ClassPathResource resource = new ClassPathResource(cardPath);
            String plantillaHtml;
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                plantillaHtml = reader.lines().collect(Collectors.joining("\n"));
            }

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
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);
            document.open();

            HTMLWorker worker = new HTMLWorker(document);
            worker.parse(new StringReader(htmlConDatos));
            worker.close();

            document.close();
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error al generar el carnet en PDF", e);
        }
    }
}
