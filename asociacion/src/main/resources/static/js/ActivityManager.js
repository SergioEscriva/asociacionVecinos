import { RequestGet } from "./RequestGet.js";

window.onload = function () {
  ActivityManager.inyectOption()
  ActivityManager.getActivityById(1)
};

export class ActivityManager {

  static async limpiaCampos() {
    document.getElementById('activityId').value = "";
    //document.getElementById('activityActive').value = this.getActivo(activity.active);
    document.getElementById('activityName').value = "";
    document.getElementById('managerName').value = "";
    document.getElementById('notes').value = "";
    const activitySel = document.getElementById("ul-members-activity");
    const oldListener = activitySel.onclick;
    activitySel.removeEventListener('click', oldListener);
    activitySel.innerHTML = "";
  }

  static async getActivityById(activityId) {
    await ActivityManager.limpiaCampos()

    const activity = await RequestGet.getActivity(activityId)
    if (!activity) {
      alert("La actividad " + activityId + " no existe")
      return
    }
    document.getElementById('activityId').value = activityId;
    //document.getElementById('activityActive').value = this.getActivo(activity.active);
    document.getElementById('activityName').value = activity.name;
    document.getElementById('managerName').value = activity.managerName;
    document.getElementById('notes').value = activity.notes;
    this.getMembersActivityId(activityId)
  }

  static async getMembersActivityId(activityId) {
    const activitySel = document.getElementById("ul-members-activity");
    activitySel.innerHTML = "";

    try {
      const response = await fetch(`api/activitymember/activityId/${activityId}`);
      const activities = await response.json();
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


  static async inyectOption() {

    const activitySel = document.getElementById("activity-select");
    activitySel.innerHTML = "";
    activitySel.innerHTML = `<option selected>Selecciona Actividad</option>`
    try {

      const activities = await RequestGet.getActivitys()
      activities.forEach((activity) => {
        activitySel.innerHTML += `
              <option value="${activity.id}">${activity.name}</option>`;
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
      console.log(value)
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
