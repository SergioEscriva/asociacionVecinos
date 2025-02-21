import { ActivityMemberManager } from './ActivityMemberManager.js';
import { FamilyManager } from './FamilyManager.js';
import { RegistryManager } from './RegistryManager.js';
import { FeeManager } from './FeeManager.js';
import { RequestGet } from './RequestGet.js';
import { RequestPost } from './RequestPost.js';
import { RequestPut } from './RequestPut.js';

export class MembersManager {
  constructor() {
    this.scheduleBackupConsolidation();
  }

  scheduleBackupConsolidation() {
    const now = new Date();
    const night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // mañana
      23, 59, 0 // 23:59:00
    );
    const msUntilMidnight = night.getTime() - now.getTime();

    setTimeout(() => {
      BackupManager.consolidateBackups();
      // Programar la próxima consolidación
      this.scheduleBackupConsolidation();
    }, msUntilMidnight);
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


    if (!memberNumber) {
      MembersManager.getMemberByNumber(10002); //TODO solo para pruebas, debe ser 0
    }


    document.getElementById("findMemberXS").addEventListener("click", function () { MembersManager.findMember("xs"); });
    document.getElementById("updateMember").addEventListener("click", function () { MembersManager.updateMember(); });
    document.getElementById("newMember").addEventListener("click", function () { MembersManager.newMember(); });


    const buttonFee = document.getElementById("updateFee")
    buttonFee.addEventListener("click", function () { MembersManager.updateFee(); });
    buttonFee.textContent = "¿Deudas?"

    const buttonCard = document.getElementById("updateCard")
    buttonCard.addEventListener("click", function () { MembersManager.updateCardClick(); });
    buttonCard.textContent = "Impreso"
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
    await this.limpiaCamposActividad();
  }

  static async newMember() {
    MembersManager.getMemberByNumber(0);
  }

  static async limpiaCamposActividad() {
    const activitySel = document.getElementById("ul-activity-member");
    //const oldListener = activitySel.onclick;
    //activitySel.removeEventListener('input', oldListener);
    activitySel.innerHTML = "";
  }

  static async getMemberByNumber(memberNumber) {
    await this.limpiaCampos()
    MembersManager.inyectOption()
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
      this.checkActive(activeCheckbox, member)


      document.getElementById('notes').value = member.notes;
      FeeManager.checkFee()
      const buttonFee = document.getElementById("updateFee")
      buttonFee.title = await MembersManager.updateFeeTitle(member.id)

      const buttonCard = document.getElementById("updateCard")
      buttonCard.title = await MembersManager.updateCard(member.cardPrint)

      await ActivityMemberManager.getActivitiesByMemberId(member.id)


    }
  }

  static async checkActive(element, member) {
    const registrys = await RequestGet.getRegistryByMemberId(member.id)
    const inActive = registrys.some(item => item.endData === null)
    const feesMember = await RequestGet.getFeeByMemberId(member.id)
    const actualYear = new Date().getFullYear()
    const configYearsForInactive = await RequestGet.getConfigById(4)
    const yearsForInactive = actualYear - configYearsForInactive.attribute;
    const existActualFee = feesMember.some(item => item.year >= yearsForInactive);

    element.checked = false
    if (inActive & existActualFee) {
      element.checked = true
    }
    element.dataset.memberbyId = member.id
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
    const name = document.getElementById('name').value
    const dni = document.getElementById('dni').value

    if (!name) {
      alert("Obligatorio un nombre")
    }

    if (!dni) {
      alert("Obligatorio un dni válido")
    } else {
      const resultado = MembersManager.validarDNI(dni);
      if (!resultado) {
        alert("Error, DNI NO válido")
      } else {
        MembersManager.updateMemberNameDniOk()
      }
    }
  }

  static async updateMemberNameDniOk() {
    try {
      const memberId = document.getElementById('memberId').value
      let memberNumber = document.getElementById('memberNumber').value
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

      var printed = 0
      const buttonCard = document.getElementById('updateCard')
      const buttonContent = buttonCard.textContent
      if (buttonContent == "Impreso") {
        printed = 1
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
        cardPrint: printed,
        notes: notes
      }

      let request;
      if (!memberId) {
        const resultado = MembersManager.validarDNIYBaseDeDatos(dni);
        if (!resultado.valido) {
          alert("Error, " + resultado.mensaje)
          return
        } else {
          request = await RequestPost.newMember(memberUpdate);
          memberNumber = request.memberNumber
          const newMemberId = request.id
          await FamilyManager.createFamily(memberNumber)
          await RegistryManager.activeMemberStart(newMemberId)
        }
      } else {
        request = await RequestPut.editMember(memberId, memberUpdate);
        await FamilyManager.updateFamily(memberNumber)
      }
      MembersManager.getMemberByNumber(memberNumber);
      return request;

    } catch (error) {
      console.error("Error al actualizar el socio: ", error)
    }
  }

  static async inyectOption() {

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


  }

  static async updateFee() {
    await FeeManager.paidFee()
  }

  static async updateFeeTitle(memberId) {
    const listFees = await FeeManager.paidFeeList(memberId)
    let text = "Pagados años: ";
    for (let x in listFees) {
      text += " - " + listFees[x].year;
    }
    return text
  }

  static async updateCard(cardPrint) {

    const buttonCard = document.getElementById('updateCard')
    if (cardPrint) {
      buttonCard.classList = 'buttonCard button-green'
      buttonCard.textContent = "Impreso"

    } else {
      buttonCard.classList = 'buttonCard button-red'
      buttonCard.textContent = "No Impreso"

    }
  }


  static async updateCardClick() {
    let memberNumber = document.getElementById('memberNumber').value
    await RequestGet.getPrintCard(memberNumber)
    const buttonCard = document.getElementById("updateCard")
    buttonCard.classList = 'buttonCard button-green'
    buttonCard.textContent = "Impreso"
    MembersManager.updateMember()
    alert("Carnet N.º " + memberNumber + ", guardado en el escritorio en pdf para imprimir.")
  }

  static validarDNIYBaseDeDatos(dni) {
    if (!MembersManager.validarDNI(dni)) {
      return { valido: false, mensaje: "DNI no válido" };
    }

    try {

      const dniExiste = RequestGet.getMemberByDni(dni)

      if (dniExiste) {
        return { valido: false, mensaje: "El DNI ya existe en la base de datos" };
      }

      return { valido: true, mensaje: "DNI válido" };
    } catch (error) {
      console.error("Error al validar DNI:", error);
      return { valido: false, mensaje: "Error al validar DNI" };
    }
  }

  static validarDNI(dni) {
    if (!dni || dni.length !== 9) {
      return false;
    }

    const numero = parseInt(dni.substring(0, 8));
    const letra = dni.charAt(8).toUpperCase();
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";

    if (isNaN(numero) || letras.charAt(numero % 23) !== letra) {
      return false;
    }

    return true;
  }


}


