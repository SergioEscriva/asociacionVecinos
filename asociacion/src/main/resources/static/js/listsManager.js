import { RequestGet } from './RequestGet.js';


export class ListsManager {

  constructor() {

  }

  async init() {
    //Obtener el parámetro activityId de la URL
    //const urlParams = new URLSearchParams(window.location.search);
    // let id = urlParams.get('id');
    const memberAttribute = await RequestGet.getConfigById(3)
    const id = document.body.getAttribute('data-page-selection');

    const title = document.getElementById('txtTitleList');
    let response = "";
    switch (id) {
      case 'button1':
        title.textContent = 'Listado de ' + memberAttribute.attribute + '(s) Completo'
        document.getElementById('listSocio').textContent = "Nº " + memberAttribute.attribute.toUpperCase()
        response = await RequestGet.getAllMembers()
        this.renderList(response)
        break;
      case 'button2':
        title.textContent = 'Listado de ' + memberAttribute.attribute + '(s) Activos'
        document.getElementById('listSocio').textContent = "Nº " + memberAttribute.attribute.toUpperCase()
        response = await RequestGet.getListMembersActives()
        this.renderList(response)
        break;
      case 'button3':
        title.textContent = 'Histórico Inactivo/a(s)'
        document.getElementById('listSocio').textContent = "Nº " + memberAttribute.attribute.toUpperCase()
        document.getElementById('reason').textContent = "MOTIVO INACTIVIDAD"
        document.getElementById('date').textContent = "FECHA BAJA"
        //response = await RequestGet.getListMembersInactives()   Da todos los miembros inactivos
        response = await RequestGet.getResgistries()
        this.renderInactivesList(response)
        break;
      case 'button4':
        response = await RequestGet.getActivitys()
        const responseCount = ListsManager.countActivities(response)
        document.getElementById('activitiesListMemberConfig').textContent = memberAttribute.attribute.toUpperCase() + "(s) REGISTRADO/A(S)"
        this.renderActivityList(responseCount)
        break;
      case 'button5':
        title.textContent = 'Listado de Pagos'
        document.getElementById('listSocio').textContent = "Nº " + memberAttribute.attribute.toUpperCase()
        document.getElementById('year').textContent = "AÑO PAGADO"
        response = await RequestGet.getAllMembers()
        this.renderPayList(response)
        break;
      case 'button6':
        title.textContent = 'Listado de Impagos'
        document.getElementById('listSocio').textContent = "Nº " + memberAttribute.attribute.toUpperCase()
        document.getElementById('year').textContent = "ÚLTIMO AÑO PAGADO"
        response = await RequestGet.getAllMembers()
        this.renderUnpayList(response)
        break;

    }
  }

  async renderList(members) {
    let html = '';
    for (let member of members) {
      html += await this.getHtmlRowMembers(member);
    }

    let tbody = document.getElementById('tbody-member');
    tbody.innerHTML = html;
  }

  async getHtmlRowMembers(member) {

    const activeStatus = member.active ? '✓' : 'X';
    const lastPaidYear = await this.getLastPaidYear(member.id)

    return `<tr>
                <td>${member.name} </td>
                <td>${member.lastName1} ${member.lastName2} </td>
                <td>${member.memberNumber}</td>
                <td>${activeStatus}</td>
                <td>${lastPaidYear}</td>

            </tr>`;

  }

  async renderInactivesList(registries) {
    let html = '';
    for (let registry of registries) {
      html += await this.getHtmlInactivesRowMembers(registry);
    }

    let tbody = document.getElementById('tbody-member');
    tbody.innerHTML = html;
  }

  async getHtmlInactivesRowMembers(registry) {

    const member = await RequestGet.getMemberById(registry.memberId)

    const activeStatus = member.active ? '✓' : 'X';
    const lastPaidYear = await this.getLastPaidYear(member.id)
    const registro = await RequestGet.getRegistryById(registry.id);

    const startData = registro.startData
    const dateObj = new Date(startData)
    const dateOnly = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return `<tr>
                <td>${member.name} </td>
                <td>${member.lastName1} ${member.lastName2} </td>
                <td>${member.memberNumber}</td>
                <td>${activeStatus}</td>
                <td>${lastPaidYear}</td>
                <td>${registro.reasonEnd}</td>
                <td>${dateOnly}

            </tr>`;

  }

  async renderPayList(members) {
    let html = '';
    for (let member of members) {
      html += await this.getHtmlPayRowMembers(member);
    }

    let tbody = document.getElementById('tbody-member');
    tbody.innerHTML = html;
  }

  async getHtmlPayRowMembers(member) {

    const PaidYears = await this.getPaidYears(member.id)




    return `<tr>
                <td>${member.name} </td>
                <td>${member.lastName1} ${member.lastName2} </td>
                <td>${member.memberNumber}</td>
                <td>${PaidYears}</td>

            </tr>`;

  }

  async renderUnpayList(members) {
    let html = '';
    const currentYear = new Date().getFullYear();


    for (let member of members) {
      const PaidYears = await this.getPaidYears(member.id);
      const hasPaidThisYear = PaidYears.includes(currentYear);

      if (!hasPaidThisYear) {
        html += await this.getHtmlUnpayRowMembers(member);
      }

    }

    let tbody = document.getElementById('tbody-member');
    tbody.innerHTML = html;
  }

  async getHtmlUnpayRowMembers(member) {

    const lastPaidYear = await this.getLastPaidYear(member.id)

    return `<tr>
                <td>${member.name} </td>
                <td>${member.lastName1} ${member.lastName2} </td>
                <td>${member.memberNumber}</td>
                <td>${lastPaidYear}</td>

            </tr>`;

  }


  async getLastPaidYear(memberid) {

    let response = await RequestGet.getFeeByMemberId(memberid);




    if (Array.isArray(response) && response.length > 0) {

      const memberRecord = response.find(record => record.memberId === memberid);


      if (memberRecord && memberRecord.year) {
        return memberRecord.year;
      } else {
        return "-";
      }
    } else {
      return "-";
    }



  }

  async getPaidYears(memberid) {

    let response = await RequestGet.getFeeByMemberId(memberid);

    if (Array.isArray(response) && response.length > 0) {
      const memberRecords = response.filter(record => record.memberId === memberid);
      if (memberRecords.length > 0) {
        const years = memberRecords.map(record => record.year);
        return years;
      } else {
        return ["-"];
      }
    } else {
      return ["-"];
    }
  }


  renderActivityList(activities) {
    let html = '';

    Object.entries(activities).forEach(([activity, repetitions]) => {

      html += this.getHtmlRowActivities(activity, repetitions);
    });

    let tbody = document.getElementById('tbody-activity');
    tbody.innerHTML = html;
  }

  getHtmlRowActivities(activity, repetitions) {
    return `<tr>
                <td>${activity}</td>
                <td>${repetitions}</td>
            </tr>`;
  }

  static countActivities(activities) {

    const contador = {};

    activities.forEach(activity => {
      const name = activity.name;
      // Si la actividad ya existe en el contador, aumentamos el contador, si no, la inicializamos en 1
      contador[name] = (contador[name] || 0) + 1;
    });

    return contador;
  }

}


/* function onClickLogOut(){
     sessionStorage.token = null;
     window.location.href = 'login.html';
 }*/


