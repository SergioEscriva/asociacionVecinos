

package com.asociacion.services;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.InputStreamReader;
import java.util.Optional;
import java.util.stream.Collectors;
import java.nio.charset.StandardCharsets;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.asociacion.models.Config;
import com.asociacion.models.Member;
import com.asociacion.repositories.MemberRepository;
import org.xhtmlrenderer.pdf.ITextRenderer;

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

        // Carga la plantilla XHTML desde resources
        ClassPathResource resource = new ClassPathResource(cardPath);
        String plantillaHtml;
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            plantillaHtml = reader.lines().collect(Collectors.joining("\n"));
        }

        Member socio = memberRepository.findByMemberNumber(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        // Reemplazo de placeholders
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

        // Generación del PDF con Flying Saucer
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(htmlConDatos);
        renderer.layout();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        renderer.createPDF(outputStream);
        renderer.finishPDF();

        return outputStream.toByteArray();

    } catch (Exception e) {
        throw new RuntimeException("Error al generar el carnet en PDF", e);
    }
}
}