import { RequestGet } from './RequestGet.js';
import * as XLSX from 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';

export class ListsManager {

  constructor() {
    this.actividadesConMiembros = [];
    this.currentYear = new Date().getFullYear();
    this.currentListData = [];
    this.currentListHeaders = [];
    this.currentListFilename = '';
  }

  async init() {
    const memberAttribute = await RequestGet.getConfigById(3);
    const pageSelection = document.body.getAttribute('data-page-selection');
    const titleElement = document.getElementById('txtTitleList');
    const backImage = await RequestGet.getConfigById(9);

    let mainListContainer = document.getElementById('list-container');
    if (!mainListContainer) {
      console.error("Error: El elemento con ID 'list-container' no fue encontrado en el DOM. Creando dinámicamente...");
      mainListContainer = document.createElement('div');
      mainListContainer.id = 'list-container';
      document.body.appendChild(mainListContainer);
    }

    document.getElementById('backImage').src = backImage.attribute;

    let exportButtonContainer = document.getElementById('export-button-container');
    if (!exportButtonContainer) {
      exportButtonContainer = document.createElement('div');
      exportButtonContainer.id = 'export-button-container';
      mainListContainer.appendChild(exportButtonContainer);
    }
    if (!document.getElementById('generic-export-button')) {
      const genericExportButton = document.createElement('button');
      genericExportButton.id = 'generic-export-button';
      genericExportButton.textContent = 'Imprimir a Excel';
      exportButtonContainer.appendChild(genericExportButton);
      genericExportButton.addEventListener('click', () => {
        if (this.currentListData.length > 0) {
          ExcelUtils.exportToExcel(this.currentListData, this.currentListHeaders, this.currentListFilename);
        } else {
          alert("No hay datos para imprimir en Excel.");
        }
      });
    }

    document.getElementById('generic-export-button').style.display = 'none';

    switch (pageSelection) {
      case 'button1':
        titleElement.textContent = `Listado de ${memberAttribute.attribute}(s) Completo`;
        document.getElementById('sortByMemberNumber').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
        const allMembers = await RequestGet.getAllMembers();
        this.renderList(allMembers, true);
        this.setupMemberSorting(allMembers);
        const allMembersExportData = await Promise.all(allMembers.map(async m => {
          const year = await this.getLastPaidYear(m.id);
          return [m.name, m.lastName1, m.lastName2, m.memberNumber, m.active ? '✓' : 'X', year];
        }));
        this.setExportData(
          allMembersExportData,
          ["Nombre", "Apellido 1", "Apellido 2", "Nº Socio", "Activo", "Último Año Pagado"],
          `Listado Completo de ${memberAttribute.attribute}s.xlsx`
        );
        document.getElementById('generic-export-button').style.display = 'block';
        break;

      case 'button2':
        titleElement.textContent = `Listado de ${memberAttribute.attribute}(s) Activos/as`;
        document.getElementById('sortByMemberNumber').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
        const activeMembers = await RequestGet.getListMembersActives();
        this.renderList(activeMembers, false);
        this.setupMemberSorting(activeMembers);
        const activeMembersExportData = await Promise.all(activeMembers.map(async m => {
          const year = await this.getLastPaidYear(m.id);
          return [m.name, m.lastName1, m.lastName2, m.memberNumber, m.active ? '✓' : 'X', year];
        }));
        this.setExportData(
          activeMembersExportData,
          ["Nombre", "Apellido 1", "Apellido 2", "Nº Socio", "Activo", "Último Año Pagado"],
          `Listado de ${memberAttribute.attribute}s Activos.xlsx`
        );
        document.getElementById('generic-export-button').style.display = 'block';
        break;

      case 'button3':
        titleElement.textContent = `Histórico de ${memberAttribute.attribute}(s) Inactivos/as`;
        document.getElementById('sortByMemberNumber').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
        document.getElementById('reason').textContent = 'MOTIVO INACTIVIDAD';
        document.getElementById('date').textContent = 'FECHA BAJA';
        const inactiveRegistries = await RequestGet.getResgistries();
        this.renderInactivesList(inactiveRegistries);
        const inactiveMembersData = await Promise.all(inactiveRegistries.map(async (registry) => {
          const member = await RequestGet.getMemberById(registry.memberId);
          if (!member) return null;
          const lastPaidYear = await this.getLastPaidYear(member.id);
          const registroCompleto = await RequestGet.getRegistryById(registry.id);
          const startDate = new Date(registroCompleto.startData).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
          return [
            member.name,
            `${member.lastName1} ${member.lastName2}`,
            member.memberNumber,
            member.active ? '✓' : 'X',
            lastPaidYear,
            registroCompleto.reasonEnd,
            startDate
          ];
        }));
        this.setExportData(
          inactiveMembersData.filter(data => data !== null),
          ["Nombre", "Apellidos", "Nº Socio", "Activo", "Último Año Pagado", "Motivo Inactividad", "Fecha Baja"],
          `Histórico de ${memberAttribute.attribute}s Inactivos.xlsx`
        );
        document.getElementById('generic-export-button').style.display = 'block';
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
        const paidMembersData = await Promise.all(allMembersPay.map(async (member) => {
          const paidYears = await this.getPaidYears(member.id);
          return [
            member.name,
            `${member.lastName1} ${member.lastName2}`,
            member.memberNumber,
            paidYears.join(', ')
          ];
        }));
        this.setExportData(
          paidMembersData,
          ["Nombre", "Apellidos", "Nº Socio", "Años Pagados"],
          `Listado de Pagos de ${memberAttribute.attribute}s.xlsx`
        );
        document.getElementById('generic-export-button').style.display = 'block';
        break;

      case 'button6':
        titleElement.textContent = 'Listado de Impagos';
        document.getElementById('sortByMemberNumberPayList').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
        document.getElementById('year').textContent = 'ÚLTIMO AÑO PAGADO';
        const unpayMembers = await RequestGet.getAllMembers();
        this.renderUnpayList(unpayMembers);
        this.setupUnpaySorting(unpayMembers);
        const unpayMembersFiltered = [];
        for (const member of unpayMembers) {
          const paidYears = await this.getPaidYears(member.id);
          const hasPaidThisYear = paidYears.includes(this.currentYear);
          if (!hasPaidThisYear) {
            const lastPaidYear = await this.getLastPaidYear(member.id);
            unpayMembersFiltered.push([
              member.name,
              `${member.lastName1} ${member.lastName2}`,
              member.memberNumber,
              lastPaidYear
            ]);
          }
        }
        this.setExportData(
          unpayMembersFiltered,
          ["Nombre", "Apellidos", "Nº Socio", "Último Año Pagado"],
          `Listado de Impagos de ${memberAttribute.attribute}s.xlsx`
        );
        document.getElementById('generic-export-button').style.display = 'block';
        break;
    }
  }

