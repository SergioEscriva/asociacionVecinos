import { ActivityMemberManager } from './ActivityMemberManager.js';
import { FamilyManager } from './FamilyManager.js';
import { FeeManager } from './FeeManager.js';
import { RequestGet } from '../api/RequestGet.js';
import { RequestPost } from '../api/RequestPost.js';
import { RequestPut } from '../api/RequestPut.js';
import { Utility } from '../utils/Utility.js';
import { RequestFile } from '../api/RequestFile.js';

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
      window.location.hash = window.location.reload();
    };

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(redirectToInicio, inactiveTimeout);
    };

    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keypress', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);

    window.addEventListener('load', checkMembersPage);
    window.addEventListener('hashchange', checkMembersPage);
  }

  async init() {

    MembersManager.memberAttribute = await RequestGet.getConfigById(3);

    const backImage = await RequestGet.getConfigById(9);
    document.getElementById('backImage').src = backImage.attribute;

    // Recupera id del miembro desde Actividades
    const memberLink = document.querySelector('a[data-section="memberIndex"]')
    let memberIdByLink = memberLink.getAttribute('data-member-id');

    // Recupera id del miembro de la sesión
    let memberIdSession = sessionStorage.getItem('selectedMemberId');

    if (memberIdByLink) {
      let memberNumber = await RequestGet.getMemberById(memberIdByLink);
      MembersManager.getMemberByNumber(memberNumber.memberNumber);
    } if (!memberIdByLink && memberIdSession) {
      MembersManager.getMemberByNumber(memberIdSession);
    } else {
      MembersManager.getMemberByNumber(0);
    }


    document.getElementById("findMemberXS").addEventListener("click", function () { MembersManager.findMember("xs"); });
    document.getElementById("updateMember").addEventListener("click", function () { MembersManager.updateMember(); });
    document.getElementById("newMember").addEventListener("click", function () { MembersManager.newMember(); });

    const buttonFee = document.getElementById("updateFee");
    buttonFee.addEventListener("click", function () { MembersManager.updateFee(); });
    buttonFee.textContent = "Pagos";
    buttonFee.disabled = true;


    const buttonCard = document.getElementById("updateCard");
    buttonCard.addEventListener("click", function () { MembersManager.updateCardClick(); });
    buttonCard.textContent = "Imprimir";
    buttonCard.disabled = true;

    const inputFind = document.getElementById('input-find');
    const clearButton = document.getElementById('clear-button');

    clearButton.addEventListener('click', () => {
      inputFind.value = ''; // Borra el texto del input
      inputFind.focus(); // Devuelve el foco al input (opcional)
    });
    
    const postalInput = document.getElementById('postal');
    const locationInput = document.getElementById('location');

    // Cuando el usuario cambia el código postal, busca la población
    postalInput.addEventListener('change', async function () {
        const postalCode = postalInput.value.trim();
        if (postalCode.length > 0) {
            await MembersManager.buscarPoblacionPorCodigoPostal(postalCode);
        }
    });

    // Cuando el usuario cambia la localidad, busca el código postal
    locationInput.addEventListener('change', async function () {
        const location = locationInput.value.trim();
        if (location.length > 0) {
            await MembersManager.buscarCodigoPostal(location);
        }
    });
  }

  static async limpiaCampos() {
    await this.limpiaCamposActividad();
    const campos = [
        'memberId', 'memberNumber', 'familyMasterNumber', 'name', 'lastName1', 'lastName2',
        'address', 'addressNumber', 'addressDoor', 'addressStaircase', 'location', 'postal',
        'phone', 'email', 'dni', 'gender', 'activeDate', 'notes'
    ];
    campos.forEach(id => this.setInputValue(id, ""));
    document.getElementById('active').checked = false;
    this.updateCard(1);
  }

  static async newMember() {
    MembersManager.getMemberByNumber(0);
  }

  static async limpiaCamposActividad() {
    const activitySel = document.getElementById("ul-activity-member");
    activitySel.innerHTML = "";
  }

  static async getMemberByNumber(memberNumber) {
    await this.limpiaCampos()

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
      document.getElementById('postal').value = member.postal;

      
      const location = member.location ? String(member.location).trim() : "";
      const postal = member.postal ? String(member.postal).trim() : "";

      if (location && !postal) {
          await MembersManager.buscarCodigoPostal(location);
      } else if (!location && postal) {
          await MembersManager.buscarPoblacionPorCodigoPostal(postal);
      }

      document.getElementById('phone').value = member.phone;
      document.getElementById('email').value = member.email;
      document.getElementById('dni').value = member.dni;
      document.getElementById('gender').value = member.gender;

      const activeCheckbox = document.getElementById('active')
      this.checkActive(activeCheckbox, member)

      const activeDate = document.getElementById('activeDate');
      this.getFirstActiveDate(member.id)

      const buttonCard = document.getElementById("updateCard")
      buttonCard.title = await MembersManager.updateCard(member.cardPrint);
      buttonCard.title = "Pulsa para imprimir";
      buttonCard.disabled = false;

      document.getElementById('notes').value = member.notes;
      FeeManager.checkFee()
      const buttonFee = document.getElementById("updateFee")
      buttonFee.title = await MembersManager.updateFeeTitle(member.id);
      buttonFee.disabled = false;

      await ActivityMemberManager.inyectOption()
      await ActivityMemberManager.getActivitiesByMemberId(member.id)
      sessionStorage.setItem('selectedMemberId', '0');
      //MembersManager.codigoPostalLocalidad();
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
    if ((inActive && hasPaidRecently) || (inActive && hasPaidCurrentYear)) {
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
      const postal = document.getElementById('postal').value
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
        postal: postal,
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

static async buscarPoblacionPorCodigoPostal(postalCode) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postalCode)}&country=España&format=json&addressdetails=1`
        );
        const data = await response.json();

        // Orden de preferencia de campos menos poblados a más poblados
        const campos = ['village', 'town', 'hamlet', 'municipality', 'city', 'county'];
        let poblacion = "";
        for (const campo of campos) {
            for (const item of data) {
                if (item.address && item.address[campo]) {
                    poblacion = item.address[campo];
                    break;
                }
            }
            if (poblacion) break;
        }

        document.getElementById('location').value = poblacion || "";

    } catch (error) {
        document.getElementById('location').value = "";
        console.error("Error buscando población por código postal:", error);
    }
}


static async buscarCodigoPostal(location) {

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(location)}&country=España&format=json&addressdetails=1`);
        const data = await response.json();
        if (data.length > 0 && data[0].address && data[0].address.postcode) {
            document.getElementById('postal').value = data[0].address.postcode;
        } 
    } catch (error) {
        document.getElementById('postal').value = "";
        console.error("Error buscando código postal:", error);
    }
}

