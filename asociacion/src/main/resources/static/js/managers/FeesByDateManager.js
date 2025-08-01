import { RequestGet } from '../api/RequestGet.js';
import * as XLSX from 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';


export class FeesByDate {
    constructor() {

    }


    async init() {


        const fechaActual = new Date();

        const año = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const fechaFormateada = `${año}-${mes}-${dia}`;

        document.getElementById('startDate').value = fechaFormateada;
        document.getElementById('endDate').value = fechaFormateada;

        const backImage = await RequestGet.getConfigById(9);
        document.getElementById('backImage').src = backImage.attribute;

        const sendDateBtn = document.getElementById("sendDateBtn")
        if (sendDateBtn) {
            sendDateBtn.addEventListener("click", (event) => {
                event.preventDefault();
                const startDate = document.getElementById("startDate").value;
                const endDate = document.getElementById("endDate").value;

                FeesByDate.findByDate(startDate, endDate);
            });

        }


        document.getElementById('printExcell').addEventListener('click', function () {
            let table = document.getElementById('tbody-fee-date').parentNode;
            let workbook = XLSX.utils.table_to_book(table, { sheet: "Pagos" });
            XLSX.writeFile(workbook, 'pagos del ' + startDate.value + ' al ' + endDate.value + '.xlsx');
        });





    }

    static async findByDate(startDate, endDate) {
        const memberAttribute = await RequestGet.getConfigById(3);
        const id = document.body.getAttribute("data-page-selection");
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
                        <td>${member.lastName1.replace(/null/gi, '').trim()} ${member.lastName2 || ''}</td>
                        <td>${member.memberNumber}</td>
                        <td>${feesDate.year}</td>
                        <td>${cost}</td>
                    </tr>`;
            position += 1
        }

        document.getElementById("totalsPay").textContent = ("Total Recaudado, en " + (position - 1) + " pagos: " + costeTotal + "€");
        let tbody = document.getElementById("tbody-fee-date");
        tbody.innerHTML = html;
        this.addRowClickListeners();

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

}








