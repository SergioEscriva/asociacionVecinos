import { RequestGet } from './RequestGet.js';

//Obtener el parámetro activityId de la URL
  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get('id');

  const title = document.getElementById('txtTitleList');
  let url = '/api/members';
  switch (id){
  case '1':
    title.textContent = 'Listado de Miembros Completo'
    renderList(url)
  break;
  case '2':
    title.textContent = 'Listado de Miembros Activos'
    url = '/api/members/actives';
    renderList(url)
  break;
  case '3':
    title.textContent = 'Listado de Miembros Inactivos'
    url = '/api/members/inactives';
    renderList(url)
  break;

  }



 async function getList(url){




    let config = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json'/*,
            'Authorization' : sessionStorage.token*/
        }
    }


    let response = await fetch(url, config);
    let json =  await response.json();

    return(json);


}

 async function renderList(url){
    let members = await getList(url);
    let html = '';
    for (let member of members){
        html += getHtmlRowMembers(member);
    }

    let tbody = document.getElementById('tbody-member');
    tbody.innerHTML = html;
}

function getHtmlRowMembers(member){
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


