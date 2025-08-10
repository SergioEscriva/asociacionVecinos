package com.asociacion.Utils;

import org.docx4j.dml.wordprocessingDrawing.Inline;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.docx4j.wml.*;
import org.docx4j.openpackaging.parts.WordprocessingML.BinaryPartAbstractImage;

import java.util.Base64;

public class InsertarFirma {
    
    public WordprocessingMLPackage insertarFirmaEnDocx(WordprocessingMLPackage wordMLPackage, String signatureBase64) throws Exception {
        byte[] imageBytes = Base64.getDecoder().decode(signatureBase64.split(",")[1]);
    
        MainDocumentPart mdp = wordMLPackage.getMainDocumentPart();
    
        BinaryPartAbstractImage imagePart = BinaryPartAbstractImage.createImagePart(wordMLPackage, imageBytes);
    
        int docPrId = 1;
        int cNvPrId = 2;
        Inline inline = imagePart.createImageInline("Firma", "Firma", docPrId, cNvPrId, false);
    
        P paragraph = mdp.createParagraphOfText("Firma del socio:");
        R run = new R();
        Drawing drawing = new Drawing();
        drawing.getAnchorOrInline().add(inline);
        run.getContent().add(drawing);
        paragraph.getContent().add(run);
    
        mdp.addObject(paragraph);
    
        return wordMLPackage;
    }
}
