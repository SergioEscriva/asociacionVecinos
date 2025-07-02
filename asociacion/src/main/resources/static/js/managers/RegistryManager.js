import { RequestPut } from '../api/RequestPut.js';
import { RequestPost } from '../api/RequestPost.js';
import { RequestGet } from '../api/RequestGet.js';

export class RegistryManager {
    static async checkActivityTrue(memberId) {
        const buttonFee = document.getElementById("updateFee")
        const activeCheckbox = document.getElementById('active')
        const titleButton = buttonFee.className

        if (titleButton.includes("buttonFee button-green")) {
            if (confirm("¿Estás seguro de actualizar el estado a ACTIVO?")) {
                this.activeMemberStart(memberId)
            }
            else {
                activeCheckbox.checked = false
            }
        } else {
            alert("No se puede activar con deudas")
            activeCheckbox.checked = false
        }
    }

    static async checkActivityFalse(memberId) {
        const activeCheckbox = document.getElementById('active')
        let reason = "Personal"
        if (confirm("¿Estás seguro de actualizar el estado a INACTIVO?")) {
            let newReason = reason
            const changeReason = confirm("¿Deseas mantener el motivo (" + reason + ")?\nPresiona 'Aceptar' para mantener, o 'Cancelar' para cambiar.");

            if (!changeReason) {
                newReason = prompt("Introduce el motivo de la baja:", reason);
            }
            this.activeMemberEnd(memberId, newReason)
        }
        else {
            activeCheckbox.checked = true
        }
    }

    static async activeMemberStart(memberId) {
        const currentDate = new Date();
        const registryExist = await this.activeMemberRegistry(memberId)
        if (!registryExist) {
            const registry = {
                memberId: memberId,
                startData: currentDate,
                endData: null,
                reasonEnd: null
            }
            RequestPost.newRegistry(registry)
        }
    }

    static async activeMemberEnd(memberId, reason) {
        const registryExist = await this.activeMemberRegistry(memberId)
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, -5) + "+00:00";

        if (registryExist) {
            const registry = {
                memberId: memberId,
                startData: registryExist.startData,
                endData: formattedDate,
                reasonEnd: reason
            }

            RequestPut.editRegistry(registryExist.id, registry)
        }
    }

    static async activeMemberRegistry(memberId) {
        const registrys = await RequestGet.getRegistryByMemberId(memberId)
        const exist = registrys.find(item => item.endData === null);

        if (exist) {
            return exist
        }
    }
}