import { RequestGet } from './RequestGet.js';
import * as XLSX from 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';

export class ListsManager {

  constructor() {
    this.actividadesConMiembros = [];
    this.currentYear = new Date().getFullYear();
    this.currentListData = [];
    this.currentListHeaders = [];
    this.currentListFilename = '';
    // Bandera para asegurar que los listeners de fila se añaden una sola vez
    this.rowClickListenersAdded = false;
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

    // Asegurarse de que el botón de exportar se cree una sola vez
    let genericExportButton = document.getElementById('generic-export-button');
    if (!genericExportButton) {
      genericExportButton = document.createElement('button');
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

    // Ocultar el botón por defecto, se mostrará según el caso
    genericExportButton.style.display = 'none';

    // Limpiar el contenido previo del cuerpo de la tabla para evitar duplicados
    const tbodyMember = document.getElementById('tbody-member');
    if (tbodyMember) {
      tbodyMember.innerHTML = '';
    }

    // Limpiar el contenedor de actividades antes de renderizar nuevas
    const activitiesListContainer = document.getElementById('activities-list-container');
    if (activitiesListContainer) {
      activitiesListContainer.innerHTML = '';
    }


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
        genericExportButton.style.display = 'block';
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
        genericExportButton.style.display = 'block';
        break;

      case 'button3':
        titleElement.textContent = `Histórico de ${memberAttribute.attribute}(s) Inactivos/as`;
        document.getElementById('sortByMemberNumber').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
        document.getElementById('reason').textContent = 'MOTIVO INACTIVIDAD';
        document.getElementById('date').textContent = 'FECHA BAJA';

        const allInactiveRegistries = await RequestGet.getResgistries();
        const filteredInactiveRegistries = allInactiveRegistries.filter(registry => {
          return registry.reasonEnd && registry.reasonEnd.trim() !== '';
        });

        this.renderInactivesList(filteredInactiveRegistries);

        const inactiveMembersData = await Promise.all(filteredInactiveRegistries.map(async (registry) => {
          const member = await RequestGet.getMemberById(registry.memberId);
          if (!member) return null;
          const lastPaidYear = await this.getLastPaidYear(member.id);
          const registroCompleto = await RequestGet.getRegistryById(registry.id);
          const startDate = new Date(registroCompleto.startData).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
          return [
            member.name,
            `${member.lastName1} ${member.lastName2}`,
            member.memberNumber,
            lastPaidYear,
            registroCompleto.reasonEnd,
            startDate
          ];
        }));
        this.setExportData(
          inactiveMembersData.filter(data => data !== null),
          ["Nombre", "Apellidos", "Nº Socio", "Último Año Pagado", "Motivo Inactividad", "Fecha Baja"],
          `Histórico de ${memberAttribute.attribute}s Inactivos.xlsx`
        );
        genericExportButton.style.display = 'block';
        break;

      case 'button4':
        // Asegúrate de que el contenedor de lista de actividades esté visible y el de la tabla principal oculto
        const mainTableContainer = document.getElementById('main-table-container'); // Asumo que tienes un contenedor para la tabla principal
        if (mainTableContainer) mainTableContainer.style.display = 'none';

        const activitiesContainer = document.getElementById('activities-list-container');
        if (activitiesContainer) activitiesContainer.style.display = 'block';

        const allActivities = await RequestGet.getActivitys(this.currentYear);
        this.actividadesConMiembros = await this.getActividadesConMiembros(allActivities);
        this.renderActivityListWithMembers(this.actividadesConMiembros);
        // Ocultar el botón de exportar genérico para esta vista
        genericExportButton.style.display = 'none';
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
        genericExportButton.style.display = 'block';
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
        genericExportButton.style.display = 'block';
        break;
    }
    // Añadir listeners de fila solo una vez después de que todo el contenido se haya renderizado
    if (!this.rowClickListenersAdded) {
      this.addRowClickListeners();
      this.rowClickListenersAdded = true;
    }
  }

  setExportData(data, headers, filename) {
    this.currentListData = data;
    this.currentListHeaders = headers;
    this.currentListFilename = filename;
  }

