import { RequestGet } from './RequestGet.js';


window.onload = async function () {
  //Obtener el parámetro activityId de la URL
  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get('id');

  const title = document.getElementById('txtTitleList');
  let response = "";
  switch (id) {
    case '1':
      title.textContent = 'Listado de Miembros Completo'
      response = await RequestGet.getAllMembers()
      renderList(response)
      break;
    case '2':
      title.textContent = 'Listado de Miembros Activos'
      response = await RequestGet.getListMembersActives()
      renderList(response)
      break;
    case '3':
      title.textContent = 'Listado de Miembros Inactivos'
      response = await RequestGet.getListMembersInactives()
      renderList(response)
      break;
    case '4':
       response = await RequestGet.getActivitys()
       renderActivityList(countActivities(response))
    break;

  }
}

async function renderList(members) {
  let html = '';
  for (let member of members) {
    html += getHtmlRowMembers(member);
  }

  let tbody = document.getElementById('tbody-member');
  tbody.innerHTML = html;
}

function getHtmlRowMembers(member) {
  return `<tr>
                <td>${member.name} </td>
                <td>${member.lastName1} ${member.lastName2} </td>
                <td>${member.memberNumber}</td>
                <td>${member.active}</td>

            </tr>`;

}

function renderActivityList(activities) {
    let html = '';

    Object.entries(activities).forEach(([activity, repetitions]) => {

        html += getHtmlRowActivities(activity, repetitions);
    });

    let tbody = document.getElementById('tbody-activity');
    tbody.innerHTML = html;
}

function getHtmlRowActivities(activity, repetitions) {
    return `<tr>
                <td>${activity}</td>
                <td>${repetitions}</td>
            </tr>`;
}

function countActivities(activities) {
    const contador = {};

    activities.forEach(activity => {
        const name = activity.name;
        // Si la actividad ya existe en el contador, aumentamos el contador, si no, la inicializamos en 1
        contador[name] = (contador[name] || 0) + 1;
    });

    return contador;
}




/* function onClickLogOut(){
     sessionStorage.token = null;
     window.location.href = 'login.html';
 }*/


