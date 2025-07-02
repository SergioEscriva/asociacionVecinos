document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('memberIdInput');
    const memberIdField = document.getElementById('memberId');
    const memberNumberField = document.getElementById('memberNumber');
    const familyMasterNumberField = document.getElementById('familyMasterNumber');
    const activeCheckbox = document.getElementById('active');

    let debounceTimer;

    input.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const searchTerm = this.value.trim();
            if (searchTerm.length > 0) {
                fetchMembers(searchTerm);
            } else {
                clearFields();
            }
        }, 300); // Espera 300ms después de que el usuario deje de escribir
    });

    function fetchMembers(searchTerm) {
        fetch(`/api/members/search?term=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    updateFields(data[0]); // Actualiza con el primer resultado
                } else {
                    clearFields();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                clearFields();
            });
    }

    function updateFields(member) {
        memberIdField.value = member.id || '';
        memberNumberField.value = member.memberNumber || '';
        familyMasterNumberField.value = member.familyMasterNumber || '';
        activeCheckbox.checked = member.active || false;
    }

    function clearFields() {
        memberIdField.value = '';
        memberNumberField.value = '';
        familyMasterNumberField.value = '';
        activeCheckbox.checked = false;
    }
});