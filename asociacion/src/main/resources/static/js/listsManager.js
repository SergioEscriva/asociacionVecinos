
//Obtener el parámetro activityId de la URL
  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get('id');

  const title = document.getElementById('txtTitleList');

  switch (id){
  case '1':
    title.textContent = 'Listado de Miembros Completo'
  break;
  case '2':
    title.textContent = 'Listado de Miembros Activos'
  break;
  case '3':
    title.textContent = 'Listado de Miembros Inactivos'
  break;

  }