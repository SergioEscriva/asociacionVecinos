import { RequestGet } from "./RequestGet.js";
import { Utility } from "./Utility.js";

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
                Utility.delMemberOfActivityMember(memberId, activityIdLong, li);
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
                Utility.delMemberOfActivity(memberId, activityId.value, li);
            } else if (target.tagName === 'LABEL') {
                const member = await RequestGet.getMemberById(memberId)

                window.location.href = `./memberIndex.html?memberId=${member.memberNumber}`;
            }
        });
    }

}