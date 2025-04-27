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

        let html = "";
        let costeTotal = 0;
        let position = 1;
        for (const feesDate of listFeeDate) {
            const member = await RequestGet.getMemberById(feesDate.memberId);
            const fees = await RequestGet.getFeeByMemberId(feesDate.memberId);

            // Calcula el costo del año actual
            const cost = await this.calculateFees(fees, feesDate.year);
            costeTotal += cost;
            html += `<tr>
                        <td>${position}</td>
                        <td>${member.name}</td>
                        <td>${member.lastName1} ${member.lastName2}</td>
                        <td>${member.memberNumber}</td>
                        <td>${feesDate.year}</td>
                        <td>${cost}</td>
                    </tr>`;
            position += 1
        }

        document.getElementById("totalsPay").textContent = ("Total Recaudado, en " + (position - 1) + " pagos: " + costeTotal + "€");
        let tbody = document.getElementById("tbody-fee-date");
        tbody.innerHTML = html;
    }

    static async calculateFees(yearsFees, currentYear) {
        const costAnual = await RequestGet.getConfigById(7);
        const costNuevo = await RequestGet.getConfigById(8);

        if (!costAnual || !costNuevo) throw new Error("Configuraciones no encontradas");

        // costAnual.attribute es un string ("7"), lo convertimos a número:
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







}
