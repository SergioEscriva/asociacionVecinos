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
        title.textContent = 'Listado de ' + memberAttribute.attribute + '(S) Completo'
        document.getElementById('listSocio').textContent = "Nº " + memberAttribute.attribute.toUpperCase()
        response = await RequestGet.getAllMembers()
        this.renderList(response)
        break;
      case 'button2':
        title.textContent = 'Listado de ' + memberAttribute.attribute + '(S) Activos'
        document.getElementById('listSocio').textContent = "Nº " + memberAttribute.attribute.toUpperCase()
        response = await RequestGet.getListMembersActives()
        this.renderList(response)
        break;
      case 'button3':
        title.textContent = 'Listado de ' + memberAttribute.attribute + '(S) Inactivos'
        document.getElementById('listSocio').textContent = "Nº " + memberAttribute.attribute.toUpperCase()
        response = await RequestGet.getListMembersInactives()
        this.renderList(response)
        break;
      case 'button4':
        response = await RequestGet.getActivitys()
        const responseCount = ListsManager.countActivities(response)
        document.getElementById('activitiesListMemberConfig').textContent = "Nº " + memberAttribute.attribute.toUpperCase() + "(S) REGISTRADAS"
        this.renderActivityList(responseCount)
        break;
      case 'button5':
        title.textContent = 'Listado de Impagos'

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

  async getLastPaidYear(memberid) {

    let response = await RequestGet.getLastFeeByMemberId(memberid);
    
    
    

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


