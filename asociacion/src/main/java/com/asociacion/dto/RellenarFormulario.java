package com.asociacion.dto;



import com.itextpdf.forms.PdfAcroForm;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;

import java.io.IOException;

public class RellenarFormulario {

    public static void main(String[] args) throws IOException {
        String origen = "plantilla.pdf";
        String destino = "formulario_rellenado.pdf";

        PdfDocument pdfDoc = new PdfDocument(new PdfReader(origen), new PdfWriter(destino));
        PdfAcroForm form = PdfAcroForm.getAcroForm(pdfDoc, true);

        // Rellenar los campos usando los nombres que asignaste en LibreOffice
        form.getField("nombre").setValue("Juan Pérez");
        //form.getField("fecha_factura").setValue("30/08/2025");

        pdfDoc.close();
        System.out.println("PDF rellenado exitosamente.");
    }
}