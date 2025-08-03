import { RequestPost } from '../api/RequestPost.js';
import { RequestDel } from '../api/RequestDel.js';
import { RequestGet } from '../api/RequestGet.js';
import { RegistryManager } from './RegistryManager.js';

export class FeeManager {

    static getInput(id) {
        return document.getElementById(id);
    }

    static setInputValue(id, value) {
        const el = this.getInput(id);
        if (el) el.value = value;
    }

    static async checkFee() {
        const button = this.getInput('updateFee');
        const currentYear = new Date().getFullYear();
        const memberId = this.getInput('memberId').value;
        const feesMember = await RequestGet.getFeeByMemberId(memberId);

        const exist = Array.isArray(feesMember) && feesMember.some(item => item.year === currentYear);

        button.className = exist ? 'buttonFee button-green' : 'buttonFee button-red';
        button.textContent = exist ? "Sin Deudas" : "Con Deudas";
    }

    static async paidFee() {
        const memberId = this.getInput('memberId').value;
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
                await this.updatePaidFee(memberId, feesMember);
                break;
            case "2":
                await this.delPaidFee(feesMember);
                break;
            default:
                alert("Opción no válida.");
        }
    }

    static async updatePaidFee(memberId, feesMember) {
        const currentYear = new Date().getFullYear();
        const defaultDate = new Date().toISOString().split('T')[0];
        const result = prompt("Selecciona la fecha del pago:", defaultDate);

        if (result !== null) {
            const selectedDate = new Date(result);
            const selectedYear = selectedDate.getFullYear();

            if (isNaN(selectedDate)) {
                alert("Fecha no válida. Se utilizará la fecha actual.");
                selectedDate.setDate(new Date().getDate());
            }

            if (Array.isArray(feesMember) && feesMember.some(item => item.year === selectedYear)) {
                alert(`Ya existe un pago para el año ${selectedYear}`);
                return;
            }

            const feeUpdate = {
                memberId,
                date: selectedDate,
                year: selectedYear
            };

            try {
                await RequestPost.newFee(feeUpdate);
                if (selectedYear === currentYear && memberId) {
                    this.getInput('active').checked = true;
                    await RegistryManager.activeMemberStart(memberId);
                }
                await this.checkFee();
            } catch (error) {
                console.error("Error al actualizar el pago:", error);
                alert("Error al actualizar el pago. Por favor, intente de nuevo.");
            }
        }
    }

    static async delPaidFee(feesMember) {
        const currentYear = new Date().getFullYear();
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

        const matchingItem = Array.isArray(feesMember) ? feesMember.find(item => item.year === yearToDelete) : null;

        if (!matchingItem) {
            alert(`No se encontró un pago para el año ${yearToDelete}.`);
            return;
        }

        if (confirm(`¿Estás seguro de BORRAR el pago para el año ${yearToDelete}?`)) {
            try {
                await RequestDel.delFee(matchingItem.id);
                await this.checkFee();
            } catch (error) {
                console.error("Error al borrar el pago:", error);
                alert("Error al borrar el pago. Por favor, intente de nuevo.");
            }
        }
    }

    static async paidFeeList(memberId) {
        return await RequestGet.getFeeByMemberId(memberId);
    }

    static async registerNewMemberAndFee(datosSocio) {
        // 1. Crear socio y esperar el id
        const nuevoSocio = await RequestPost.newMember(datosSocio);
        const memberId = nuevoSocio.id;
        console.log(memberId, nuevoSocio);

        // 2. Registrar pago
        await this.updatePaidFee(memberId, []);

        // 3. Activar registro
        await RegistryManager.activeMemberStart(memberId);
    }
}