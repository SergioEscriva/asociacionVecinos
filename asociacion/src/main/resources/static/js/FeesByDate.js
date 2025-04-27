import { RequestGet } from './RequestGet.js';


export class FeesByDate {
    constructor() {

    }


    async init() {


        const fechaActual = new Date();

        const año = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const fechaFormateada = `${año}-${mes}-${dia}`;

        document.getElementById('date').value = fechaFormateada;

        const sendDateBtn = document.getElementById("sendDateBtn")
        if (sendDateBtn) {
            sendDateBtn.addEventListener("click", (event) => {
                event.preventDefault();
                const date = document.getElementById("date").value;
                FeesByDate.findByDate(date);
            });

        }
    }

    static async findByDate(date) {
        const memberAttribute = await RequestGet.getConfigById(3);
        const id = document.body.getAttribute("data-page-selection");
        const listFeeDate = await RequestGet.getFeeByDate(date);
        console.log(listFeeDate);
        let html = "";

        for (const feesDate of listFeeDate) {
            const member = await RequestGet.getMemberById(feesDate.memberId);
            const fees = await RequestGet.getFeeByMemberId(feesDate.memberId);
            console.log(fees);

            // Calcula el costo del año actual
            const cost = this.calculateFees(fees, feesDate.year);

            html += `<tr>
                        <td>${member.name}</td>
                        <td>${member.lastName1} ${member.lastName2}</td>
                        <td>${member.memberNumber}</td>
                        <td>${feesDate.year}</td>
                        <td>${cost}</td>
                    </tr>`;
        }

        let tbody = document.getElementById("tbody-fee-date");
        tbody.innerHTML = html;
    }

    static calculateFees(yearsFees, currentYear) {
        let years = yearsFees.map(item => item.year).sort((a, b) => a - b);

        for (let i = 0; i < years.length; i++) {
            if (years[i] === currentYear) {
                if (i === 0) {
                    // El primer año siempre es 12€
                    return 12;
                } else if (years[i] - years[i - 1] === 1) {
                    // Si el año es consecutivo, el costo es 7€
                    return 7;
                } else if (years[i] - years[i - 1] > 2) {
                    // Si han pasado más de 2 años, el costo es 12€
                    return 12;
                }
            }
        }
        return 0;
    }






}
