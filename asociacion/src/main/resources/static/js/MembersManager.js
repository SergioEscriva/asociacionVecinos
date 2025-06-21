import { ActivityMemberManager } from './ActivityMemberManager.js';
import { FamilyManager } from './FamilyManager.js';
import { RegistryManager } from './RegistryManager.js';
import { FeeManager } from './FeeManager.js';
import { RequestGet } from './RequestGet.js';
import { RequestPost } from './RequestPost.js';
import { RequestPut } from './RequestPut.js';
import { Utility } from './Utility.js';
import { RequestFile } from './RequestFile.js';

export class MembersManager {
  constructor() {
    this.scheduleInactiveRedirect();
  }

  scheduleInactiveRedirect() {
    const inactiveTimeout = 180000; //180000 3 minutos en milisegundos
    let inactivityTimer;
    let isMembersPage = false;

    const checkMembersPage = () => {
      isMembersPage = window.location.hash.includes('memberIndex');
      if (isMembersPage) {
        resetInactivityTimer();
      } else {
        clearTimeout(inactivityTimer);
      }
    };

    const redirectToInicio = () => {
      console.log('Redirigiendo a inicio por inactividad en la página de miembros.');
      window.location.hash = window.location.reload();
    };

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(redirectToInicio, inactiveTimeout);
    };

    // Escuchar eventos que indican actividad
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keypress', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);

