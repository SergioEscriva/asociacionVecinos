import { RequestPut } from './RequestPut.js';
import { RequestPost } from './RequestPost.js';
import { RequestGet } from './RequestGet.js';
import { FamilyManager } from './FamilyManager.js';
import { ActivityMemberManager } from './ActivityMemberManager.js';




export class MembersManager {
  constructor() {

  }

  async init() {
    //Obtener el parámetro activityId de la URL
    const urlParams = new URLSearchParams(window.location.search);
    let memberId = urlParams.get('memberId');

    if (!memberId) {
      memberId = 10002
    }
    MembersManager.getMemberByNumber(memberId);

    document.getElementById("getElementByIdSelected").addEventListener("click", function () { MembersManager.getElementByIdSelected("normal"); });
    document.getElementById("getElementByIdSelectedXS").addEventListener("click", function () { MembersManager.getElementByIdSelected("xs"); });

    document.getElementById("updateMember").addEventListener("click", function () { MembersManager.updateMember(); });

  }


  static async limpiaCampos() {
    document.getElementById('memberId').value = "";
    document.getElementById('memberNumber').value = "";
    document.getElementById("familyMasterNumber").value = "";
    document.getElementById('name').value = "";
    document.getElementById('lastName1').value = "";
    document.getElementById('lastName2').value = "";
    document.getElementById('address').value = "";
    document.getElementById('addressNumber').value = "";
    document.getElementById('addressDoor').value = "";
    document.getElementById('addressStaircase').value = "";
    document.getElementById('location').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('email').value = "";
    document.getElementById('dni').value = "";
    document.getElementById('gender').value = "";
    document.getElementById('active').value = "";
    document.getElementById('notes').value = "";
    document.getElementById("memberNumber").value = "";
    MembersManager.limpiaCamposActividad();
  }

  static async limpiaCamposActividad() {
    const activitySel = document.getElementById("ul-activity-member");
    const oldListener = activitySel.onclick;
    activitySel.removeEventListener('click', oldListener);
    activitySel.innerHTML = "";
  }

  static async getMemberByNumber(memberNumber) {
    await MembersManager.limpiaCampos()

    const member = await RequestGet.getActivitysByMemberNumber(memberNumber)
    if (!member) {
      alert("El socio " + memberNumber + " no existe")
      return
    }
    document.getElementById('memberId').value = member.id;
    document.getElementById('memberNumber').value = memberNumber;
    FamilyManager.getFamilyByMemberNumber(memberNumber);
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
    document.getElementById('active').value = await MembersManager.getActivo(member.active);
    document.getElementById('notes').value = member.notes;
    MembersManager.inyectOption()
    await ActivityMemberManager.getActivitiesByMemberId(member.id)
  }

  static async getElementByIdSelected(screen) {
    const memberNumber = document.getElementById('memberIdInput').value;
    const memberNumberXS = document.getElementById('memberIdInputXS').value;
    if (screen === "xs") {
      this.getMemberByNumber(memberNumberXS)
      return
    }

    this.getMemberByNumber(memberNumber)
  }

  static async getActivo(active) {
    var checkbox = document.getElementById('active');
    checkbox.checked = false
    if (active == 1)
      checkbox.checked = true
  }

  static async updateMember() {
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
      if (!memberNumber) {
        request = await RequestPost.newMember(memberUpdate);
        await FamilyManager.createFamily(request.memberNumber)
      } else {
        request = await RequestPut.editMember(memberId, memberUpdate);
        await FamilyManager.updateFamily(memberNumber)
      }
      return request;

    } catch (error) {
      console.error("Error al actualizar el socio: ", error)
    }
  }

  static async inyectOption() {
    const memberId = document.getElementById('memberId').value
    const activitySel = document.getElementById("activity-select")
    activitySel.innerHTML = "";
    activitySel.innerHTML = `<option selected value="0">Lista de Actividades</option>`
    try {

      const activities = await RequestGet.getActivitys()
      activities.forEach((activity) => {

        activitySel.innerHTML += `<option value="${activity.id}">${activity.name}</option>`;

      });
    } catch (error) {
      console.error('Error:', error);
      activitySel.innerHTML = '<p>Error al cargar las actividades.</p>';
    }

    // Listening desplegable Option
    const select1 = document.getElementById('activity-select')
    let selectedURL = ''
    const handleChange1 = (event) => {
      const { value } = event.target
      ActivityMemberManager.createActivityMemberThis(value, memberId)
    }
    select1.addEventListener('change', handleChange1)
  }


}