  setExportData(data, headers, filename) {
    this.currentListData = data;
    this.currentListHeaders = headers;
    this.currentListFilename = filename;
  }

  setupMemberSorting(members) {
    document.getElementById('sortByName').addEventListener('click', async () => {
      const sortedByName = [...members].sort((a, b) => a.name.localeCompare(b.name));
      this.renderList(sortedByName, document.body.getAttribute('data-page-selection') === 'button1');
      this.updateExportDataAfterSorting(sortedByName, document.body.getAttribute('data-page-selection'));
    });
    document.getElementById('sortByMemberNumber').addEventListener('click', async () => {
      const sortedByMemberNumber = [...members].sort((a, b) => a.memberNumber.localeCompare(b.memberNumber));
      this.renderList(sortedByMemberNumber, document.body.getAttribute('data-page-selection') === 'button1');
      this.updateExportDataAfterSorting(sortedByMemberNumber, document.body.getAttribute('data-page-selection'));
    });
  }

  setupPaySorting(members) {
    document.getElementById('sortByNamePayList').addEventListener('click', async () => {
      const sortedByName = [...members].sort((a, b) => a.name.localeCompare(b.name));
      this.renderPayList(sortedByName);
      this.updateExportDataAfterSorting(sortedByName, 'button5');
    });
    document.getElementById('sortByMemberNumberPayList').addEventListener('click', async () => {
      const sortedByMemberNumber = [...members].sort((a, b) => a.memberNumber.localeCompare(b.memberNumber));
      this.renderPayList(sortedByMemberNumber);
      this.updateExportDataAfterSorting(sortedByMemberNumber, 'button5');
    });
  }

