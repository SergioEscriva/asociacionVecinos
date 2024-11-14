import { RequestPut } from './RequestPut.js';
import { RequestPost } from './RequestPost.js';

export class FamilyManager {

    static async getFamilyById(memberNumber) {
        fetch(`api/family/member/${memberNumber}`)
            .then(response => response.json())
            .then(family => {
                let inputElement = document.getElementById("familyMemberNumber");
                inputElement.dataset.familyType = family.id; // se añade o cambia el valor al item
                inputElement.value = family.familyMemberNumber

                document.getElementById('familyMemberNumber').value = family.familyMemberNumber;

            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    async updateFamily(memberNumber) {

        let inputElement = document.getElementById("familyMemberNumber");
        const familyMemberNumber = inputElement.value
        let familyTypeId = inputElement.dataset.familyType;

        const familyUpdate = {
            familyMemberNumber: familyMemberNumber,
            idMember: memberNumber
        }
        await RequestPut.editFamily(familyTypeId, familyUpdate)
    }

    async createFamily(memberNumber) {

        let familyMemberNumber = document.getElementById("familyMemberNumber").value;

        if (!familyMemberNumber) {
            familyMemberNumber = 0;
        }

        const familyUpdate = {
            familyMemberNumber: familyMemberNumber,
            idMember: memberNumber
        }
        await RequestPost.newFamily(familyUpdate)

    }

    async oneFamilyCheck(memberNumber, familyMemberNumber) {
        if (!familyMemberNumber || memberNumber == familyMemberNumber) {
            familyMemberNumber = 0;
        }

        fetch(`api/family/check/${memberNumber}/${familyMemberNumber}`)
            .then(response => response.json())
            .then(family => {
                const familyMemberNumber = family.familyMemberNumber
                const idMember = family.idMember
            })

    }
}