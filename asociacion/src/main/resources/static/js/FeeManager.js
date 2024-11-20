import { RequestPost } from './RequestPost.js';
import { RequestPut } from './RequestPut.js';
import { RequestDel } from './RequestDel.js';
import { RequestGet } from './RequestGet.js';


export class FeeManager {
    constructor() {

    }


    static async checkFee() {
        const button = document.getElementById('updateFee')
        const currentYear = new Date().getFullYear();
        const memberId = document.getElementById('memberId').value
        const feesMember = await RequestGet.getFeeMember(memberId)
        const exist = feesMember.some(item => item.year === currentYear); // || item.date.startsWith('2023'));
        if (exist) {
            button.classList = 'buttonFee button-green'
            button.textContent = "Sin Deudas"
        } else {
            button.classList = 'buttonFee button-red'
            button.textContent = "Con Deudas"
        }
    }

    static async paidFee() {

        const currentYear = new Date().getFullYear();
        const currentDate = new Date();

        const memberId = document.getElementById('memberId').value
        const feesMember = await RequestGet.getFeeMember(memberId)

        if (confirm("¿Estás seguro de actulizar el pago para el año " + currentYear + "?")) {
            try {
                const exist = feesMember.some(item => item.year === currentYear); // || item.date.startsWith('2023'));
                if (exist) {
                    return
                } else {
                    const feeUpdate = {
                        memberId: memberId,
                        date: currentDate,
                        year: currentYear

                    }
                    const button = document.getElementById('updateFee')
                    button.classList = 'buttonFee button-green'
                    button.textContent = "Sin Deudas"
                    RequestPost.newFee(feeUpdate)
                }
            } catch (error) {
                console.error("Error al actulizar el pago:", error);
                alert("Error al actulizar el pago. Por favor, intente de nuevo.");
            }
        }

    }



}