import { RequestPut } from '../api/RequestPut.js';
import { RequestPost } from '../api/RequestPost.js';
import { RequestGet } from '../api/RequestGet.js';

export class RegistryManager {

    static getInput(id) {
        return document.getElementById(id);
    }

    static async checkActivityTrue(memberId) {
        const buttonFee = this.getInput("updateFee");
        const activeCheckbox = this.getInput('active');
        const isFeeOk = buttonFee.className.includes("buttonFee button-green");

        if (!isFeeOk) {
            alert("No se puede activar con deudas");
            activeCheckbox.checked = false;
            return;
        }

        if (confirm("¿Estás seguro de actualizar el estado a ACTIVO?")) {
            await this.activeMemberStart(memberId);
        } else {
            activeCheckbox.checked = false;
        }
    }

    static async checkActivityFalse(memberId) {
        const activeCheckbox = this.getInput('active');
        let reason = "Personal";

        if (!confirm("¿Estás seguro de actualizar el estado a INACTIVO?")) {
            activeCheckbox.checked = true;
            return;
        }

        const keepReason = confirm(`¿Deseas mantener el motivo (${reason})?\nPresiona 'Aceptar' para mantener, o 'Cancelar' para cambiar.`);
        if (!keepReason) {
            const newReason = prompt("Introduce el motivo de la baja:", reason);
            reason = newReason || reason;
        }

        await this.activeMemberEnd(memberId, reason);
    }

    static async activeMemberStart(memberId) {
        const currentDate = new Date();
        const registryExist = await this.activeMemberRegistry(memberId);

        if (!registryExist) {
            const registry = {
                memberId,
                startData: currentDate,
                endData: null,
                reasonEnd: null
            };
            await RequestPost.newRegistry(registry);
        }
    }

    static async activeMemberEnd(memberId, reason) {
        const registryExist = await this.activeMemberRegistry(memberId);
        if (!registryExist) return;

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, -5) + "+00:00";

        const registry = {
            memberId,
            startData: registryExist.startData,
            endData: formattedDate,
            reasonEnd: reason
        };

        await RequestPut.editRegistry(registryExist.id, registry);
    }

    static async activeMemberRegistry(memberId) {
        const registrys = await RequestGet.getRegistryByMemberId(memberId);
        return registrys.find(item => item.endData === null) || null;
    }
}