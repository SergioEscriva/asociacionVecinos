import { RequestPut } from '../api/RequestPut.js';
import { RequestPost } from '../api/RequestPost.js';
import { RequestGet } from '../api/RequestGet.js';

export class FamilyManager {

    static async getFamilyById(id) {

        const family = await RequestGet.getFamilyById(id)
        let inputElement = document.getElementById("familyMasterNumber");
        inputElement.dataset.familyType = family.id; // se añade o cambia el valor al item

    }

    static async getFamilyByMemberNumber(memberNumber) {
        let family = await RequestGet.getFamilyByMemberNumber(memberNumber)
        let inputElement = document.getElementById("familyMasterNumber");
        if (family) {
            inputElement.dataset.familyType = family.id; // se añade o cambia el valor al item
            inputElement.value = family.familyMasterNumber
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

    static async createFamily(memberNumber) {

        let familyMasterNumber = document.getElementById("familyMasterNumber").value;

        if (!familyMasterNumber) {
            familyMasterNumber = 0;
        }

        const familyUpdate = {
            familyMasterNumber: familyMasterNumber,
            memberNumber: memberNumber
        }
        await RequestPost.newFamily(familyUpdate)

    }
}