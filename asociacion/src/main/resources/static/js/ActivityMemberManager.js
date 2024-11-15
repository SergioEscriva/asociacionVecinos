import { RequestPost } from './RequestPost.js';
import { RequestPut } from './RequestPut.js';
import { RequestDel } from './RequestDel.js';

export class ActivityMemberManager {


    static async getActivityById(id) {
        fetch(`api/activitymember/activity/${id}`)
        /*
            .then(response => response.json())
            .then(family => {
                let inputElement = document.getElementById("familyMasterNumber");
                inputElement.dataset.familyType = family.id; // se añade o cambia el valor al item
                //inputElement.value = family.id
            })
            .catch(error => {
                console.error('Error:', error);
            });
            */
    }

    static async getActivitiesByMemberId(memberId) {
        const activitySel = document.getElementById("ul-activity-member");
        activitySel.innerHTML = "";

        try {
            const response = await fetch(`api/activitymember/member/${memberId}`);
            const activities = await response.json();
            activities.forEach((activity) => {
                activitySel.innerHTML += `
                    <li id="li-activitys-member-${activity.idLong}" data-activity-id="${activity.activityId}">
                        <button class="delete-button" id="li-button-${activity.activityId}"><i class="fas fa-trash"></i></button>
                        <label class="text-activity" for="option${activity.activityId}" id="li-label-${activity.activityId}">${activity.activityName}</label>
                    </li>`;
            });
        } catch (error) {
            console.error('Error:', error);
            activitySel.innerHTML = '<p>Error al cargar las actividades.</p>';
        }
    }

    static async getActivitiesByMemberId1(memberId) {

        const activitySel = document.getElementById("ul-activity-member");

        activitySel.innerHTML = "";

        fetch(`api/activitymember/member/${memberId}`)
            .then(response => response.json())
            .then(activities => {
                activities.forEach((activity) => {
                    activitySel.innerHTML += `
                        <li id="li-activitys-member-${activity.idLong}">
                            <button class="delete-button" id="li-button-${activity.activityId}"><i class="fas fa-trash"></i></button>
                            <label class="text-activity" for="option${activity.activityId}" id="li-label-${activity.activityId}">${activity.activityName}</label>
                        </li>`;
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });


        activitySel.addEventListener('click', (event) => {
            // limpiar eventos
            event.stopPropagation();
            event.preventDefault();

            if (event.target.tagName === 'BUTTON' || event.target.tagName === 'I') {
                console.log("li")
                let li;
                if (event.target.tagName === 'BUTTON') {
                    li = event.target.parentNode;
                } else {
                    li = event.target.parentNode.parentNode;
                }

                if (!li) {
                    console.error("Elemento 'li' no encontrado.");
                    return;
                }

                const activityId = this.extraerUltimoNumero(li.id);

                ActivityMemberManager.delMemberOfActivity(memberId, activityId, li);

            } else if (event.target.tagName === 'LABEL') {
                let li = event.target.parentNode;
                const activityId = this.extraerUltimoNumero(li.id);

                alert("Redirigirá a Actividades");

                return;
            } else {
                console.warn("Elemento no manejado: ", event.target.tagName);

            }
        });
    }


    static async updateFamily(memberNumber) {

        let inputElement = document.getElementById("familyMasterNumber");
        const familyMasterNumber = inputElement.value
        let familyTypeId = inputElement.dataset.familyType;

        const familyUpdate = {
            familyMasterNumber: familyMasterNumber,
            memberNumber: memberNumber
        }
        await RequestPut.editFamily(familyTypeId, familyUpdate)
    }

    async createFamily(memberNumber) {

        let familyMasterNumber = document.getElementById("familyMasterNumber").value;

        if (!familyMasterNumber) {
            familyMasterNumber = 0;
        }

        const familyUpdate = {
            familyMasterNumber: familyMasterNumber,
            idMember: memberNumber
        }
        await RequestPost.newFamily(familyUpdate)

    }

    async oneFamilyCheck(memberNumber, familyMasterNumber) {
        if (!familyMasterNumber || memberNumber == familyMasterNumber) {
            familyMasterNumber = 0;
        }

        fetch(`api/family/check/${memberNumber}/${familyMasterNumber}`)
            .then(response => response.json())
            .then(family => {
                const familyMasterNumber = family.familyMasterNumber
                const memberNumber = family.memberNumber
            })

    }

    static async delMemberOfActivity(memberId, activityId, li) {
        if (confirm("¿Estás seguro de que quieres borrar este elemento?")) {
            try {
                await RequestDel.delActivityMember(activityId);
                li.remove();
            } catch (error) {
                console.error("Error al eliminar la actividad:", error);
                alert("Error al eliminar la actividad. Por favor, intente de nuevo.");
            }
        }
    }


    static extraerUltimoNumero(cadena) {
        const regex = /\d+$/;
        const match = cadena.match(regex);
        return match ? parseInt(match[0]) : null;
    }

    static setupActivityListeners() {
        const activitySel = document.getElementById("ul-activity-member");

        activitySel.addEventListener('click', (event) => {
            const target = event.target;
            const li = target.closest('li');
            if (!li) return;

            const activityId = li.dataset.activityId;
            const memberId = document.getElementById('memberId').value; // Asumiendo que tienes un campo con el ID del miembro

            if (target.classList.contains('delete-button') || target.closest('.delete-button')) {
                this.delMemberOfActivity(memberId, activityId, li);
            } else if (target.tagName === 'LABEL') {
                console.log(activityId);
                alert(`Redirigirá a Actividades ${activityId}`);
            }
        });
    }
}