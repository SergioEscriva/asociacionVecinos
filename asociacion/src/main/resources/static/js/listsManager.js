import { RequestGet } from './RequestGet.js';
// Importa la clase para exportar a Excel
import * as XLSX from 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';

export class ListsManager {

  constructor() {
    this.actividadesConMiembros = []; // Almacenará la información de actividades con sus miembros
    this.currentYear = new Date().getFullYear();
  }

  async init() {
    const memberAttribute = await RequestGet.getConfigById(3);
    const pageSelection = document.body.getAttribute('data-page-selection');
    const titleElement = document.getElementById('txtTitleList');
    const backImage = await RequestGet.getConfigById(9);
    document.getElementById('backImage').src = backImage.attribute;

    switch (pageSelection) {
      case 'button1':
        titleElement.textContent = `Listado de ${memberAttribute.attribute}(s) Completo`;
        document.getElementById('sortByMemberNumber').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
        const allMembers = await RequestGet.getAllMembers();
        this.renderList(allMembers, true);
        this.setupMemberSorting(allMembers);
        break;
      case 'button2':
        titleElement.textContent = `Listado de ${memberAttribute.attribute}(s) Activos/as`;
        document.getElementById('sortByMemberNumber').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
        const activeMembers = await RequestGet.getListMembersActives();
        this.renderList(activeMembers, false);
        this.setupMemberSorting(activeMembers);
        break;
      case 'button3':
        titleElement.textContent = 'Histórico de ${memberAttribute.attribute}(s) Inactivos/as';
        document.getElementById('sortByMemberNumber').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
        document.getElementById('reason').textContent = 'MOTIVO INACTIVIDAD';
        document.getElementById('date').textContent = 'FECHA BAJA';
        const inactiveRegistries = await RequestGet.getResgistries();
        this.renderInactivesList(inactiveRegistries);
        break;
      case 'button4':
        const allActivities = await RequestGet.getActivitys(this.currentYear);
        this.actividadesConMiembros = await this.getActividadesConMiembros(allActivities);
        this.renderActivityListWithMembers(this.actividadesConMiembros);
        break;
      case 'button5':
        titleElement.textContent = 'Listado de Pagos';
        document.getElementById('sortByMemberNumberPayList').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
        document.getElementById('year').textContent = 'AÑO PAGADO';
        const allMembersPay = await RequestGet.getAllMembers();
        this.renderPayList(allMembersPay);
        this.setupPaySorting(allMembersPay);
        break;
      case 'button6':
        titleElement.textContent = 'Listado de Impagos';
        document.getElementById('sortByMemberNumberPayList').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
        document.getElementById('year').textContent = 'ÚLTIMO AÑO PAGADO';
        const unpayMembers = await RequestGet.getAllMembers();
        this.renderUnpayList(unpayMembers);
        this.setupUnpaySorting(unpayMembers);
        break;
    }
  }

  setupMemberSorting(members) {
    document.getElementById('sortByName').addEventListener('click', async () => {
      const sortedByName = [...members].sort((a, b) => a.name.localeCompare(b.name));
      this.renderList(sortedByName);
    });
    document.getElementById('sortByMemberNumber').addEventListener('click', async () => {
      const sortedByMemberNumber = [...members].sort((a, b) => a.memberNumber.localeCompare(b.memberNumber));
      this.renderList(sortedByMemberNumber);
    });
  }

  setupPaySorting(members) {
    document.getElementById('sortByNamePayList').addEventListener('click', async () => {
      const sortedByName = [...members].sort((a, b) => a.name.localeCompare(b.name));
      this.renderPayList(sortedByName);
    });
    document.getElementById('sortByMemberNumberPayList').addEventListener('click', async () => {
      const sortedByMemberNumber = [...members].sort((a, b) => a.memberNumber.localeCompare(b.memberNumber));
      this.renderPayList(sortedByMemberNumber);
    });
  }

  setupUnpaySorting(members) {
    document.getElementById('sortByNamePayList').addEventListener('click', async () => {
      const sortedByName = [...members].sort((a, b) => a.name.localeCompare(b.name));
      this.renderUnpayList(sortedByName);
    });
    document.getElementById('sortByMemberNumberPayList').addEventListener('click', async () => {
      const sortedByMemberNumber = [...members].sort((a, b) => a.memberNumber.localeCompare(b.memberNumber));
      this.renderUnpayList(sortedByMemberNumber);
    });
  }

