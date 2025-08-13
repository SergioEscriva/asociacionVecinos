import { RequestGet } from '../api/RequestGet.js';
import * as XLSX from 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';

export class DocumentListManager {
  
async populateDocumentNames() {
    const miembrosActivos = await RequestGet.getListMembersActives();
    const nombresSet = new Set();

    for (const miembro of miembrosActivos) {
        const documentos = await RequestGet.fetchDocumentsByMemberNumber(miembro.memberNumber);
        for (const doc of documentos) {
            const nombreSinNumero = doc.nombreArchivo.replace(/^\d+_/, '').trim();
            if (nombreSinNumero) {
                nombresSet.add(nombreSinNumero);
            }
        }
    }

    const datalist = document.getElementById('document-name-datalist');
    datalist.innerHTML = '';
    [...nombresSet].sort().forEach(nombre => {
        const option = document.createElement('option');
        option.value = nombre;
        datalist.appendChild(option);
    });
}


constructor() {

  }

  async init() {
    this.documentNameInput = document.getElementById('document-name-input');
    this.toggleIncluded = document.getElementById('toggle-included');
    this.toggleLabel = document.getElementById('toggle-label');
    this.exportButton = document.getElementById('export-excel-btn');
    this.tableBody = document.querySelector('#document-list-table tbody');

    //this.documentNameInput.addEventListener('input', () => this.loadMembers());
    this.toggleIncluded.addEventListener('change', () => this.updateToggleLabel());
    this.toggleIncluded.addEventListener('change', () => this.loadMembers());
    this.exportButton.addEventListener('click', () => this.exportToExcel());

    this.searchButton = document.getElementById('search-documents-btn');
    this.searchButton.addEventListener('click', () => this.loadMembers());
    await this.populateDocumentNames();
this.updateToggleLabel();
    //this.loadMembers();
  }

  updateToggleLabel() {
    this.toggleLabel.textContent = this.toggleIncluded.checked ? 'Lo tienen' : 'No lo tienen';
  }

  async loadMembers() {
    const nombreArchivo = this.documentNameInput.value.trim().toLowerCase();
    const incluir = this.toggleIncluded.checked;
    this.showLoading();
    try {
      const miembrosActivos = await RequestGet.getListMembersActives();
      const miembrosFiltrados = [];

      for (const miembro of miembrosActivos) {
        const documentos = await RequestGet.fetchDocumentsByMemberNumber(miembro.memberNumber);
        const tieneDocumento = documentos.some(doc =>
          doc.nombreArchivo.toLowerCase().includes(nombreArchivo)
        );

        if ((incluir && tieneDocumento) || (!incluir && !tieneDocumento)) {
          miembrosFiltrados.push(miembro);
        }
      }

      this.renderTable(miembrosFiltrados);
      this.hideLoading();
    } catch (error) {
      console.error('Error al cargar miembros:', error);
    }
  }

  renderTable(miembros) {
    this.tableBody.innerHTML = '';
    for (const miembro of miembros) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${miembro.memberNumber}</td>
        <td>${miembro.name}</td>
        <td>${miembro.lastName1}</td>
        <td>${miembro.lastName2}</td>
      `;
      this.tableBody.appendChild(row);
    }
  }

  exportToExcel() {
    const rows = Array.from(this.tableBody.querySelectorAll('tr')).map(row => {
      const cells = row.querySelectorAll('td');
      return {
        Número: cells[0].textContent,
        Nombre: cells[1].textContent,
        Apellido1: cells[2].textContent,
        Apellido2: cells[3].textContent
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Miembros');
    XLSX.writeFile(workbook, 'miembros_documento.xlsx');
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