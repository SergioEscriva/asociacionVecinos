// Archivo: src/main/java/com/asociacion/services/SignedManager.js

import { RequestPost } from '../api/RequestPost.js';
import { RequestGet } from '../api/RequestGet.js';
import { RequestDel } from '../api/RequestDel.js';

export class SignedManager {

    constructor() {
        this.signaturePad = null;
        this.memberNumberInput = null;
        this.searchButton = null;
        this.clearButton = null;
        this.saveButton = null;
        this.documentListContainer = null;
        this.documentListElement = null;
        this.messageBox = null;
        
    }

    showMessage(text, type) {
        if (!this.messageBox) return;

        this.messageBox.textContent = text;
        this.messageBox.className = 'mt-4 p-4 rounded-lg shadow-md';

        if (type === 'info') {
            this.messageBox.classList.add('bg-blue-100', 'text-blue-800');
        } else if (type === 'success') {
            this.messageBox.classList.add('bg-green-100', 'text-green-800');
        } else if (type === 'error') {
            this.messageBox.classList.add('bg-red-100', 'text-red-800');
        }

        this.messageBox.classList.remove('hidden');

        setTimeout(() => {
            this.messageBox.classList.add('hidden');
        }, 5000);
    }

    async renderDocumentList(documents) {
        if (!this.documentListElement || !this.documentListContainer) return;

        this.documentListElement.innerHTML = '';
        if (documents.length === 0) {
            this.documentListElement.innerHTML = '<p class="text-gray-500 italic">No se encontraron documentos firmados.</p>';
            this.documentListContainer.classList.remove('hidden');
            return;
        }

        documents.forEach(doc => {
            const documentItem = document.createElement('div');
            documentItem.className = 'p-3 my-2 bg-white rounded-lg shadow flex items-center justify-between';

            // Convertir base64 del PDF a Blob y crear un enlace de descarga
            const byteCharacters = atob(doc.contenidoPdf);
            const byteArrays = [];
            for (let i = 0; i < byteCharacters.length; i++) {
                byteArrays.push(byteCharacters.charCodeAt(i));
            }
            const byteArray = new Uint8Array(byteArrays);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            documentItem.innerHTML = `
                <div class="flex-1">
                    <i class="fas fa-file-pdf" aria-hidden="true"> ${doc.nombreArchivo}</i>
                </div>
                <div class="flex-1">
                    <p class="text-sm text-gray-500">
                        Firmado el: ${new Date(doc.signedDate).toLocaleString()} - 
                        <a href="${url}" target="_blank" class="text-blue-500 hover:underline">Ver PDF</a> - 
                        <a href="#" class="text-red-500 hover:underline delete-doc-btn" data-doc-id="${doc.id}">Borrar PDF</a>
                    </p>
                </div>
            `;

            this.documentListElement.appendChild(documentItem);

            const deleteButton = documentItem.querySelector('.delete-doc-btn');
            deleteButton.addEventListener('click', (e) => {
                e.preventDefault(); // Evita que el enlace recargue la página
                this.handleDeleteDocument(doc.id);
            });
        });

        this.documentListContainer.classList.remove('hidden');
    }

