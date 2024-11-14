import { RequestPost } from './RequestPost.js';
import { RequestPut } from './RequestPut.js';

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
        console.log(memberId)
        fetch(`api/activitymember/member/${memberId}`)
            .then(response => response.json())
            .then(activities => {
                console.log(activities)
                activities.forEach((activity) => {
                    console.log(activity)
                    activitySel.innerHTML += `
                        <li id="li-${activity.id}">
                            <button class="delete-button" id="li-button-${activity.id}"><i class="fas fa-trash"></i></button>
                            <label class="text-activity" for="option1" id="li-label-${activity.id}">${activity.activityName}</label>
                        </li>`;
                });
            })
            .catch(error => {
                console.error('Error:', error);
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
}