    // Comprobar la página al cargar y en cambios de hash (para SPAs)
    window.addEventListener('load', checkMembersPage);
    window.addEventListener('hashchange', checkMembersPage);
  }

  async init() {
    // Variables Config
    MembersManager.memberAttribute = await RequestGet.getConfigById(3);
    let memberNumber = null;

    const backImage = await RequestGet.getConfigById(9);
    document.getElementById('backImage').src = backImage.attribute;

    const memberLink = document.querySelector('a[data-section="memberIndex"]');
    const memberIdByLink = memberLink.getAttribute('data-member-id');

    if (memberIdByLink) {
      memberNumber = await RequestGet.getMemberById(memberIdByLink);
      MembersManager.getMemberByNumber(memberNumber.memberNumber);
    }

    if (!memberNumber) {
      MembersManager.getMemberByNumber(0);
    }

    document.getElementById("findMemberXS").addEventListener("click", function () { MembersManager.findMember("xs"); });
    document.getElementById("updateMember").addEventListener("click", function () { MembersManager.updateMember(); });
    document.getElementById("newMember").addEventListener("click", function () { MembersManager.newMember(); });

    const buttonFee = document.getElementById("updateFee");
    buttonFee.addEventListener("click", function () { MembersManager.updateFee(); });
    buttonFee.textContent = "¿Deudas?";

    const buttonCard = document.getElementById("updateCard");
    buttonCard.addEventListener("click", function () { MembersManager.updateCardClick(); });
    buttonCard.textContent = "Impreso";

    const inputFind = document.getElementById('input-find');
    const clearButton = document.getElementById('clear-button');

    clearButton.addEventListener('click', () => {
      inputFind.value = ''; // Borra el texto del input
      inputFind.focus(); // Devuelve el foco al input (opcional)
    });
  }

  static async limpiaCampos() {
    document.getElementById('memberId').value = "";
    document.getElementById('memberNumber').value = "";
    document.getElementById("familyMasterNumber").value = "0";
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
    document.getElementById('active').checked = false;
    document.getElementById('notes').value = "";
    document.getElementById("memberNumber").value = "";
    this.updateCard(1);
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



      const buttonCard = document.getElementById("updateCard")
      buttonCard.title = await MembersManager.updateCard(member.cardPrint)

      document.getElementById('notes').value = member.notes;
      FeeManager.checkFee()
      const buttonFee = document.getElementById("updateFee")
      buttonFee.title = await MembersManager.updateFeeTitle(member.id)


      await ActivityMemberManager.getActivitiesByMemberId(member.id)


    }
  }

  static async checkActive(element, member) {
    const registrys = await RequestGet.getRegistryByMemberId(member.id);
    const inActive = registrys.some(item => item.endData === null);

    const feesMember = await RequestGet.getFeeByMemberId(member.id);
    const actualYear = new Date().getFullYear();
    const configYearsForInactive = await RequestGet.getConfigById(4);

    const yearsForInactive = actualYear - configYearsForInactive.attribute;

    const hasPaidRecently = feesMember.some(item => parseInt(item.year) >= yearsForInactive);

    const hasPaidCurrentYear = feesMember.some(item => parseInt(item.year) === actualYear);


    element.checked = false;
    if ((inActive && hasPaidRecently) || hasPaidCurrentYear) {
      element.checked = true;
    }

    element.dataset.memberbyId = member.id;
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
        const letra = MembersManager.letraDNI(dni);
        alert("Error, DNI no válido, se espera la letra: " + letra);
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

      /// Se cambia 0 para impreso y 1 para no impreso para poder importar base de datos de acces
      var printed = 1
      const buttonCard = document.getElementById('updateCard')
      const buttonContent = buttonCard.textContent
      if (buttonContent == "Impreso") {
        printed = 0
      }

      const numeroDni = dni.substring(0, 8);
      const letraEnMayuscula = dni.charAt(8).toUpperCase();
      const dniUp = numeroDni + letraEnMayuscula;

      const memberUpdate = {

        memberNumber: memberNumber,
        name: await Utility.capitalizarString(name),
        lastName1: await Utility.capitalizarString(lastName1),
        lastName2: await Utility.capitalizarString(lastName2),
        address: await Utility.capitalizarString(address),
        addressNumber: addressNumber,
        addressDoor: await Utility.capitalizarString(addressDoor),
        addressStaircase: addressStaircase,
        location: await Utility.capitalizarString(location),
        phone: phone,
        email: email,
        dni: dniUp,
        gender: await Utility.capitalizarString(gender),
        active: activate,
        cardPrint: printed,
        notes: notes
      }

      let request;
      if (!memberId) {
        const resultado = await MembersManager.validarDNIYBaseDeDatos(dni);
        if (!resultado.valido) {
          alert("Error 285, " + resultado.mensaje)
          return
        } else {
          request = await RequestPost.newMember(memberUpdate);
          memberNumber = request.memberNumber
          const newMemberId = request.id
          //await FamilyManager.createFamily(memberNumber) 
          //await RegistryManager.activeMemberStart(newMemberId)  Por el momento no marcará activo al member por añadirlo, se prefiere manual.
        }
      } else {
        request = await RequestPut.editMember(memberId, memberUpdate);
        //await FamilyManager.updateFamily(memberNumber)
      }
      MembersManager.getMemberByNumber(memberNumber);
      return request;

    } catch (error) {
      console.error("Error al actualizar el socio: ", error)
    }
  }

  static async inyectOption() {

    const currentYear = new Date().getFullYear();
    const activitySel = document.getElementById("activity-select")
    activitySel.innerHTML = "";
    activitySel.innerHTML = `<option selected value="0">Lista de Actividades</option>`
    try {
      const activities = await RequestGet.getActivitys(currentYear)

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
      buttonCard.classList = 'buttonCard button-red'
      buttonCard.textContent = "No Impreso"
    } else {
      buttonCard.classList = 'buttonCard button-green'
      buttonCard.textContent = "Impreso"

    }
  }


  static async updateCardClick() {
    let memberNumber = document.getElementById('memberNumber').value
    //await RequestGet.getPrintCard(memberNumber) //No con docker
    await this.downloadCarnet(memberNumber)
    const buttonCard = document.getElementById("updateCard")
    buttonCard.classList = 'buttonCard button-green'
    buttonCard.textContent = "Impreso"
    MembersManager.updateMember()
    alert("Carnet N.º " + memberNumber + ", será guardado en pdf para imprimir.")
  }

  static async downloadCarnet(memberId) {
    RequestFile.downloadPdf(`/api/pdf/card/${memberId}`, `carnet_${memberId}.pdf`);
  }



  static async validarDNIYBaseDeDatos(dni) {

    if (!MembersManager.validarDNI(dni)) {
      const letra = MembersManager.letraDNI(dni)
      return { valido: false, mensaje: "DNI no válido" };
    }

    try {

      const dniExiste = await RequestGet.getMemberByDni(dni)

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
    const letraValida = MembersManager.letraDNI(dni)

    if (isNaN(numero) || letraValida !== letra) {
      return false;
    }

    return true;
  }

  static letraDNI(dni) {
    const numero = parseInt(dni.substring(0, 8));
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const letraValida = letras.charAt(numero % 23);

    return letraValida;

  }


}


