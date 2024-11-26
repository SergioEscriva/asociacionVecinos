import { RequestGet } from "./RequestGet.js";
import { RequestDel } from "./RequestDel.js";

export class Utility {

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