import { RequestPost } from './RequestPost.js';
import { RequestPut } from './RequestPut.js';
import { RequestDel } from './RequestDel.js';
import { RequestGet } from './RequestGet.js';


export class ActivityMemberManager {


    static async getActivitiesByMemberId(memberId) {
        const activitySel = document.getElementById("ul-activity-member");
        activitySel.innerHTML = ``;

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
        await this.createActivityMember(activityId, memberId)
        await this.getActivitiesByMemberId(memberId)

    }

    static async createActivityMemberInActivity(activityId, memberId) {
        await this.createActivityMember(activityId, memberId)
    }

    static async createActivityMember(activityId, memberId) {
        const activity = await RequestGet.getActivity(activityId)
        const activities = await RequestGet.getActivitiesByMemberId(memberId)
        const activityExistInMember = activities.some(activityOne => activityOne.activityId == activityId)

        if (activityId == 0) {
            return
        } else if (activityExistInMember) {
            alert("ERROR: Ya existe en la actividad: ", activity.activityName)
            return
        } else {
            const request = {
                activity: activity,
                memberId: memberId
            }
            try {
                await RequestPost.newActivityMember(request)
                alert("Añadido a " + activity.name)
            } catch (error) {
                console.error("Error añadiendo ActivityMember:", error)
                alert("Error al añadir socio a la actividad. Por favor, intente de nuevo.");
            }
        }

    }

    static async delMemberOfActivity1(memberId, activityIdLong, li) {
        const memberName = document.getElementById('name').value;

        const liElement = document.getElementById('li-activitys-member-' + activityIdLong);
        const labelElement = liElement.querySelector('label.text-activity');
        const activityName = labelElement.textContent;

        if (confirm("¿Estás seguro de eleminar a " + memberName + " de la actividad " + activityName + "?")) {
            try {
                await RequestDel.delActivityMember(activityIdLong);
                li.remove();
                //this.getActivitiesByMemberId(memberId)
            } catch (error) {
                console.error("Error al eliminar la actividad:", error);
                alert("Error al eliminar la actividad. Por favor, intente de nuevo.");
            }
        }
        const activitySel = document.getElementById("ul-activity-member");
        activitySel.innerHTML = "";
        await ActivityMemberManager.getActivitiesByMemberId(memberId)
    }


    static extraerUltimoNumero(cadena) {
        const regex = /\d+$/;
        const match = cadena.match(regex);
        return match ? parseInt(match[0]) : null;
    }

    static setupActivityListeners2() {
        const activitySel = document.getElementById("ul-activity-member");

        activitySel.addEventListener('click', async (event) => {
            const target = event.target;
            const li = target.closest('li');
            if (!li) return;

            const activityId = li.dataset.activityId;
            const memberId = document.getElementById('memberId').value;
            const activities = await RequestGet.getActivitiesByMemberId(memberId)
            const activityInMember = activities.find(activityOne => activityOne.activityId == activityId)
            const activityIdLong = activityInMember.idLong

            if (target.classList.contains('delete-button') || target.closest('.delete-button')) {
                this.delMemberOfActivity(memberId, activityIdLong, li);
            } else if (target.tagName === 'LABEL') {
                window.location.href = `./activityIndex.html?activityId=${activityId}`;
            }
        });
    }
}