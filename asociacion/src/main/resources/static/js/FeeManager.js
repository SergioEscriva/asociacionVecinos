import { RequestPost } from './RequestPost.js';
import { RequestPut } from './RequestPut.js';
import { RequestDel } from './RequestDel.js';
import { RequestGet } from './RequestGet.js';
import { MembersManager } from './MembersManager.js';


export class FeeManager {
    constructor() {

    }


    static async checkFee() {

        const button = document.getElementById('updateFee')
        const currentYear = new Date().getFullYear();
        const memberId = document.getElementById('memberId').value
        const feesMember = await RequestGet.getFeeByMemberId(memberId)

        const member = await RequestGet.getMemberById(memberId);
        //const checkFee = document.getElementById('active'); // quitamos que sea activo o no de forma automática por pagar.


        const exist = feesMember.some(item => item.year === currentYear); // || item.date.startsWith('2023'));

        if (exist) {
            button.classList = 'buttonFee button-green'
            button.textContent = "Sin Deudas"
            //checkFee.checked = member.active === true;

        } else {
            button.classList = 'buttonFee button-red'
            button.textContent = "Con Deudas"
            // checkFee.checked = member.active === false;
        }
    }
    static async paidFee() {
        const currentYear = new Date().getFullYear();
        const currentDate = new Date();

        const memberId = document.getElementById('memberId').value
        const feesMember = await RequestGet.getFeeByMemberId(memberId)

        try {
            const exist = feesMember.some(item => item.year === currentYear); // || item.date.startsWith('2023'));
            if (exist) {
                this.delPaidFee(feesMember)
                return
            } else {
                this.updatePaidFee(memberId, feesMember)
            }
        } catch (error) {
            console.error("Error al actualizar el pago:", error);
            alert("Error al actualizar el pago. Por favor, intente de nuevo.");
        }
    }

    static async updatePaidFee(memberId, feesMember) {
        if (confirm("¿Estás seguro de actualizar el pago?")) {
            // Crear un input de tipo date dinámicamente
            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.valueAsDate = new Date(); // Establecer la fecha actual por defecto


            const result = prompt("Selecciona la fecha del pago:", dateInput.valueAsDate.toISOString().split('T')[0]);

            if (result !== null) {
                const selectedDate = new Date(result);

                if (isNaN(selectedDate)) {
                    alert("Fecha no válida. Se utilizará la fecha actual.");
                    selectedDate.setDate(new Date().getDate());
                }

                const selectedYear = selectedDate.getFullYear();

                try {
                    const exist = feesMember.some(item => item.year === selectedYear);
                    if (exist) {
                        alert(`Ya existe un pago para el año ${selectedYear}`);
                        return;
                    } else {
                        const feeUpdate = {
                            memberId: memberId,
                            date: selectedDate,
                            year: selectedYear // Aunque ahora tenemos la fecha completa, 'year' podría seguir siendo útil
                        };

                        await RequestPost.newFee(feeUpdate);
                        FeeManager.checkFee(); // Asumo que esta función recarga o actualiza la lista de cuotas
                    }
                } catch (error) {
                    console.error("Error al actualizar el pago:", error);
                    alert("Error al actualizar el pago. Por favor, intente de nuevo.");
                }
            } else {
                alert("Actualización de pago cancelada.");
            }
        }
    }

    static async delPaidFee(feesMember) {

        const currentYear = new Date().getFullYear();

        if (confirm("¿Estás seguro de BORRAR el pago para el año " + currentYear + "?")) {
            try {
                const matchingItem = feesMember.find(item => item.year === currentYear); // || item.date.startsWith('2023'));
                if (matchingItem) {
                    const matchingId = matchingItem ? matchingItem.id : null;

                    await RequestDel.delFee(matchingId)
                    this.checkFee()

                    return
                } else {
                    return
                }
            } catch (error) {
                console.error("Error al borrar el pago:", error);
                alert("Error al borrar el pago. Por favor, intente de nuevo.");
            }
        }


    }

    static async paidFeeList(memberId) {
        return await RequestGet.getFeeByMemberId(memberId)
    }

}