  setupUnpaySorting(members) {
    document.getElementById('sortByNamePayList').addEventListener('click', async () => {
      const sortedByName = [...members].sort((a, b) => a.name.localeCompare(b.name));
      this.renderUnpayList(sortedByName);
      this.updateExportDataAfterSorting(sortedByName, 'button6');
    });
    document.getElementById('sortByMemberNumberPayList').addEventListener('click', async () => {
      const sortedByMemberNumber = [...members].sort((a, b) => a.memberNumber.localeCompare(b.memberNumber));
      this.renderUnpayList(sortedByMemberNumber);
      this.updateExportDataAfterSorting(sortedByMemberNumber, 'button6');
    });
  }

  async updateExportDataAfterSorting(sortedMembers, pageSelection) {
    let updatedData = [];

    switch (pageSelection) {
      case 'button1':
      case 'button2':
        updatedData = await Promise.all(sortedMembers.map(async m => [m.name, m.lastName1, m.lastName2, m.memberNumber, m.active ? '✓' : 'X', await this.getLastPaidYear(m.id)]));
        break;
      case 'button5':
        updatedData = await Promise.all(sortedMembers.map(async (member) => {
          const paidYears = await this.getPaidYears(member.id);
          return [
            member.name,
            `${member.lastName1} ${member.lastName2}`,
            member.memberNumber,
            paidYears.join(', ')
          ];
        }));
        break;
      case 'button6':
        for (const member of sortedMembers) {
          const paidYears = await this.getPaidYears(member.id);
          const hasPaidThisYear = paidYears.includes(this.currentYear);
          if (!hasPaidThisYear) {
            const lastPaidYear = await this.getLastPaidYear(member.id);
            updatedData.push([
              member.name,
              `${member.lastName1} ${member.lastName2}`,
              member.memberNumber,
              lastPaidYear
            ]);
          }
        }
        break;
    }
    this.currentListData = updatedData;
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
    document.getElementById('txtTitleList').textContent = "Histórico de Inactividad - Total " + (lineNumber - 1);
    document.getElementById('tbody-member').innerHTML = html;
  }

  async getHtmlInactivesRowMembers(registry, lineNumber) {
    const member = await RequestGet.getMemberById(registry.memberId);
    if (member === null) {
      return ""
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
      const latestFee = response.reduce((latest, current) => {
        if (current.memberId === memberid) {
          const currentYear = parseInt(current.year);
          const latestYear = parseInt(latest?.year || 0);
          return currentYear > latestYear ? current : latest;
        }
        return latest;
      }, null);
      return latestFee?.year || "-";
    }
    if (response && typeof response === 'object' && response.year) {
      return response.year;
    }
    return "-";
  }

  async getPaidYears(memberid) {
    const response = await RequestGet.getFeeByMemberId(memberid);
    if (Array.isArray(response) && response.length > 0) {
      const memberRecords = response.filter(record => record.memberId === memberid);
      return memberRecords.map(record => record.year);
    }
    if (response && typeof response === 'object' && response.year) {
      return [response.year];
    }
    return ["-"];
  }

  async renderActivityListWithMembers(actividadesConMiembros) {
    const memberAttribute = await RequestGet.getConfigById(3);

    const genericExportButton = document.getElementById('generic-export-button');
    if (genericExportButton) {
      genericExportButton.style.display = 'none';
    }

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
            miembroListaElement.appendChild(miembroItem);
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

class ExcelUtils {
  static exportToExcel(data, headers, filename = '') {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, filename);
  }
}