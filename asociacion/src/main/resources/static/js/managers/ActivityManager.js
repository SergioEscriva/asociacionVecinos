import { RequestGet } from "../api/RequestGet.js";
import { RequestPut } from "../api/RequestPut.js";
import { RequestPost } from "../api/RequestPost.js";
import { ActivityMemberManager } from "./ActivityMemberManager.js";
import { Listeners } from "../utils/Listeners.js";

export class ActivityManager {

  static getInput(id) {
    return document.getElementById(id);
  }

  static setInputValue(id, value) {
    const el = this.getInput(id);
    if (el) el.value = value;
  }

  static async init() {
    const activityLink = document.querySelector('a[data-section="activityIndex"]');
    const activityIdByLink = activityLink?.getAttribute('data-activity-id');
    let activityId = 0;
    if (activityIdByLink) {
      const activity = await RequestGet.getActivityById(activityIdByLink);
      activityId = activity?.id || 0;
    }

    const backImage = await RequestGet.getConfigById(9);
    this.getInput('backImage').src = backImage.attribute;

    this.getInput("updateActivity").addEventListener("click", () => this.updateActivity());
    this.getInput("getElementByIdSelected").addEventListener("click", () => this.getMemberByNumber());
    this.getInput("updateActivityMember").addEventListener("click", () => this.updateActivityMember());

    const memberAttribute = await RequestGet.getConfigById(3);
    this.getInput('placeholderActivity').placeholder = "Añadir " + memberAttribute.attribute + " por número.";
    this.getInput('h2ActivityMembers').textContent = "Lista de " + memberAttribute.attribute + "(s)";

    const yearInput = this.getInput("year-select");
    const yearNow = new Date().getFullYear();
    if (yearInput) {
      yearInput.value = yearNow;
      yearInput.addEventListener('change', () => this.inyectOption(yearInput.value));
    }

    Listeners.setupActivityListeners();
    await this.inyectOption(yearNow);
    await this.getActivityById(activityId);
  }

  static async limpiaCampos() {
    ['activityId', 'activityName', 'managerName', 'notes'].forEach(id => this.setInputValue(id, ""));
    const ulMembersActivity = this.getInput("ul-activity-member");
    ulMembersActivity.innerHTML = "";
    ulMembersActivity.replaceWith(ulMembersActivity.cloneNode(true)); // Elimina listeners
  }

  static async getActivityById(activityId) {
    await this.limpiaCampos();
    if (!activityId) return;
    const activity = await RequestGet.getActivityById(activityId);
    if (activity) {
      this.setInputValue('activityId', activityId);
      this.setInputValue('activityName', activity.name);
      this.setInputValue('managerName', activity.managerName);
      this.setInputValue('notes', activity.notes);
      await this.getMembersActivityId(activityId);
    }
  }

  static async getMembersActivityId(activityId) {
    const activitySel = this.getInput("ul-activity-member");
    activitySel.innerHTML = "";
    try {
      const activities = await RequestGet.getMembersActivityId(activityId);
      activities.forEach(activity => {
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
    const activityId = this.getInput('activityId').value;
    const activityName = this.getInput('activityName').value;
    const managerName = this.getInput('managerName').value;
    const notes = this.getInput('notes').value;
    const year = this.getInput("year-select").value;

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

    const updateActivity = { name: activityName, managerName, notes, year };
    let request;
    if (!activityId) {
      request = await RequestPost.newActivity(updateActivity);
    } else {
      request = await RequestPut.editActivity(activityId, updateActivity);
    }
    return request;
  }

  static async inyectOption(year) {
    year = year || new Date().getFullYear();
    const activitySel = this.getInput("activity-select");
    activitySel.innerHTML = `<option value="0">Selecciona Actividad</option>`;
    try {
      const activities = await RequestGet.getActivitys(year);
      activities.forEach(activity => {
        activitySel.innerHTML += `<option value="${activity.id}">${activity.name}</option>`;
      });
    } catch (error) {
      console.error('Error:', error);
      activitySel.innerHTML = '<p>Error al cargar las actividades.</p>';
    }
    const newSelect = activitySel.cloneNode(true);
    activitySel.parentNode.replaceChild(newSelect, activitySel);
    newSelect.addEventListener('change', event => {
      this.getActivityById(event.target.value);
    });
  }

  static async getMemberByNumber() {
    const memberNumber = this.getInput('placeholderActivity').value;
    const member = await RequestGet.getMemberByNumber(memberNumber);
    if (!member) {
      alert("El socio " + memberNumber + " no existe");
      return;
    }
    this.setInputValue('name', member.name);
    this.getInput('name').dataset.familyType = member.id;
    this.setInputValue('lastName1', member.lastName1);
    this.setInputValue('lastName2', member.lastName2);
  }

  static async updateActivityMember() {
    const activityId = this.getInput('activityId').value;
    const memberHtml = this.getInput('name');
    const memberId = memberHtml.dataset.familyType;
    await ActivityMemberManager.createActivityMemberThis(activityId, memberId);
    await this.getActivityById(activityId);
  }
}
