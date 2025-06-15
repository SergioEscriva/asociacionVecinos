package com.asociacion.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asociacion.services.CardMemberService;

@RestController
@RequestMapping("/api/pdf")
public class CardMemberController {

    @Autowired
    private CardMemberService cardMemberService;

    @GetMapping("/card/{id}")
public ResponseEntity<byte[]> descargarCarnet(@PathVariable Long id, @RequestHeader("Authorization") String token) throws IOException {

    byte[] pdfBytes = cardMemberService.generarPdf(id); 
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.setContentDisposition(ContentDisposition.attachment().filename("carnet_" + id + ".pdf").build());

    return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
}
}