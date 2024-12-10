import { RequestGet } from "./RequestGet.js";
import { RequestPost } from "./RequestPost.js";
import { Utility } from "./Utility.js";
import { RegistryManager } from "./RegistryManager.js";
import { ActivityMemberManager } from "./ActivityMemberManager.js";

export class Listeners {
    constructor() {


    }

    static async init() {
        this.setupActivityManagerListeners()
        this.setupCheckActiveManagerListeners()
        this.listeningActividadesMember()

    }

    static setupCheckActiveManagerListeners() {

        const activeSel = document.getElementById("active")
        activeSel.addEventListener('click', async (event) => {
            const checkedStatus = event.target.checked
            const checkbox = document.querySelector('input[data-memberby-id]');
            const memberId = checkbox.getAttribute('data-memberby-id');

            if (checkedStatus) {
                RegistryManager.checkActivityTrue(memberId)
            } else {
                RegistryManager.checkActivityFalse(memberId)
            }
        });
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
                Utility.delMemberOfActivityMember(memberId, activityIdLong, li);
            } else if (target.tagName === 'LABEL') {
                const activityLink = document.querySelector('a[data-section="activityIndex"]');
                if (activityLink) {
                    activityLink.setAttribute('data-activity-id', activityId)
                    activityLink.click();
                }
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
                Utility.delMemberOfActivity(memberId, activityId.value, li);
            } else if (target.tagName === 'LABEL') {

                const memberLink = document.querySelector('a[data-section="memberIndex"]');
                if (memberLink) {
                    memberLink.setAttribute('data-member-id', memberId)
                    memberLink.click();
                }
            }
        });
    }

    static listeningActividadesMember() {
        // Listening desplegable Option
        const select1 = document.getElementById('activity-select')
        select1.replaceWith(select1.cloneNode(true)); // elimina envents anteriores

        const handleChange1 = async (event) => {
            const { value } = event.target
            const memberId = document.getElementById('memberId').value
            await ActivityMemberManager.createActivityMemberThis(value, memberId)
            await ActivityMemberManager.getActivitiesByMemberId(memberId);
        }
        document.getElementById('activity-select').addEventListener('change', handleChange1);
    }
}



/*Busqueda */