  setupMemberSorting(members) {
    // Es importante remover los listeners antes de añadir nuevos para evitar duplicados
    const sortByNameBtn = document.getElementById('sortByName');
    const sortByMemberNumberBtn = document.getElementById('sortByMemberNumber');

    if (sortByNameBtn) {
      sortByNameBtn.replaceWith(sortByNameBtn.cloneNode(true)); // Clonar para remover listeners
      document.getElementById('sortByName').addEventListener('click', async () => {
        const sortedByName = [...members].sort((a, b) => a.name.localeCompare(b.name));
        this.renderList(sortedByName, document.body.getAttribute('data-page-selection') === 'button1');
        this.updateExportDataAfterSorting(sortedByName, document.body.getAttribute('data-page-selection'));
      });
    }
    if (sortByMemberNumberBtn) {
      sortByMemberNumberBtn.replaceWith(sortByMemberNumberBtn.cloneNode(true));
      document.getElementById('sortByMemberNumber').addEventListener('click', async () => {
        const sortedByMemberNumber = [...members].sort((a, b) => a.memberNumber.localeCompare(b.memberNumber));
        this.renderList(sortedByMemberNumber, document.body.getAttribute('data-page-selection') === 'button1');
        this.updateExportDataAfterSorting(sortedByMemberNumber, document.body.getAttribute('data-page-selection'));
      });
    }
  }

  setupPaySorting(members) {
    const sortByNamePayListBtn = document.getElementById('sortByNamePayList');
    const sortByMemberNumberPayListBtn = document.getElementById('sortByMemberNumberPayList');

    if (sortByNamePayListBtn) {
      sortByNamePayListBtn.replaceWith(sortByNamePayListBtn.cloneNode(true));
      document.getElementById('sortByNamePayList').addEventListener('click', async () => {
        const sortedByName = [...members].sort((a, b) => a.name.localeCompare(b.name));
        this.renderPayList(sortedByName);
        this.updateExportDataAfterSorting(sortedByName, 'button5');
      });
    }
    if (sortByMemberNumberPayListBtn) {
      sortByMemberNumberPayListBtn.replaceWith(sortByMemberNumberPayListBtn.cloneNode(true));
      document.getElementById('sortByMemberNumberPayList').addEventListener('click', async () => {
        const sortedByMemberNumber = [...members].sort((a, b) => a.memberNumber.localeCompare(b.memberNumber));
        this.renderPayList(sortedByMemberNumber);
        this.updateExportDataAfterSorting(sortedByMemberNumber, 'button5');
      });
    }
  }

  setupUnpaySorting(members) {
    const sortByNamePayListBtn = document.getElementById('sortByNamePayList'); // Comparten el mismo ID con la lista de pagos
    const sortByMemberNumberPayListBtn = document.getElementById('sortByMemberNumberPayList');

    if (sortByNamePayListBtn) {
      sortByNamePayListBtn.replaceWith(sortByNamePayListBtn.cloneNode(true));
      document.getElementById('sortByNamePayList').addEventListener('click', async () => {
        const sortedByName = [...members].sort((a, b) => a.name.localeCompare(b.name));
        this.renderUnpayList(sortedByName);
        this.updateExportDataAfterSorting(sortedByName, 'button6');
      });
    }
    if (sortByMemberNumberPayListBtn) {
      sortByMemberNumberPayListBtn.replaceWith(sortByMemberNumberPayListBtn.cloneNode(true));
      document.getElementById('sortByMemberNumberPayList').addEventListener('click', async () => {
        const sortedByMemberNumber = [...members].sort((a, b) => a.memberNumber.localeCompare(b.memberNumber));
        this.renderUnpayList(sortedByMemberNumber);
        this.updateExportDataAfterSorting(sortedByMemberNumber, 'button6');
      });
    }
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
    // No añadir addRowClickListeners aquí, se hará una sola vez al final de init()
  }

  async getHtmlRowMembers(member, lineNumber) {
    const activeStatus = member.active ? '✓' : 'X';
    const lastPaidYear = await this.getLastPaidYear(member.id);
    return `<tr class="clickable-row" data-member-number="${member.memberNumber}">
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
    // No añadir addRowClickListeners aquí
  }

  async getHtmlInactivesRowMembers(registry, lineNumber) {
    const member = await RequestGet.getMemberById(registry.memberId);
    if (member === null) {
      return ""
    }
    const activeStatus = member.active ? 'O' : 'X'; // Este 'O' no parece usarse en el HTML final, pero lo mantengo
    const lastPaidYear = await this.getLastPaidYear(member.id);
    const registro = await RequestGet.getRegistryById(registry.id);
    const startDate = new Date(registro.startData).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `<tr class="clickable-row" data-member-number="${member.memberNumber}">
                <td>${lineNumber}</td>
                <td>${member.name}</td>
                <td>${member.lastName1} ${member.lastName2}</td>
                <td>${member.memberNumber}</td>
                <td>-</td>
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
    // No añadir addRowClickListeners aquí
  }

