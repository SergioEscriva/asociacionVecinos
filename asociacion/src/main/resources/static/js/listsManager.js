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

/* function onClickLogOut(){
     sessionStorage.token = null;
     window.location.href = 'login.html';
 }*/


