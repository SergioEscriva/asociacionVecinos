package com.asociacion.Utils;



import com.itextpdf.forms.PdfAcroForm;
import com.itextpdf.forms.fields.PdfFormField;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.kernel.geom.Rectangle;
import java.io.ByteArrayInputStream; // Importación necesaria
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.Base64;

public class PdfManager {

    public byte[] firmarPdf(byte[] plantillaPdf, Map<String, String> datos, String firmaBase64) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        ByteArrayInputStream bais = new ByteArrayInputStream(plantillaPdf);
        PdfDocument pdfDoc = new PdfDocument(new PdfReader(bais), new PdfWriter(baos));
        
        PdfAcroForm form = PdfAcroForm.getAcroForm(pdfDoc, true);
        
        // Rellenar campos de formulario con los datos
        if (form != null) {
            for (Map.Entry<String, String> entry : datos.entrySet()) {
                PdfFormField field = form.getField(entry.getKey());
                if (field != null) {
                    field.setValue(entry.getValue());
                    field.setReadOnly(true);
                }
            }
        }
        
        // Agregar la firma al PDF
        byte[] signatureBytes = Base64.getDecoder().decode(firmaBase64.split(",")[1]);
        
        // Define la posición y tamaño para la imagen de la firma.
        Rectangle firmaArea = new Rectangle(100, 100, 150, 50); 
        
        PdfCanvas canvas = new PdfCanvas(pdfDoc.getFirstPage());
        canvas.addImage(ImageDataFactory.create(signatureBytes), firmaArea, false);
        

        pdfDoc.close();
        return baos.toByteArray();
    }
}