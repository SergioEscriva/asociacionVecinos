import { RequestPost } from '../api/RequestPost.js';
import { RequestDel } from '../api/RequestDel.js';
import { RequestGet } from '../api/RequestGet.js';

export class FeeManager {
    constructor() {

    }


    static async checkFee() {

        const button = document.getElementById('updateFee')
        const currentYear = new Date().getFullYear();
        const memberId = document.getElementById('memberId').value
        const feesMember = await RequestGet.getFeeByMemberId(memberId)

        const member = await RequestGet.getMemberById(memberId);
        //const checkFee = document.getElementById('active'); // quitamos que sea activo o no de forma automática por tener pagado.


        const exist = feesMember.some(item => item.year === currentYear); // || item.date.startsWith('2023'));

        if (exist) {
            button.classList = 'buttonFee button-green'
            button.textContent = "Sin Deudas"
            //checkFee.checked = member.active === true; 

        } else {
            button.classList = 'buttonFee button-red'
            button.textContent = "Con Deudas"
            //checkFee.checked = member.active === false; 
        }
    }
    static async paidFee() {
        const memberId = document.getElementById('memberId').value;
        const feesMember = await RequestGet.getFeeByMemberId(memberId);

        const choice = prompt(
            "¿Qué deseas hacer con la cuota?\n\n" +
            "1 - Añadir año de cobro\n" +
            "2 - Borrar año de cobro\n" +
            "Cancelar para salir"
        );

        if (choice === null) {
            alert("Operación cancelada.");
            return;
        }

        switch (choice.trim()) {
            case "1":
                this.updatePaidFee(memberId, feesMember);
                break;
            case "2":
                this.delPaidFee(feesMember);
                break;
            default:
                alert("Opción no válida.");
        }
    }


    static async updatePaidFee(memberId, feesMember) {

        const currentYear = new Date().getFullYear();
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.valueAsDate = new Date();


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
                        year: selectedYear
                    };

                    await RequestPost.newFee(feeUpdate);
                    if (selectedYear == currentYear) {
                        document.getElementById('active').checked = true;
                    }
                    FeeManager.checkFee();
                }
            } catch (error) {
                console.error("Error al actualizar el pago:", error);
                alert("Error al actualizar el pago. Por favor, intente de nuevo.");
            }

        }
    }

    static async delPaidFee(feesMember) {
        const currentYear = new Date().getFullYear();

        // Solicita el año al usuario, con el año actual como valor predeterminado
        const inputYear = prompt("¿Qué año deseas borrar?", currentYear);

        if (inputYear === null) {
            alert("Operación cancelada.");
            return;
        }

        const yearToDelete = parseInt(inputYear);

        if (isNaN(yearToDelete)) {
            alert("Año no válido.");
            return;
        }

        const matchingItem = feesMember.find(item => item.year === yearToDelete);

        if (!matchingItem) {
            alert(`No se encontró un pago para el año ${yearToDelete}.`);
            return;
        }

        if (confirm(`¿Estás seguro de BORRAR el pago para el año ${yearToDelete}?`)) {
            try {
                await RequestDel.delFee(matchingItem.id);
                this.checkFee();
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