static async codigoPostalLocalidad() {
    let locationInput = document.getElementById('location');
    let postalInput = document.getElementById('postal');
    const postalCode = postalInput.value.trim();
    const location = locationInput.value.trim();

    // Solo busca población si el usuario cambia el código postal manualmente
    if (postalInput && postalCode.length > 0) {
        await MembersManager.buscarPoblacionPorCodigoPostal(postalCode);
    }

    // Solo busca código postal si el usuario cambia la localidad manualmente
    if (locationInput && location.length > 0) {
        await MembersManager.buscarCodigoPostal(location);
    }
}

static async getFirstActiveDate(memberId) {
    try {
      const registrys = await RequestGet.getRegistryByMemberId(memberId);
      if (registrys.length > 0) {
        const firstActive = registrys[0].startData;
        const activeDateInput = document.getElementById('activeDate');
        activeDateInput.value = firstActive ? new Date(firstActive).toLocaleDateString() : "";
      } else {
        document.getElementById('activeDate').value = "";
      }
    } catch (error) {
      console.error("Error al obtener la primera fecha activa:", error);
    }           
} 
static getInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
}

static setInputValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

static validarCamposObligatorios(campos) {
    for (const campo of campos) {
        if (!this.getInputValue(campo)) {
            alert(`Obligatorio rellenar el campo: ${campo}`);
            return false;
        }
    }
    return true;
}

static addListeners() {
    document.getElementById("findMemberXS").addEventListener("click", () => this.findMember("xs"));
    document.getElementById("updateMember").addEventListener("click", () => this.updateMember());
    document.getElementById("newMember").addEventListener("click", () => this.newMember());
    document.getElementById("updateFee").addEventListener("click", () => this.updateFee());
    document.getElementById("updateCard").addEventListener("click", () => this.updateCardClick());
    document.getElementById('clear-button').addEventListener('click', () => {
        this.setInputValue('input-find', '');
        document.getElementById('input-find').focus();
    });
    document.getElementById('postal').addEventListener('change', async () => {
        const postalCode = this.getInputValue('postal').trim();
        if (postalCode.length > 0) await this.buscarPoblacionPorCodigoPostal(postalCode);
    });
    document.getElementById('location').addEventListener('change', async () => {
        const location = this.getInputValue('location').trim();
        if (location.length > 0) await this.buscarCodigoPostal(location);
    });
}
}
