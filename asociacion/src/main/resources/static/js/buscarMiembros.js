window.onload = function() {
    getMemberById(1); // Replace 123 with the desired member ID
  };

function getMemberById(memberId) {
    fetch(`api/members/${memberId}`) // Ajusta la URL según tu configuración
      .then(response => response.json())
      .then(member => {
        document.getElementById('memberNumber').value = member.memberNumber;
        document.getElementById('IdFamily').value = member.IdFamily;
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
        document.getElementById('active').value = member.active;
        
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
