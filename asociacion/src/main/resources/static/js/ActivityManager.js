import { RequestGet } from "./RequestGet.js";
import { RequestPut } from "./RequestPut.js";
import { RequestPost } from "./RequestPost.js";
import { ActivityMemberManager } from "./ActivityMemberManager.js";
import { Listeners } from "./Listeners.js";

export class ActivityManager {

  constructor() {

  }

  async init() {

    const activityLink = document.querySelector('a[data-section="activityIndex"]');
    const activityIdByLink = activityLink.getAttribute('data-activity-id');
    let activityId = 0
    if (activityIdByLink) {
      const activity = await RequestGet.getActivityById(activityIdByLink)
      activityId = activity.id

    }

    const backImage = await RequestGet.getConfigById(9);
    document.getElementById('backImage').src = backImage.attribute;

    document.getElementById("updateActivity").addEventListener("click", function () { ActivityManager.updateActivity(); });
    document.getElementById("getElementByIdSelected").addEventListener("click", function () { ActivityManager.getMemberByNumber(); });
    document.getElementById("updateActivityMember").addEventListener("click", function () { ActivityManager.updateActivityMember(); });

    const memberAttribute = await RequestGet.getConfigById(3)
    document.getElementById('placeholderActivity').placeholder = "Añadir " + memberAttribute.attribute + " por número.";
    document.getElementById('h2ActivityMembers').textContent = "Lista de " + memberAttribute.attribute + "(s)";

    const yearInput = document.getElementById("year-select");
    const yearNow = new Date().getFullYear();

    if (yearInput) {
      yearInput.value = yearNow;

      yearInput.addEventListener('change', function () {
        const selectedYear = this.value;
        ActivityManager.inyectOption(selectedYear);
      });
    }


    Listeners.setupActivityListeners();
    ActivityManager.inyectOption(yearNow)
    ActivityManager.getActivityById(activityId);

  }

  static async limpiaCampos() {
    document.getElementById('activityId').value = "";
    document.getElementById('activityName').value = "";
    document.getElementById('managerName').value = "";
    document.getElementById('notes').value = "";
    const ulMembersActivity = document.getElementById("ul-activity-member");
    const oldListener = ulMembersActivity.onclick;
    ulMembersActivity.removeEventListener('click', oldListener);
    ulMembersActivity.innerHTML = "";
  }

  static async getActivityById(activityId) {
    let activity = "";
    await ActivityManager.limpiaCampos()
    if (activityId) {
      activity = await RequestGet.getActivityById(activityId)
    }
    if (activity) {
      document.getElementById('activityId').value = activityId;
      document.getElementById('activityName').value = activity.name;
      document.getElementById('managerName').value = activity.managerName;
      document.getElementById('notes').value = activity.notes;
      this.getMembersActivityId(activityId)
    }
  }

  static async getMembersActivityId(activityId) {
    const activitySel = document.getElementById("ul-activity-member");
    activitySel.innerHTML = "";

    try {
      const activities = await RequestGet.getMembersActivityId(activityId)
      activities.forEach((activity) => {
        activitySel.innerHTML += `
                <li id="li-activitys-member-${activity.memberId}" data-activity-id="${activity.memberId}">
                    <button class="delete-button" id="li-button-${activity.memberId}" title="Eliminar Socio de la Actividad"><i class="fas fa-trash"></i></button>
                    <label class="text-activity" for="option${activity.memberId}" id="li-label-${activity.memberId}" title="Pulsar para abrir seleccionado">${activity.memberName} ${activity.memberApellido1} ${activity.memberApellido2}</label>
                </li>`;
      });
    } catch (error) {
      console.error('Error:', error);
      activitySel.innerHTML = '<p>Error al cargar las actividades.</p>';
    }

  }

  static async updateActivity() {
    const activityId = document.getElementById('activityId').value
    const activityName = document.getElementById('activityName').value
    const managerName = document.getElementById('managerName').value
    const notes = document.getElementById('notes').value
    const year = document.getElementById("year-select").value;

    const activities = await RequestGet.getActivitys(year);
    const existingActivity = activities.find(activity => activity.name === activityName && activity.id !== activityId);

    if (existingActivity) {
      alert(`Ya existe una actividad con el nombre "${activityName}" en el año ${year}. Por favor, elige un nombre diferente.`);
      return;
    }
    if (!activityName) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
    if (activityName.length < 3) {
      alert("El nombre de la actividad debe tener al menos 3 caracteres.");
      return;
    }


    const updateActivity = {
      name: activityName,
      managerName: managerName,
      notes: notes,
      year: year
    }

    let request;
    if (!activityId) {
      request = await RequestPost.newActivity(updateActivity)
    } else {
      request = await RequestPut.editActivity(activityId, updateActivity)
    }
    return request;
  }



  static async inyectOption(year) {

    if (!year) {
      year = new Date().getFullYear();
    }

    const activitySel = document.getElementById("activity-select");
    activitySel.innerHTML = `<option value="0">Selecciona Actividad</option>`;

    try {
      const activities = await RequestGet.getActivitys(year);
      activities.forEach((activity) => {
        activitySel.innerHTML += `<option value="${activity.id}">${activity.name}</option>`;
      });
    } catch (error) {
      console.error('Error:', error);
      activitySel.innerHTML = '<p>Error al cargar las actividades.</p>';
    }

    // Quitar listeners anteriores antes de agregar uno nuevo
    const newSelect = activitySel.cloneNode(true);
    if (activitySel) {
      activitySel.parentNode.replaceChild(newSelect, activitySel);
    }
    newSelect.addEventListener('change', function (event) {
      const { value } = event.target;
      ActivityManager.getActivityById(value);
    });
  }

  static async getMemberByNumber() {
    const memberNumber = document.getElementById('placeholderActivity').value
    const member = await RequestGet.getMemberByNumber(memberNumber)
    if (!member) {
      alert("El socio " + memberNumber + " no existe")
      return
    }

    const memberHtml = document.getElementById('name')
    memberHtml.value = member.name
    memberHtml.dataset.familyType = member.id
    document.getElementById('lastName1').value = member.lastName1
    document.getElementById('lastName2').value = member.lastName2
  }


  static async updateActivityMember() {
    const activityId = document.getElementById('activityId').value
    const memberHtml = document.getElementById('name')
    const memberId = memberHtml.dataset.familyType

    await ActivityMemberManager.createActivityMemberThis(activityId, memberId)
    this.getActivityById(activityId)
  }
}
