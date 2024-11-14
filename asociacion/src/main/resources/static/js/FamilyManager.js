import { RequestPut } from './RequestPut.js';
import { RequestPost } from './RequestPost.js';

export class FamilyManager {

    static async getFamilyById(memberNumber) {
        fetch(`api/family/memberNumber/${memberNumber}`)
            .then(response => response.json())
            .then(family => {
                let inputElement = document.getElementById("familyMasterNumber");
                inputElement.dataset.familyType = family.id; // se añade o cambia el valor al item
                inputElement.value = family.familyMasterNumber

                document.getElementById('familyMasterNumber').value = family.familyMasterNumber;

            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    async updateFamily(memberNumber) {

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