

window.onload = function () {
  ActivityManager.getActivityById(1);
};

export class ActivityManager {

  static async getActivityById(activityId) {
    // await MembersManager.limpiaCampos()

    fetch(`/api/activity/${activityId}`)
      .then(response => response.json())
      .then(activity => {
        if (!activity) {
          alert("La actividad " + activityId + " no existe")
          return
        }
        console.log(activity)
        document.getElementById('activityId').value = activityId;
        //document.getElementById('activityActive').value = this.getActivo(activity.active);
        document.getElementById('activityName').value = activity.name;
        document.getElementById('managerName').value = activity.managerName;
        document.getElementById('notes').value = activity.notes;
        //ActivityMemberManager.getActivitiesByMemberId(activity.id);
        this.getMembersActivityId(activityId)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  static async getMembersActivityId(activityId) {
    const activitySel = document.getElementById("ul-members-activity");
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
