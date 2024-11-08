window.onload = function() {
    getMemberById(1); 
  };

function getMemberById(memberId) {
    fetch(`api/members/${memberId}`) // Ajusta la URL según tu configuración
      .then(response => response.json())
      .then(member => {
        document.getElementById('memberNumber').value = member.memberNumber;
        document.getElementById('idFamily').value = member.idFamily;
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

        
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function getElementByIdSelected(){
    const memberId = document.getElementById('memberIdInput').value;
    getMemberById(memberId)
  }

  function getActivo(active){
      var checkbox = document.getElementById('active');
      checkbox.checked = false
    if (active == 1)
        checkbox.checked = true

  }