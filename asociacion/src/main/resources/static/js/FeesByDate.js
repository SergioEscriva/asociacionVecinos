import { RequestGet } from './RequestGet.js';


export class FeesByDate {
    constructor() {

    }


    async init() {

        const sendDateBtn = document.getElementById("sendDateBtn")
        if (sendDateBtn) {
            sendDateBtn.addEventListener("click", (event) => {  // Usamos función de flecha aquí
                event.preventDefault();  // Evitar el comportamiento predeterminado del formulario
                const date = document.getElementById("date").value;
                FeesByDate.findByDate(date);
            });

        }

        //buttonFeesBydate.textContent = "¿Deudas?"

        // Asignamos la llamada al botón
        /* const sendDateBtn = document.getElementById("sendDateBtn");
         if (sendDateBtn) {
             sendBtn.addEventListener("click", (event) => {  // Usamos función de flecha aquí
                 event.preventDefault();  // Evitar el comportamiento predeterminado del formulario
                 const date = document.getElementById("date").value;
                 this.findByDate(date);  
                 alert("Funciona el botón")
             });
         }*/
    }

    static async findByDate(date) {

        const memberAttribute = await RequestGet.getConfigById(3)
        const id = document.body.getAttribute('data-page-selection');
        const listFeeDate = await RequestGet.getFeeByDate(date);
        console.log(listFeeDate)
        let html = '';

        for (const feesDate of listFeeDate) {

            const member = await RequestGet.getMemberById(feesDate.memberId);

            html += `<tr>
                        <td>${member.name}</td>
                        <td>${member.lastName1} ${member.lastName2}</td>
                        <td>${member.memberNumber}</td>
                        <td>${feesDate.year}</td>
                        <td>7</td>
                    </tr>`;
        }

        let tbody = document.getElementById('tbody-fee-date');
        tbody.innerHTML = html;

        //const lastPaidYear = await this.getLastPaidYear(member.id)

    }


}
