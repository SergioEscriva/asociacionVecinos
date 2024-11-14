import { RequestPut } from './RequestPut.js';
import { RequestPost } from './RequestPost.js';
import { FamilyManager } from './FamilyManager.js';


export class MembersManager {
  constructor() {
    MembersManager.domElements = {};
  }

  async init() {
    MembersManager.getMemberById(1);
    document.getElementById("getElementByIdSelected").addEventListener("click", getElementByIdSelected);
    document.getElementById("updateMember").addEventListener("click", updateMember);

  }

  /*  
  window.onload = function () {
    getMemberById(1);
  };
  */


  static async getMemberById(memberId) {
    fetch(`api/members/${memberId}`)
      .then(response => response.json())
      .then(member => {
        document.getElementById('memberId').value = memberId;
        document.getElementById('memberNumber').value = member.memberNumber;
        FamilyManager.getFamilyById(memberId);
        document.getElementById('name').value = member.name;
        document.getElementById('lastName1').value = member.lastName1;
        document.getElementById('lastName2').value = member.lastName2;
        document.getElementById('address').value = member.address;
        document.getElementById('addressNumber').value = member.addressNumber;
        document.getElementById('addressDoor').value = member.addressDoor;
        document.getElementById('addressStaircase').value = member.addressStaircase;
        document.getElementById('location').value = member.location;
        document.getElementById('phone').value = member.phone;
        document.getElementById('email').value = member.email;
        document.getElementById('dni').value = member.dni;
        document.getElementById('gender').value = member.gender;
        document.getElementById('active').value = getActivo(member.active);
        document.getElementById('notes').value = member.notes;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  async getElementByIdSelected() {
    const memberId = document.getElementById('memberIdInput').value;
    this.getMemberById(memberId)
  }

  async getActivo(active) {
    var checkbox = document.getElementById('active');
    checkbox.checked = false
    if (active == 1)
      checkbox.checked = true
  }

  async updateMember() {
    try {
      const memberId = document.getElementById('memberId').value
      const memberNumber = document.getElementById('memberNumber').value
      const name = document.getElementById('name').value
      const lastName1 = document.getElementById('lastName1').value
      const lastName2 = document.getElementById('lastName2').value
      const address = document.getElementById('address').value
      const addressNumber = document.getElementById('addressNumber').value
      const addressDoor = document.getElementById('addressDoor').value
      const addressStaircase = document.getElementById('addressStaircase').value
      const location = document.getElementById('location').value
      const phone = document.getElementById('phone').value
      const email = document.getElementById('email').value
      const dni = document.getElementById('dni').value
      const gender = document.getElementById('gender').value
      const checkbox = document.getElementById('active')
      const isActive = checkbox.checked
      const inputNotes = document.getElementById("notes");
      const notes = inputNotes.value;

      var activate = 0
      if (isActive) {
        activate = 1
      }

      const memberUpdate = {
        memberNumber: memberNumber,
        name: name,
        lastName1: lastName1,
        lastName2: lastName2,
        address: address,
        addressNumber: addressNumber,
        addressDoor: addressDoor,
        addressStaircase: addressStaircase,
        location: location,
        phone: phone,
        email: email,
        dni: dni,
        gender: gender,
        active: activate,
        notes: notes
      }

      let request;
      if (!memberId) {
        request = await RequestPost.newMember(memberUpdate);
        await FamilyManager.createFamily(request.id)
      } else {
        request = await RequestPut.editMember(memberId, memberUpdate);
        await FamilyManager.updateFamily(memberId)
      }
      return request;

    } catch (error) {
      console.error("Error al actualizar el socio: ", error)
    }
  }
}