    async init() {
        this.memberAttribute = await RequestGet.getConfigById(3);
        document.getElementById('socio-id-label').textContent = 'Número ' + this.memberAttribute.attribute;
        const signatureCanvas = document.getElementById('signature-pad');
        this.memberNumberInput = document.getElementById('socio-id');
        this.searchButton = document.getElementById('search-btn');
        this.clearButton = document.getElementById('clear-btn');
        this.saveButton = document.getElementById('save-btn');
        this.documentListContainer = document.getElementById('document-list-container');
        this.documentListElement = document.getElementById('document-list');
        this.messageBox = document.getElementById('message-box');
        const fileInput = document.getElementById('pdf-file-input');

        this.signaturePad = new SignaturePad(signatureCanvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
        });

               
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];

            if (file) {
                this.saveButton.disabled = false;
            }
        });
    
        this.searchButton.addEventListener('click', () => this.handleSearch());
        this.clearButton.addEventListener('click', () => this.handleClear());
        this.saveButton.addEventListener('click', () => this.handleSave());
        this.saveButton.disabled = true;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());


        const memberNumber = document.body.getAttribute("data-member-number");
        if (memberNumber) {
            this.memberNumberInput = document.getElementById("socio-id");
            this.memberNumberInput.value = memberNumber;
            await this.handleSearch();
        }

    }


    async handleSearch() {
    
    const memberNumber = this.memberNumberInput.value.trim();
    
    
    
    if (!memberNumber) {
        this.showMessage('Por favor, introduce un número válido.', 'error');
        this.documentListContainer.classList.add('hidden');
        return;
    }

    this.documentListElement.innerHTML = '';
    this.documentListContainer.classList.add('hidden');

    try {
        const foundDocuments = await RequestGet.fetchDocumentsByMemberNumber(memberNumber);
        let member = await RequestGet.getMemberByMemberNumber(memberNumber);
            document.getElementById('socio-name').textContent = member.name + " " + member.lastName1 + " " + member.lastName2;
        this.renderDocumentList(foundDocuments);
                    const columnasDiv = document.getElementsByClassName('sign-columns');
            for (let i = 0; i < columnasDiv.length; i++) {
                columnasDiv[i].classList.remove('deshabilitado');
            }

        if (foundDocuments.length > 0) {
            this.showMessage(`Se encontraron ${foundDocuments.length} documentos para ${this.memberAttribute.attribute} ${memberNumber}.`, 'success');

        } else {
            this.showMessage(`No se encontraron documentos para ${this.memberAttribute.attribute} ${memberNumber}.`, 'info');
        }
    } catch (error) {
        console.error(error);
        this.showMessage('Error al buscar documentos en el servidor.', 'error');
    }
    }

    handleClear() {
        this.signaturePad.clear();
        this.showMessage('Firma borrada. Puedes volver a intentarlo.', 'info');
    }

    

   async handleSave() {
    
    const fileInput = document.getElementById('pdf-file-input');    
    this.saveButton = document.getElementById('save-btn');
    this.saveButton.disabled = true;
    this.showLoading();

    const memberNumber = this.memberNumberInput.value.trim();

    const pdfFile = fileInput.files[0];

    const registries = await RequestGet.getRegistryByMemberId(memberNumber);
    const fechaAlta = registries.length > 0 ? registries[0].startData : new Date();

    if (!memberNumber || memberNumber === '0') {
         this.showMessage('Por favor, introduce un ID de socio válido.', 'error');
         this.saveButton.disabled = false;
         this.hideLoading();
         return;
    }

    if (this.signaturePad.isEmpty()) {
        this.showMessage('Por favor, primero firma en el recuadro.', 'error');
        this.saveButton.disabled = false;
        this.hideLoading();
        return;
    }

    if (!pdfFile) {
        this.showMessage('Por favor, selecciona un archivo PDF.', 'error');
        this.saveButton.disabled = false;
        this.hideLoading();
        return;
    }


    const signatureData = this.signaturePad.toDataURL('image/png');
    const pdfArrayBuffer = await pdfFile.arrayBuffer();
    const originalFileName = pdfFile.name;
    const pdfBlob = new Blob([pdfArrayBuffer], { type: pdfFile.type });

    try {
        const formData = new FormData();
        formData.append("memberNumber", memberNumber);
        formData.append("plantilla", pdfBlob, originalFileName); // archivo
        formData.append("firmaBase64", signatureData);
        formData.append("fechaAlta", fechaAlta);
        const result = await RequestPost.signDocument(formData);

        if (result.error) {
            throw new Error(result.errorMessage || "Error al guardar documento");
            
        }
           
        this.signaturePad.clear();
        this.showMessage('¡Documento firmado y guardado con éxito!', 'success');
        this.handleSearch();
        this.saveButton.disabled = false;
        this.hideLoading();

    } catch (error) {
        console.error("Error al guardar el documento: ", error);
        this.showMessage('Error al guardar la firma: ' + error.message, 'error');
        this.saveButton.disabled = false;
        this.hideLoading();
    }
}

    
    resizeCanvas() {
        const signatureCanvas = document.getElementById('signature-pad');
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        signatureCanvas.width = signatureCanvas.offsetWidth * ratio;
        signatureCanvas.height = signatureCanvas.offsetHeight * ratio;
        signatureCanvas.getContext('2d').scale(ratio, ratio);
        if (this.signaturePad) {
            this.signaturePad.fromData(this.signaturePad.toData());
        }
    }

    async handleDeleteDocument(docId) {
        const pin = prompt('Por favor, ingresa el PIN para confirmar la eliminación:');
        
        if (pin !== '4554') {
            alert('PIN incorrecto. No se puede borrar el documento.');
            return; 
        }

        try {
            await RequestDel.delDocument(docId);
            alert('Documento borrado exitosamente.');
            await this.handleSearch(); // Asegúrate de tener un método para recargar la lista.
        } catch (error) {
            console.error('Error al borrar el documento:', error);
            alert('Error al borrar el documento. Por favor, inténtalo de nuevo.');
        }
    }

     showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.style.display = 'flex';
    }

     hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.style.display = 'none';
    }

}