  async renderList(members, allMembers) {
    let html = '';
    let lineNumber = 1;

    for (const member of members) {
      html += await this.getHtmlRowMembers(member, lineNumber);
      lineNumber++
    }

    if (allMembers) {
      document.getElementById('txtTitleList').textContent = "Listado Completo - Total " + (lineNumber - 1);
    } else {
      document.getElementById('txtTitleList').textContent = "Listado de Activos/as - Total " + (lineNumber - 1);
    }
    document.getElementById('tbody-member').innerHTML = html;
  }

  async getHtmlRowMembers(member, lineNumber) {
    const activeStatus = member.active ? '✓' : 'X';
    const lastPaidYear = await this.getLastPaidYear(member.id);
    return `<tr>
                <td>${lineNumber}</td>
                <td>${member.name}</td>
                <td>${member.lastName1} ${member.lastName2}</td>
                <td>${member.memberNumber}</td>
                <td>${activeStatus}</td>
                <td>${lastPaidYear}</td>
            </tr>`;
  }

  async renderInactivesList(registries) {
    let html = '';
    let lineNumber = 1;
    for (const registry of registries) {
      html += await this.getHtmlInactivesRowMembers(registry, lineNumber);
      lineNumber++
    }
    document.getElementById('txtTitleList').textContent = "Histórico de Inactividd - Total " + (lineNumber - 1);
    document.getElementById('tbody-member').innerHTML = html;
  }

  async getHtmlInactivesRowMembers(registry, lineNumber) {
    const member = await RequestGet.getMemberById(registry.memberId);
    if (member === null) {
      return
    }
    const activeStatus = member.active ? '✓' : 'X';
    const lastPaidYear = await this.getLastPaidYear(member.id);
    const registro = await RequestGet.getRegistryById(registry.id);
    const startDate = new Date(registro.startData).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `<tr>
                <td>${lineNumber}</td>
                <td>${member.name}</td>
                <td>${member.lastName1} ${member.lastName2}</td>
                <td>${member.memberNumber}</td>
                <td>${activeStatus}</td>
                <td>${lastPaidYear}</td>
                <td>${registro.reasonEnd}</td>
                <td>${startDate}</td>
            </tr>`;
  }

  async renderPayList(members) {
    let html = '';
    let lineNumber = 1;

    for (const member of members) {
      html += await this.getHtmlPayRowMembers(member, lineNumber);
      lineNumber++
    }

    document.getElementById('txtTitleList').textContent = "Lista de Pagos - Total " + (lineNumber - 1);
    document.getElementById('tbody-member').innerHTML = html;
  }

  async getHtmlPayRowMembers(member, lineNumber) {
    const paidYears = await this.getPaidYears(member.id);
    return `<tr>
                <td>${lineNumber}</td>
                <td>${member.name}</td>
                <td>${member.lastName1} ${member.lastName2}</td>
                <td>${member.memberNumber}</td>
                <td>${paidYears.join(', ')}</td>
            </tr>`;
  }

  async renderUnpayList(members) {
    let html = '';
    let lineNumber = 1;

    for (const member of members) {
      const paidYears = await this.getPaidYears(member.id);
      const hasPaidThisYear = paidYears.includes(this.currentYear);
      if (!hasPaidThisYear) {
        html += await this.getHtmlUnpayRowMembers(member, lineNumber);
        lineNumber++;
      }
    }
    document.getElementById('txtTitleList').textContent = "Lista de Impagados - Total " + (lineNumber - 1);
    document.getElementById('tbody-member').innerHTML = html;
  }

  async getHtmlUnpayRowMembers(member, lineNumber) {
    const lastPaidYear = await this.getLastPaidYear(member.id);
    return `<tr>
                <td>${lineNumber}</td>
                <td>${member.name}</td>
                <td>${member.lastName1} ${member.lastName2}</td>
                <td>${member.memberNumber}</td>
                <td>${lastPaidYear}</td>
            </tr>`;
  }


  async getLastPaidYear(memberid) {
    const response = await RequestGet.getLastFeeByMemberId(memberid);
    if (Array.isArray(response) && response.length > 0) {
      const memberRecord = response.find(record => record.memberId === memberid);
      return memberRecord?.year || "-";
    }
    return "-";
  }

