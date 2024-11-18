import { RequestGet } from "./RequestGet.js";
import { RequestPut } from "./RequestPut.js";
import { RequestPost } from "./RequestPost.js";

window.onload = function () {

  //Obtener el parámetro activityId de la URL
  const urlParams = new URLSearchParams(window.location.search);
  let activityId = urlParams.get('activityId');
  document.getElementById("updateActivity").addEventListener("click", function () { ActivityManager.updateActivity(); });

  if (!activityId) {
    activityId = 0
  }

  ActivityManager.inyectOption(activityId)
  ActivityManager.getActivityById(activityId);

};

export class ActivityManager {

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

    await ActivityManager.limpiaCampos()
    const activity = await RequestGet.getActivity(activityId)
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
                    <button class="delete-button" id="li-button-${activity.memberId}"><i class="fas fa-trash"></i></button>
                    <label class="text-activity" for="option${activity.memberId}" id="li-label-${activity.memberId}">${activity.memberName} ${activity.memberApellido}</label>
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

  static async getActivo(active) {
    var checkbox = document.getElementById('mamagerName');
    checkbox.checked = false
    if (active == 1)
      checkbox.checked = true
  }


  async algoTemporal() {

    const deleteButtons = document.querySelectorAll('.delete-button');

    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const
          li = button.parentNode;
        li.parentNode.removeChild(li);
      });
    });
  }


}
