import { RequestGet } from "./RequestGet.js";
import { RequestDel } from "./RequestDel.js";

export class Listeners {
    constructor() {


    }

    static async init() {
        this.setupActivityManagerListeners()

    }

    static setupActivityManagerListeners() {
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
                this.delMemberOfActivityMember(memberId, activityIdLong, li);
            } else if (target.tagName === 'LABEL') {
                window.location.href = `./activityIndex.html?activityId=${activityId}`;
            }
        });
    }

    static setupActivityListeners() {
        const activitySel = document.getElementById("ul-members-activity");

        activitySel.addEventListener('click', async (event) => {
            const target = event.target;
            const li = target.closest('li');
            if (!li) return;
            const memberId = li.dataset.activityId;
            const activityId = document.getElementById('activityId')

            if (target.classList.contains('delete-button') || target.closest('.delete-button')) {
                this.delMemberOfActivity(memberId, activityId.value, li);
            } else if (target.tagName === 'LABEL') {
                const member = await RequestGet.getMemberById(memberId)

                window.location.href = `./memberIndex.html?memberId=${member.memberNumber}`;
            }
        });
    }

    static async delMemberOfActivityMember(memberId, activityIdLong, li) {
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
        //const activitySel = document.getElementById("ul-activity-member");
        //activitySel.innerHTML = "";
        //await ActivityMemberManager.getActivitiesByMemberId(memberId)
    }


    static async delMemberOfActivity(memberId, activityId, li) {
        const memberName = li.querySelector('.text-activity').textContent.trim();
        const activityName = document.getElementById('activityName').value

        const activities = await RequestGet.getActivitiesByMemberId(memberId)
        const activityInMember = activities.find(activityOne => activityOne.activityId == activityId)
        const activityIdLong = activityInMember.idLong

        console.log(memberName, activityName)
        if (confirm("¿Estás seguro de eleminar a " + memberName + " de la actividad " + activityName + "?")) {
            try {
                await RequestDel.delActivityMember(activityIdLong);
                li.remove();
                //this.getActivitiesByMemberId(memberId)
            } catch (error) {
                console.error("Error al eliminar la actividad:", error);
                alert("Error al eliminar la actividad. Por favor, intente de nuevo.");
            }
        } else {
            return
        }
    }
}