  async getPaidYears(memberid) {
    const response = await RequestGet.getFeeByMemberId(memberid);
    if (Array.isArray(response) && response.length > 0) {
      const memberRecords = response.filter(record => record.memberId === memberid);
      return memberRecords.map(record => record.year);
    }
    return ["-"];
  }

  async renderActivityListWithMembers(actividadesConMiembros) {
    const memberAttribute = await RequestGet.getConfigById(3);

    // Agregar el contenedor para la lista de miembros y el botón de imprimir
    const activitiesListContainer = document.getElementById('activities-list-container') || document.createElement('div');
    activitiesListContainer.id = 'activities-list-container';
    document.getElementById('list-container').appendChild(activitiesListContainer);
    activitiesListContainer.innerHTML = `<ul id="actividades-lista"></ul><div id="miembros-detalle" style="display: none;"><h2>${memberAttribute.attribute}/s de la Actividad: <span id="nombre-actividad"></span></h2><ul id="miembros-lista"></ul><button id="boton-imprimir">Imprimir a Excel</button></div>`;

    const actividadesListaElement = document.getElementById("actividades-lista");
    const miembrosDetalleElement = document.getElementById("miembros-detalle");
    const miembrosListaElement = document.getElementById("miembros-lista");
    const nombreActividadElement = document.getElementById("nombre-actividad");
    const botonImprimirElement = document.getElementById("boton-imprimir");

    actividadesConMiembros.forEach(actividad => {
      const listItem = document.createElement("li");
      listItem.textContent = `${actividad.nombre} (${actividad.miembros.length} ${memberAttribute.attribute}/s)`;
      listItem.style.fontSize = "1.5rem";
      listItem.style.cursor = 'pointer';
      listItem.style.padding = '8px';
      listItem.style.borderBottom = '1px solid #eee';
      listItem.addEventListener("click", () => {
        nombreActividadElement.textContent = actividad.nombre;
        miembrosListaElement.innerHTML = "";
        if (actividad.miembros.length > 0) {
          actividad.miembros.forEach(miembro => {
            const miembroItem = document.createElement("li");
            miembroItem.innerHTML = `<strong>${miembro.memberNumber}</strong> - ${miembro.name} ${miembro.lastName1} ${miembro.lastName2} ` + `( ` + `${miembro.notes}` + ` )`;
            miembroItem.style.fontSize = "1.5rem";
            miembrosListaElement.appendChild(miembroItem);
          });
          botonImprimirElement.onclick = () => this.imprimirMiembrosAExcel(actividad.nombre, actividad.miembros);
        } else {
          miembrosListaElement.innerHTML = "<li>No hay miembros en esta actividad.</li>";
          botonImprimirElement.onclick = null;
        }
        miembrosDetalleElement.style.display = "block";
      });
      actividadesListaElement.appendChild(listItem);
    });
  }

  getHtmlRowActivityWithMembers(activity) {
    return `<tr>
                <td>${activity.nombre}</td>
                <td>${activity.miembros.length}</td>
            </tr>`;
  }

  async getActividadesConMiembros(activities) {

    const actividadesConInfo = [];
    for (const activity of activities) {
      const miembros = await RequestGet.getMembersActivityId(activity.id);
      actividadesConInfo.push({
        nombre: activity.name,
        miembros: miembros.map(member => ({
          memberNumber: member.numberMember,
          name: member.memberName,
          lastName1: member.memberApellido1,
          lastName2: member.memberApellido2,
          notes: member.notes
        })),
      });
    }
    return actividadesConInfo;
  }

  imprimirMiembrosAExcel(nombreActividad, miembros) {
    if (!miembros || miembros.length === 0) {
      alert("No hay miembros para imprimir en Excel.");
      return;
    }
    const headers = ["Número de Socio", "Nombre", "Apellidos", "Notas"];
    const data = miembros.map(miembro => [
      miembro.memberNumber,
      miembro.name,
      `${miembro.lastName1} ${miembro.lastName2}`,
      miembro.notes,
    ]);

    ExcelUtils.exportToExcel(data, headers, `Miembros de ${nombreActividad}.xlsx`);
  }
}

// Clase utilitaria para la exportación a Excel (puedes crear un archivo aparte llamado ExcelUtils.js)
class ExcelUtils {
  static exportToExcel(data, headers, filename = '') {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, filename);
  }
}

// Asegúrate de tener la librería xlsx.js incluida en tu HTML
// Puedes incluirla mediante un CDN como:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>