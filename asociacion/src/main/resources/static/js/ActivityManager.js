import { RequestGet } from "./RequestGet.js";
import { RequestPut } from "./RequestPut.js";
import { RequestPost } from "./RequestPost.js";
import { ActivityMemberManager } from "./ActivityMemberManager.js";
import { Listeners } from "./Listeners.js";


//window.onload = function () {



//};

export class ActivityManager {

  constructor() {

  }

  async init() {
    // Cuando se redirecciona memberIndex desde activityIndex
    const activityLink = document.querySelector('a[data-section="activityIndex"]');
    const activityIdByLink = activityLink.getAttribute('data-activity-id');
    let activityId = 0
    if (activityIdByLink) {
      const activity = await RequestGet.getActivityById(activityIdByLink)
      //ActivityManager.getMemberByNumber(activityNumber.id);
      activityId = activity.id

    }



    document.getElementById("updateActivity").addEventListener("click", function () { ActivityManager.updateActivity(); });
    document.getElementById("getElementByIdSelected").addEventListener("click", function () { ActivityManager.getMemberByNumber(); });
    document.getElementById("updateActivityMember").addEventListener("click", function () { ActivityManager.updateActivityMember(); });

    const memberAttribute = await RequestGet.getConfigById(3)
    document.getElementById('placeholderActivity').placeholder = "Añadir " + memberAttribute.attribute;
    document.getElementById('h2ActivityMembers').textContent = "Lista de " + memberAttribute.attribute + "(s)";



    Listeners.setupActivityListeners();
    ActivityManager.inyectOption(activityId)
    ActivityManager.getActivityById(activityId);

  }

  static async limpiaCampos() {
    document.getElementById('activityId').value = "";
    //document.getElementById('activityActive').value = this.getActivo(activity.active);
    document.getElementById('activityName').value = "";
    document.getElementById('managerName').value = "";
    document.getElementById('notes').value = "";
    const ulMembersActivity = document.getElementById("ul-members-activity");
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
      //document.getElementById('activityActive').value = this.getActivo(activity.active);
      document.getElementById('activityName').value = activity.name;
      document.getElementById('managerName').value = activity.managerName;
      document.getElementById('notes').value = activity.notes;
      this.getMembersActivityId(activityId)
    }
  }

  static async getMembersActivityId(activityId) {
    const activitySel = document.getElementById("ul-members-activity");
    activitySel.innerHTML = "";

    try {
      const activities = await RequestGet.getMembersActivityId(activityId)
      activities.forEach((activity) => {
        activitySel.innerHTML += `
                <li id="li-activitys-member-${activity.memberId}" data-activity-id="${activity.memberId}">
                    <button class="delete-button" id="li-button-${activity.memberId}" title="Eliminar Socio de la Actividad"><i class="fas fa-trash"></i></button>
                    <label class="text-activity" for="option${activity.memberId}" id="li-label-${activity.memberId}" title="Pulsar para abrir seleccionado">${activity.memberName} ${activity.memberApellido}</label>
                </li>`;
      });
    } catch (error) {
      console.error('Error:', error);
      activitySel.innerHTML = '<p>Error al cargar las actividades.</p>';
    }

  }

  static async updateActivity() {
    const activityId = document.getElementById('activityId').value
    //const activityActive = document.getElementById('activityActive').value
    const activityName = document.getElementById('activityName').value
    const managerName = document.getElementById('managerName').value
    const notes = document.getElementById('notes').value

    const updateActivity = {
      name: activityName,
      managerName: managerName,
      notes: notes
    }

    let request;
    if (!activityId) {
      request = await RequestPost.newActivity(updateActivity)
    } else {
      request = await RequestPut.editActivity(activityId, updateActivity)
    }
    return request;
  }



  static async inyectOption(activityId) {

    const activitySel = document.getElementById("activity-select");
    activitySel.innerHTML = "";
    activitySel.innerHTML = `<option value="0">Selecciona Actividad</option>`
    try {

      const activities = await RequestGet.getActivitys()
      activities.forEach((activity) => {
        if (activity.id == activityId) {
          activitySel.innerHTML += `<option selected value="${activity.id}">${activity.name}</option>`
        } else {
          activitySel.innerHTML += `<option value="${activity.id}">${activity.name}</option>`;
        }
      });
    } catch (error) {
      console.error('Error:', error);
      activitySel.innerHTML = '<p>Error al cargar las actividades.</p>';
    }



    // Listening desplegable Option
    const select1 = document.getElementById('activity-select')
    let selectedURL = ''
    const handleChange1 = (event) => {
      const { value } = event.target
      this.getActivityById(value);
    }
    select1.addEventListener('change', handleChange1)

  }

  static async getMemberByNumber() {
    const memberNumber = document.getElementById('placeholderActivity').value
    //ActivityManager.limpiaCampos()

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

    await ActivityMemberManager.createActivityMemberInActivity(activityId, memberId)
    this.getActivityById(activityId)
  }
}
