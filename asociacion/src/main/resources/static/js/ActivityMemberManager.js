import { RequestPost } from './RequestPost.js';
import { RequestPut } from './RequestPut.js';
import { ActivityManager } from './ActivityManager.js';

export class ActivityMemberManager {


    static async getActivityById(id) {
        fetch(`api/activitymember/activity/${id}`)
        /*
            .then(response => response.json())
            .then(family => {
                let inputElement = document.getElementById("familyMasterNumber");
                inputElement.dataset.familyType = family.id; // se añade o cambia el valor al item
                //inputElement.value = family.id
            })
            .catch(error => {
                console.error('Error:', error);
            });
            */
    }

    static async getActivitiesByMemberId(memberId) {

        let memberNumber = document.getElementById("memberNumber").value;
        const activitySel = document.getElementById("ul-activity-member");
        activitySel.innerHTML = "";
        fetch(`api/activitymember/member/${memberId}`)
            .then(response => response.json())
            .then(activities => {
                activities.forEach((activity) => {
                    console.log(activity)
                    activitySel.innerHTML += `
                        <li id="li-activitys-member-${activity.activityId}">
                            <button class="delete-button" id="li-button-${activity.activityId}"><i class="fas fa-trash"></i></button>
                            <label class="text-activity" for="option${activity.activityId}" id="li-label-${activity.activityId}">${activity.activityName}</label>
                        </li>`;
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });

        activitySel.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON' || event.target.tagName === 'I') {
                let li; if (event.target.tagName === 'BUTTON') {
                    li = event.target.parentNode;
                } else {
                    li = event.target.parentNode.parentNode;
                }
                console.log(li.id);

                const activityId = this.extraerUltimoNumero(li.id)

                ActivityManager.delMemberOfActivity(memberId, activityId, li)
            }
        });
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

    async oneFamilyCheck(memberNumber, familyMasterNumber) {
        if (!familyMasterNumber || memberNumber == familyMasterNumber) {
            familyMasterNumber = 0;
        }

        fetch(`api/family/check/${memberNumber}/${familyMasterNumber}`)
            .then(response => response.json())
            .then(family => {
                const familyMasterNumber = family.familyMasterNumber
                const memberNumber = family.memberNumber
            })

    }


    static extraerUltimoNumero(cadena) {
        const regex = /\d+$/;
        const match = cadena.match(regex);
        return match ? parseInt(match[0]) : null;
    }
}