import { ActivityMemberManager } from './ActivityMemberManager.js';
import { FamilyManager } from './FamilyManager.js';
import { FeeManager } from './FeeManager.js';
import { RequestGet } from './RequestGet.js';
import { RequestPost } from './RequestPost.js';
import { RequestPut } from './RequestPut.js';

export class MembersManager {
  constructor() {
  }

  async init() {

    // Variables Config
    MembersManager.memberAttribute = await RequestGet.getConfigById(3)
    let memberNumber = null

    // Cuando se redirecciona memberIndex desde activityIndex
    const memberLink = document.querySelector('a[data-section="memberIndex"]');
    const memberIdByLink = memberLink.getAttribute('data-member-id');

    if (memberIdByLink) {
      memberNumber = await RequestGet.getMemberById(memberIdByLink)
      MembersManager.getMemberByNumber(memberNumber.memberNumber);
    }

    //TODO para pruebas
    if (!memberNumber) {
      MembersManager.getMemberByNumber(10002);
    }


    document.getElementById("findMemberXS").addEventListener("click", function () { MembersManager.findMember("xs"); });
    document.getElementById("updateMember").addEventListener("click", function () { MembersManager.updateMember(); });
    document.getElementById("newMember").addEventListener("click", function () { MembersManager.newMember(); });

    const buttonFee = document.getElementById("updateFee")
    buttonFee.addEventListener("click", function () { MembersManager.updateFee(); });
    buttonFee.textContent = "¿Deudas?"

    const inputFind = document.getElementById('input-find');
    const suggestionsList = document.getElementById('suggestions');

    inputFind.addEventListener('input', () => {
      const query = inputFind.value;

      if (query.length > 0) {
        fetch(`/api/members/search-member?query=${query}`)
          .then(response => response.json())
          .then(data => {
            suggestionsList.innerHTML = '';
            if (data.length > 0) {
              data.forEach(member => {
                const suggestionItem = document.createElement('li');
                suggestionItem.textContent = `${member.name} ${member.lastName1} ${member.lastName2} (${member.memberNumber})`;
                suggestionItem.addEventListener('click', () => {
                  inputFind.value = `${member.name} ${member.lastName1} ${member.lastName2} (${member.memberNumber})`;
                  suggestionsList.innerHTML = '';
                  MembersManager.getMemberByNumber(member.memberNumber);
                });
                suggestionsList.appendChild(suggestionItem);
                MembersManager.getMemberByNumber(member.memberNumber);
              });
            }
          })
          .catch(error => console.error('Error fetching member data:', error));
      } else {
        suggestionsList.innerHTML = '';
      }
    });

    document.addEventListener('click', (event) => {
      if (!suggestionsList.contains(event.target) && event.target !== inputFind) {
        suggestionsList.innerHTML = '';
      }
    });


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
    this.limpiaCamposActividad();
  }

  static async newMember() {
    MembersManager.getMemberByNumber(0);
  }

  static async limpiaCamposActividad() {
    const activitySel = document.getElementById("ul-activity-member");
    const oldListener = activitySel.onclick;
    activitySel.removeEventListener('click', oldListener);
    activitySel.innerHTML = "";
  }

  static async getMemberByNumber(memberNumber) {
    await this.limpiaCampos()

    // Variables config
    document.getElementById('labelMemberNumber').textContent = "N.º " + MembersManager.memberAttribute.attribute;
    document.getElementById('titleMemberPage').textContent = "Ficha " + MembersManager.memberAttribute.attribute;

    const member = await RequestGet.getMemberByMemberNumber(memberNumber)
    if (member <= 0) {
      return
    } else if (!member) {
      alert("El " + MembersManager.memberAttribute.attribute + " " + memberNumber + " no existe")
      return
    } else {
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
      const activeCheckbox = document.getElementById('active')
      activeCheckbox.checked = member.active === true

      document.getElementById('notes').value = member.notes;
      FeeManager.checkFee()
      this.inyectOption()
      await ActivityMemberManager.getActivitiesByMemberId(member.id)
    }
  }


  static async findMember(screen) {
    const memberNumber = document.getElementById('input-find').value;
    const memberNumberXS = document.getElementById('input-find-XS').value;
    if (screen === "xs") {
      this.getMemberByNumber(memberNumberXS)
      return
    }

    this.getMemberByNumber(memberNumber)

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
      if (!memberId) {
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

  static async updateFee() {
    await FeeManager.paidFee()
  }
}

