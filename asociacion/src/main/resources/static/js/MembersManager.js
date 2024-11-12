//import { RequestPut } from './RequestPut.js';
//import { RequestPost } from './RequestPost.js';

window.onload = function () {
  getMemberById(1);
};

function getFamilyById(memberId) {
  fetch(`api/family/member/${memberId}`)
    .then(response => response.json())
    .then(family => {

      let inputElement = document.getElementById("familyMemberId");
      inputElement.dataset.familyType = family.id; // se añade o cambia el valor al item
      inputElement.value = family.familyMemberId

      document.getElementById('familyMemberId').value = family.familyMemberId;

    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function getMemberById(memberId) {
  fetch(`api/members/${memberId}`)
    .then(response => response.json())
    .then(member => {
      document.getElementById('memberId').value = memberId;
      document.getElementById('memberNumber').value = member.memberNumber;
      getFamilyById(memberId)
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
      document.getElementById('active').value = getActivo(member.active);
      document.getElementById('notes').value = member.notes;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function getElementByIdSelected() {
  const memberId = document.getElementById('memberIdInput').value;
  getMemberById(memberId)
}

function getActivo(active) {
  var checkbox = document.getElementById('active');
  checkbox.checked = false
  if (active == 1)
    checkbox.checked = true
}

async function updateMember() {
  const memberId = document.getElementById('memberId').value
  const memberNumber = document.getElementById('memberNumber').value
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
    notes: notes
  }


  if (!memberId) {
    const request = await newMember(memberUpdate);
    await createFamily(request.id)
    return request;
  }
  else {
    const request = await editMember(memberId, memberUpdate);
    await updateFamily(memberId)
    return request;
  }
}

async function updateFamily(memberId) {

  let inputElement = document.getElementById("familyMemberId");
  const familyMemberId = inputElement.value
  let familyTypeId = inputElement.dataset.familyType;

  const familyUpdate = {
    familyMemberId: familyMemberId,
    idMember: memberId
  }
  await editFamily(familyTypeId, familyUpdate)
}

async function createFamily(memberId) {

  let familyMemberId = document.getElementById("familyMemberId").value;

  if (!familyMemberId) {
    familyMemberId = 0;
  }

  const familyUpdate = {
    familyMemberId: familyMemberId,
    idMember: memberId
  }
  await newFamily(familyUpdate)

}

async function oneFamilyCheck(memberId, familyMemberId) {
  if (!familyMemberId || memberId == familyMemberId) {
    familyMemberId = 0;
  }

  fetch(`api/family/check/${memberId}/${familyMemberId}`)
    .then(response => response.json())
    .then(family => {
      const familyMemberId = family.familyMemberId
      const idMember = family.idMember
    })

}




/// Debería estar en el archivo Request???.js pero da error al importarlo


async function editFamily(familyTypeId, familyUpdate) {

  try {
    const response = {
      method: "PUT",
      body: JSON.stringify(familyUpdate),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    // Devuelve la respuesta en formato JSON
    return await _putRequest(`/api/family/${familyTypeId}`, response);
  } catch (error) {
    console.error('Error en la solicitud PUT:', error);
    throw error;
  }
}

async function newFamily(familyUpdate) {
  try {
    const response = {
      method: "POST",
      body: JSON.stringify(familyUpdate),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    // Devuelve la respuesta en formato JSON
    return await _putRequest(`/api/family`, response);
  } catch (error) {
    console.error('Error en la solicitud PUT:', error);
    throw error;
  }
}






async function editMember(memberId, memberUpdate) {

  try {
    const response = {
      method: "PUT",
      body: JSON.stringify(memberUpdate),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    // Devuelve la respuesta en formato JSON
    alert("Cambios Guardados")
    return await _putRequest(`/api/members/${memberId}`, response);
  } catch (error) {
    console.error('Error en la solicitud PUT:', error);
    throw error;
  }
}


async function newMember(memberUpdate) {

  try {
    const response = {
      method: "POST",
      body: JSON.stringify(memberUpdate),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    // Devuelve la respuesta en formato JSON
    alert("Añadido")
    return await _postRequest(`/api/members`, response);
  } catch (error) {
    console.error('Error en la solicitud POST:', error);
    throw error;
  }
}





//REQUEST

async function _putRequest(url, data) {
  try {
    const response = await fetch(url, data);
    const jsonMessage = await response.json();
    return jsonMessage;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function _postRequest(url, data) {
  try {
    const response = await fetch(url, data);
    const jsonMessage = await response.json();
    return jsonMessage;
  } catch (error) {
    console.log(error);
    return null;
  }
}
