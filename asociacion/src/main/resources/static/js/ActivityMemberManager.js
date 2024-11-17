import { RequestPost } from './RequestPost.js';
import { RequestPut } from './RequestPut.js';
import { RequestDel } from './RequestDel.js';
import { RequestGet } from './RequestGet.js';

export class ActivityMemberManager {


    static async getActivitiesByMemberId(memberId) {
        const activitySel = document.getElementById("ul-activity-member");
        activitySel.innerHTML = "";

        try {

            const activities = await RequestGet.getActivitiesByMemberId(memberId)
            activities.forEach((activity) => {
                activitySel.innerHTML += `
                    <li id="li-activitys-member-${activity.idLong}" data-activity-id="${activity.activityId}">
                        <button class="delete-button" id="li-button-${activity.activityId}"><i class="fas fa-trash"></i></button>
                        <label class="text-activity" for="option${activity.activityId}" id="li-label-${activity.activityId}">${activity.activityName}</label>
                    </li>`;
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

    async createFamily(memberNumber) {

        let familyMasterNumber = document.getElementById("familyMasterNumber").value;

        if (!familyMasterNumber) {
            familyMasterNumber = 0;
        }

        const familyUpdate = {
            familyMasterNumber: familyMasterNumber,
            idMember: memberNumber
        }
        await RequestPost.newFamily(familyUpdate)

    }

    static async delMemberOfActivity(memberId, activityId, li) {
        if (confirm("¿Estás seguro de que quieres borrar este elemento?")) {
            try {
                await RequestDel.delActivityMember(activityId);
                li.remove();
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

    static setupActivityListeners() {
        const activitySel = document.getElementById("ul-activity-member");

        activitySel.addEventListener('click', (event) => {
            const target = event.target;
            const li = target.closest('li');
            if (!li) return;

            const activityId = li.dataset.activityId;
            const memberId = document.getElementById('memberId').value; // Asumiendo que tienes un campo con el ID del miembro

            if (target.classList.contains('delete-button') || target.closest('.delete-button')) {
                this.delMemberOfActivity(memberId, activityId, li);
            } else if (target.tagName === 'LABEL') {
                console.log(activityId);
                alert(`Redirigirá a Actividades ${activityId}`);
            }
        });
    }
}