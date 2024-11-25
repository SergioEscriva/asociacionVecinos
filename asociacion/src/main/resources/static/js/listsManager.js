import { RequestGet } from './RequestGet.js';

export class ListsManager {

  constructor() {

  }

  async init() {
    //Obtener el parámetro activityId de la URL
    //const urlParams = new URLSearchParams(window.location.search);
    // let id = urlParams.get('id');

    const id = document.body.getAttribute('data-page-selection');

    const title = document.getElementById('txtTitleList');
    let response = "";
    switch (id) {
      case 'button1':
        title.textContent = 'Listado de Miembros Completo'
        response = await RequestGet.getAllMembers()
        this.renderList(response)
        break;
      case 'button2':
        title.textContent = 'Listado de Miembros Activos'
        response = await RequestGet.getListMembersActives()
        this.renderList(response)
        break;
      case 'button3':
        title.textContent = 'Listado de Miembros Inactivos'
        response = await RequestGet.getListMembersInactives()
        this.renderList(response)
        break;
      case 'button4':
        response = await RequestGet.getActivitys()
        const responseCount = ListsManager.countActivities(response)
        this.renderActivityList(responseCount)
        break;
    }
  }

  async renderList(members) {
    let html = '';
    for (let member of members) {
      html += this.getHtmlRowMembers(member);
    }

    let tbody = document.getElementById('tbody-member');
    tbody.innerHTML = html;
  }

  getHtmlRowMembers(member) {

    const activeStatus = member.active ? '✓' : 'X';

    return `<tr>
                <td>${member.name} </td>
                <td>${member.lastName1} ${member.lastName2} </td>
                <td>${member.memberNumber}</td>
                <td>${activeStatus}</td>

            </tr>`;

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


