import { RequestGet } from '../api/RequestGet.js';
import * as XLSX from 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';


export class FeesByDate {
    constructor() {

    }

    static getInput(id) {
        return document.getElementById(id);
    }

    static setInputValue(id, value) {
        const el = this.getInput(id);
        if (el) el.value = value;
    }

    async init() {


        const fechaActual = new Date();

        const fechaFormateada = fechaActual.toISOString().split('T')[0];

        FeesByDate.setInputValue('startDate', fechaFormateada);
        FeesByDate.setInputValue('endDate', fechaFormateada);

        const backImage = await RequestGet.getConfigById(9);
        FeesByDate.getInput('backImage').src = backImage.attribute;

        const sendDateBtn = FeesByDate.getInput("sendDateBtn")
        if (sendDateBtn) {
            sendDateBtn.addEventListener("click", (event) => {
                event.preventDefault();
                const startDate = FeesByDate.getInput("startDate").value;
                const endDate = FeesByDate.getInput("endDate").value;

                FeesByDate.showLoading();
                FeesByDate.findByDate(startDate, endDate);
            });

        }

        const printBtn = FeesByDate.getInput('printExcell');
        if (printBtn) {
            printBtn.addEventListener('click', function () {
                const table = FeesByDate.getInput('tbody-fee-date').parentNode;
                const startDate = FeesByDate.getInput('startDate').value;
                const endDate = FeesByDate.getInput('endDate').value;
                const workbook = XLSX.utils.table_to_book(table, { sheet: "Pagos" });
                XLSX.writeFile(workbook, `pagos del ${startDate} al ${endDate}.xlsx`);
            });
        }


    }

    static async findByDate(startDate, endDate) {
        const memberAttribute = await RequestGet.getConfigById(3);
        const listFeeDate = await RequestGet.getFeeByDate(startDate, endDate);

        let html = "";
        let costeTotal = 0;
        let position = 1;
        for (const feesDate of listFeeDate) {
            const member = await RequestGet.getMemberById(feesDate.memberId);
            const fees = await RequestGet.getFeeByMemberId(feesDate.memberId);


            const cost = await this.calculateFees(fees, feesDate.year);
            costeTotal += cost;
            html += `<tr class="clickable-row" data-member-number="${member.memberNumber}">
                        <td>${position}</td>
                        <td>${member.name}</td>
                        <td>${member.lastName1?.replace(/null/gi, '').trim()} ${member.lastName2 || ''}</td>
                        <td>${member.memberNumber}</td>
                        <td>${feesDate.year}</td>
                        <td>${cost}</td>
                    </tr>`;
            position += 1
        }

        FeesByDate.setInputValue("totalsPay", `Total Recaudado, en ${position - 1} pagos: ${costeTotal}€`);
        FeesByDate.getInput("tbody-fee-date").innerHTML = html;
        FeesByDate.addRowClickListeners();
        FeesByDate.hideLoading();

    }

    static async calculateFees(yearsFees, currentYear) {
        const costAnual = await RequestGet.getConfigById(7);
        const costNuevo = await RequestGet.getConfigById(8);

        if (!costAnual || !costNuevo) throw new Error("Configuraciones no encontradas");


        const costeAnual = parseFloat(costAnual.attribute);
        const costeNuevo = parseFloat(costNuevo.attribute);

        let years = yearsFees.map(item => item.year).sort((a, b) => a - b);

        for (let i = 0; i < years.length; i++) {
            if (years[i] === currentYear) {
                if (i === 0) {
                    return costeNuevo;
                } else if (years[i] - years[i - 1] === 1) {
                    return costeAnual;
                } else if (years[i] - years[i - 1] > 2) {
                    return costeNuevo;
                }
            }
        }
        return 0;
    }

    static addRowClickListeners() {
        const rows = document.querySelectorAll('.clickable-row');

        rows.forEach(row => {
            row.addEventListener('click', function () {
                const memberNumberFromRow = this.getAttribute('data-member-number');

                if (memberNumberFromRow) {
                    sessionStorage.setItem('selectedMemberId', memberNumberFromRow);

                } else {
                    sessionStorage.removeItem('selectedMemberId');
                    console.warn("ListsManager: No se encontró memberNumber en la fila, limpiando sessionStorage para 'selectedMemberId'.");
                }

                if (typeof window.App !== 'undefined' && window.App.loadContent) {
                    window.App.loadContent('memberIndex', 2, null);
                } else {
                    console.error('ListsManager: Error: window.App.loadContent no está definido o accesible.');
                }
            });
        });
    }

      static showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'flex';
  }

  static hideLoading() {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) overlay.style.display = 'none';
  }

}