  async getHtmlPayRowMembers(member, lineNumber) {
    const paidYears = await this.getPaidYears(member.id);
    return `<tr class="clickable-row" data-member-number="${member.memberNumber}">
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
    // No añadir addRowClickListeners aquí
  }

  async getHtmlUnpayRowMembers(member, lineNumber) {
    const lastPaidYear = await this.getLastPaidYear(member.id);
    return `<tr class="clickable-row" data-member-number="${member.memberNumber}">
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

    // Obtener o crear el contenedor principal de actividades
    let activitiesListContainer = document.getElementById('activities-list-container');
    if (!activitiesListContainer) {
      activitiesListContainer = document.createElement('div');
      activitiesListContainer.id = 'activities-list-container';
      document.getElementById('list-container').appendChild(activitiesListContainer);
    }

    // Limpiar el contenido existente antes de añadir el nuevo para evitar duplicados
    activitiesListContainer.innerHTML = '';

    // Añadir la estructura interna solo una vez
    activitiesListContainer.innerHTML = `<ul id="actividades-lista"></ul><div id="miembros-detalle" style="display: none;"><h2>${memberAttribute.attribute}/s de la Actividad: <span id="nombre-actividad"></span></h2><ul id="miembros-lista"></ul><button id="boton-imprimir">Imprimir a Excel</button></div>`;

    const actividadesListaElement = document.getElementById("actividades-lista");
    const miembrosDetalleElement = document.getElementById("miembros-detalle");
    const miembrosListaElement = document.getElementById("miembros-lista");
    const nombreActividadElement = document.getElementById("nombre-actividad");
    const botonImprimirElement = document.getElementById("boton-imprimir");

    // Llenar la lista de actividades
    actividadesConMiembros.forEach(actividad => {
      const listItem = document.createElement("li");
      listItem.textContent = `${actividad.nombre} (${actividad.miembros.length} ${memberAttribute.attribute}/s)`;
      listItem.style.fontSize = "1.5rem";
      listItem.style.cursor = 'pointer';
      listItem.style.padding = '8px';
      listItem.style.borderBottom = '1px solid #eee';
      listItem.addEventListener("click", () => {
        nombreActividadElement.textContent = actividad.nombre;
        miembrosListaElement.innerHTML = ""; // Limpiar lista de miembros al seleccionar una actividad
        if (actividad.miembros.length > 0) {
          actividad.miembros.forEach(miembro => {
            const miembroItem = document.createElement("li");
            miembroItem.classList.add("clickable-row");
            miembroItem.setAttribute("data-member-number", miembro.memberNumber);
            miembroItem.innerHTML = `<strong>${miembro.memberNumber}</strong> - ${miembro.name} ${miembro.lastName1} ${miembro.lastName2} ( ${miembro.notes} )`;
            miembroItem.style.fontSize = "1.5rem";
            miembroItem.style.cursor = "pointer";
            // Eliminar el listener directo aquí, ya se manejará con addRowClickListeners()
            // miembroItem.addEventListener("click", () => {});
            miembrosListaElement.appendChild(miembroItem);
          });
          botonImprimirElement.onclick = () => this.imprimirMiembrosAExcel(actividad.nombre, actividad.miembros);
        } else {
          miembrosListaElement.innerHTML = "<li>No hay miembros en esta actividad.</li>";
          botonImprimirElement.onclick = null;
        }
        miembrosDetalleElement.style.display = "block";
        // Volver a aplicar los listeners a las filas de miembros de la actividad
        this.addRowClickListeners();
      });
      actividadesListaElement.appendChild(listItem);
    });
  }

  // Este método no parece usarse en el código original, lo mantengo por si acaso.
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

  addRowClickListeners() {
    // Eliminar listeners previos para evitar duplicados si esta función se llama múltiples veces
    const rows = document.querySelectorAll('.clickable-row');
    rows.forEach(row => {
      // Clona el nodo para eliminar todos los listeners existentes
      const newRow = row.cloneNode(true);
      row.parentNode.replaceChild(newRow, row);
    });

    // Seleccionar de nuevo todos los elementos con la clase .clickable-row (ahora sin listeners)
    const newRows = document.querySelectorAll('.clickable-row');
    newRows.forEach(row => {
      row.addEventListener('click', function () {
        const memberNumberFromRow = this.getAttribute('data-member-number');

        if (memberNumberFromRow) {
          sessionStorage.setItem('selectedMemberId', memberNumberFromRow);
        } else {
          sessionStorage.removeItem('selectedMemberId');
          console.warn("ListsManager: No se encontró memberNumber en la fila, limpiando sessionStorage para 'selectedMemberId'.");
        }

        if (typeof window.App !== 'undefined' && window.App.loadContent) {
          window.App.loadContent('memberIndex', 2, null);
        } else {
          console.error('ListsManager: Error: window.App.loadContent no está definido o accesible.');
        }
      });
    });
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