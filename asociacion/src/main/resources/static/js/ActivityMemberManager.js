import { RequestPost } from './RequestPost.js';
import { RequestPut } from './RequestPut.js';
import { RequestDel } from './RequestDel.js';
import { RequestGet } from './RequestGet.js';


export class ActivityMemberManager {

    static async getActivitiesByMemberId(memberId) {
        const activitySel = document.getElementById("ul-activity-member");
        activitySel.innerHTML = "";

        try {
            const activities = await RequestGet.getActivitiesByMemberId(memberId);
            activities.forEach((activity) => {
                activitySel.innerHTML += `
                <li id="li-activitys-member-${activity.idLong}" data-activity-id="${activity.activityId}">
                    <button class="delete-button" id="li-button-${activity.activityId}" title="Eliminar Socio de la Actividad"><i class="fas fa-trash"></i></button>
                    <label class="text-activity" for="option${activity.activityId}" id="li-label-${activity.activityId}" title="Pulsar para abrir Actividad">${activity.activityName}</label>
                </li>`;
            });
        } catch (error) {
            console.error('Error al obtener actividades:', error);
        }
    }

    static async inyectOption() {
        const currentYear = new Date().getFullYear();
        const activitySel = document.getElementById("activity-select")

        activitySel.innerHTML = "";
        activitySel.innerHTML = `<option selected value="0">Lista de Actividades</option>`
        try {
            const activities = await RequestGet.getActivitys(currentYear)

            activities.forEach((activity) => {

                activitySel.innerHTML += `<option value="${activity.id}">${activity.name}</option>`;

            });
        } catch (error) {
            console.error('Error:', error);
            activitySel.innerHTML = '<p>Error al cargar las actividades.</p>';
        }


    }


    static async updateFamily(memberNumber) {

        let inputElement = document.getElementById("familyMasterNumber");
        const familyMasterNumber = inputElement.value
        let familyTypeId = inputElement.dataset.familyType;

        const familyUpdate = {
            familyMasterNumber: familyMasterNumber,
            memberNumber: memberNumber
        }
        await RequestPut.editFamily(familyTypeId, familyUpdate)
    }

    static async createActivityMemberThis(activityId, memberId) {
        const activity = await RequestGet.getActivityById(activityId);
        const activities = await RequestGet.getActivitiesByMemberId(memberId);
        const activityExistInMember = activities.some(activityOne => activityOne.activityId == activityId);
        if (activityId == 0 || activityExistInMember) {
            if (activityExistInMember) {
                alert("ERROR: Ya existe en la actividad: " + activity.name);
            }
            return;
        }

        const request = {
            activity: activity,
            memberId: memberId
        };

        try {
            await RequestPost.newActivityMember(request);
            alert("Añadido a " + activity.name);
        } catch (error) {
            console.error("Error añadiendo ActivityMember:", error);
            alert("Error al añadir socio a la actividad. Por favor, intente de nuevo.");
        }
    }


    static async delMemberOfActivity1(memberId, activityIdLong, li) {
        const memberName = document.getElementById('name').value;
        const activityName = li.querySelector('label.text-activity').textContent;

        if (confirm(`¿Estás seguro de eliminar a ${memberName} de la actividad ${activityName}?`)) {
            try {
                await RequestDel.delActivityMember(activityIdLong);
                li.remove();
                await this.getActivitiesByMemberId(memberId); // Actualizar lista después de eliminar
            } catch (error) {
                console.error("Error al eliminar la actividad:", error);
                alert("Error al eliminar la actividad. Por favor, intente de nuevo.");
            }
        }
    }


    static extraerUltimoNumero(cadena) {
        const regex = /\d+$/;
        const match = cadena.match(regex);
        return match ? parseInt(match[0]) : null;
    }
}