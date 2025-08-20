import { RequestGet } from '../api/RequestGet.js';
import * as XLSX from 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';

class ExcelUtils {
  static exportToExcel(data, headers, filename = '') {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, filename);
  }
}



export class ListsManager {
  constructor() {
    this.actividadesConMiembros = [];
    this.currentYear = new Date().getFullYear();
    this.currentListData = [];
    this.currentListHeaders = [];
    this.currentListFilename = '';
    this.rowClickListenersAdded = false;
  }

  static getInput(id) {
    return document.getElementById(id);
  }

  static setInputValue(id, value) {
    const el = this.getInput(id);
    if (el) el.value = value;
  }

  static getAntiguedad(dateString) {
    if (!dateString || dateString === '-') return 0;
    
    const year = parseInt(dateString.slice(-4));
    
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Calcular la antigüedad restando solo los años
    const antiguedad = currentYear - year;
    
    return antiguedad;
  }

  async init() {
    const memberAttribute = await RequestGet.getConfigById(3);
    const pageSelection = document.body.getAttribute('data-page-selection');
    const titleElement = ListsManager.getInput('txtTitleList');
    const backImage = await RequestGet.getConfigById(9);

    let mainListContainer = ListsManager.getInput('list-container');
    if (!mainListContainer) {
      mainListContainer = document.createElement('div');
      mainListContainer.id = 'list-container';
      document.body.appendChild(mainListContainer);
    }

    ListsManager.getInput('backImage').src = backImage.attribute;

    let exportButtonContainer = ListsManager.getInput('export-button-container');
    if (!exportButtonContainer) {
      exportButtonContainer = document.createElement('div');
      exportButtonContainer.id = 'export-button-container';
      mainListContainer.appendChild(exportButtonContainer);
    }

    let genericExportButton = ListsManager.getInput('generic-export-button');
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

    //genericExportButton.style.display = 'none';

    switch (pageSelection) {
      case 'button1':
      case 'button2': {
        //ListsManager.showLoading();
        document.getElementById('spinner').style.display = 'block';
        document.getElementById('spinner').style.display = 'block';
        try {
          const isAll = pageSelection === 'button1';
          titleElement.textContent = isAll
            ? `Listado de ${memberAttribute.attribute}(s) Completo`
            : `Listado de ${memberAttribute.attribute}(s) Activos/as`;
            this.setListTitles(isAll ? 'completo' : 'activo');
          ListsManager.getInput('sortByMemberNumber').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
          const members = isAll
            ? await RequestGet.getAllMembers()
            : await RequestGet.getListMembersActives();
          this.renderList(members, isAll);
          this.setupMemberSorting(members);
          const exportData = await this.processInBatches.call(this, members);
          this.setExportData(
            exportData,
            ["Nombre", "Apellido 1", "Apellido 2", "Nº Socio", "Activo", "Fecha Alta", "Último Año Pagado"],
            isAll
              ? `Listado Completo de ${memberAttribute.attribute}s.xlsx`
              : `Listado de ${memberAttribute.attribute}s Activos.xlsx`
          );
          genericExportButton.style.display = 'block';
        } finally {}
        break;
      }
      case 'button3': {
        //ListsManager.showLoading();
        document.getElementById('spinner').style.display = 'block';
        try {
          titleElement.textContent = `Histórico de ${memberAttribute.attribute}(s) Inactivos/as`;
          ListsManager.getInput('sortByMemberNumber').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
          ListsManager.getInput('reason').textContent = 'MOTIVO INACTIVIDAD';
          ListsManager.getInput('date').textContent = 'FECHA BAJA';
          this.setListTitles('inactivo');
          const inactiveMembers = await RequestGet.getListMembersInactives();
          const allRegistries = await RequestGet.getResgistries();

          const registryMap = new Map();
          allRegistries.forEach(reg => {
            if (reg.memberId) {
              registryMap.set(reg.memberId, reg);
            }
          });

          const inactiveRegistries = inactiveMembers
          .map(member => {
            const registro = registryMap.get(member.id);
              if (!registro) return null;
              return {
                ...member,
                reasonEnd: registro.reasonEnd,
                endData: registro.endData
              };
            })
            .filter(item => item !== null);

          this.renderInactivesList(inactiveRegistries);

          const inactiveMembersData = [];
        for (let member of inactiveMembers) {
          const registroCompleto = registryMap.get(member.id);
          if (!registroCompleto) continue;
          const endDate = registroCompleto.endData
            ? new Date(registroCompleto.endData).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : '-';

          inactiveMembersData.push([
            member.name,
            `${member.lastName1} ${member.lastName2}`,
            member.memberNumber,
            endDate,                     
            registroCompleto.reasonEnd?.trim() || '-'
          ]);
        }


          this.setExportData(
            inactiveMembersData,
            ["Nombre", "Apellidos", "Nº Socio", "Fecha Baja", "Motivo Inactividad"],
            `Histórico de ${memberAttribute.attribute}s Inactivos.xlsx`
          );

          genericExportButton.style.display = 'block';
          
        } finally {}
        break;
      }
      case 'button4': {
        try {
          const mainTableContainer = document.getElementById('main-table-container');
          if (mainTableContainer) mainTableContainer.style.display = 'none';
          const activitiesContainer = document.getElementById('activities-list-container');
          if (activitiesContainer) activitiesContainer.style.display = 'block';
          const allActivities = await RequestGet.getActivitys(this.currentYear);
          this.actividadesConMiembros = await this.getActividadesConMiembros(allActivities);
          this.renderActivityListWithMembers(this.actividadesConMiembros);
          genericExportButton.style.display = 'none';
        } finally {}
        break;
      }
      case 'button5': {
        //ListsManager.showLoading();
        document.getElementById('spinner').style.display = 'block';
        try {
          titleElement.textContent = 'Listado Años Pagados';
          document.getElementById('sortByMemberNumberPayList').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
          document.getElementById('year').textContent = 'AÑO PAGADO';
          const allMembersPay = await RequestGet.getListMembersActives();
          this.renderPayList(allMembersPay);
          //this.setupPaySorting(allMembersPay);
          const paidMembersData = [];
          const chunkSize = 25; // Puedes ajustar el tamaño del lote

          for (let i = 0; i < allMembersPay.length; i += chunkSize) {
            // Se obtiene un trozo (chunk) del array de miembros activos
            const chunk = allMembersPay.slice(i, i + chunkSize);

            // Se crea un array de promesas para el lote actual
            const promises = chunk.map(async (member) => {
              try {
                const paidYears = await this.getPaidYears(member.id);
                // Se devuelve un array con los datos del miembro y sus años pagados
                return [member.name, `${member.lastName1} ${member.lastName2}`, member.memberNumber, paidYears.join(', ')];
              } catch (error) {
                console.error(`Error procesando socio ${member.id}:`, error);
                // En caso de error, se devuelve un valor por defecto
                return [member.name, `${member.lastName1} ${member.lastName2}`, member.memberNumber, 'Error'];
              }
            });

            // Se espera a que todas las promesas del lote terminen antes de continuar
            const batchResults = await Promise.all(promises);
            // Se añaden los resultados del lote al array principal
            paidMembersData.push(...batchResults);
          }
          
          this.setExportData(
            paidMembersData,
            ["Nombre", "Apellidos", "Nº Socio", "Años Pagados"],
            `Listado de Socios de ${memberAttribute.attribute}s.xlsx`
          );
          genericExportButton.style.display = 'block';

        } finally {}
        break;
      }
case 'button6': {
        document.getElementById('spinner').style.display = 'block';
        try {
          titleElement.textContent = 'Listado de Impagos';
          document.getElementById('sortByMemberNumberPayList').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
          document.getElementById('year').textContent = 'ÚLTIMO AÑO PAGADO';

          const unpayMembers = await RequestGet.getListMembersActives();
          this.renderUnpayList(unpayMembers);
          this.setupUnpaySorting(unpayMembers);
          
          const unpayMembersFiltered = [];
          const chunkSize = 50; // Puedes ajustar el tamaño del lote según tus pruebas
          
          for (let i = 0; i < unpayMembers.length; i += chunkSize) {
            const chunk = unpayMembers.slice(i, i + chunkSize);

            const promises = chunk.map(async (member) => {
              try {
                const paidYears = await this.getPaidYears(member.id);
                const hasPaidThisYear = paidYears.includes(this.currentYear);
                
                if (!hasPaidThisYear) {
                  const lastPaidYear = await this.getLastPaidYear(member.id);
                  unpayMembersFiltered.push([
                    member.name,
                    `${member.lastName1} ${member.lastName2}`,
                    member.memberNumber,
                    lastPaidYear,
                  ]);
                }
              } catch (error) {
                console.error(`Error procesando socio ${member.id}:`, error);
              }
            });
            await Promise.all(promises);
          }
          
          this.setExportData(
            unpayMembersFiltered,
            ["Nombre", "Apellidos", "Nº Socio", "Último Año Pagado"],
            `Listado de Impagos de ${memberAttribute.attribute}s.xlsx`
          );
          genericExportButton.style.display = 'block';

        } finally {
        }
        break;
      }
      case 'button7': {
        document.getElementById('spinner').style.display = 'block';
        try {
          const titleElement = ListsManager.getInput('txtTitleList');
          const memberAttribute = await RequestGet.getConfigById(3);
          titleElement.textContent = `Antigüedad de los/as ${memberAttribute.attribute}(s) activos/as`;
          ListsManager.getInput('sortByMemberNumber').textContent = `Nº ${memberAttribute.attribute.toUpperCase()}`;
          this.setListTitles('antiguedad');
          
          const activeMembersAntiguedad = await RequestGet.getListMembersActives();
          const tbody = document.getElementById('tbody-member');
          tbody.innerHTML = '';
          
          const allRegistries = await RequestGet.getResgistries();
          const registryMap = new Map();
          allRegistries.forEach(reg => {
            if (reg.memberId) {
              const current = registryMap.get(reg.memberId);
              if (!current || new Date(reg.startData) < new Date(current.startData)) {
                registryMap.set(reg.memberId, reg);
              }
            }
          });
          
          const activeMembersGrouped = {};
          for (const member of activeMembersAntiguedad) {
            const registry = registryMap.get(member.id);
            const firstActiveDate = registry?.startData
              ? new Date(registry.startData).toLocaleDateString('es-ES', { day:'2-digit', month:'2-digit', year:'numeric' })
              : "-";
            const antiguedad = ListsManager.getAntiguedad(firstActiveDate);
            const key = `Antigüedad de ${antiguedad} año${antiguedad === 1 ? '' : 's'}`;
            if (!activeMembersGrouped[key]) activeMembersGrouped[key] = [];
            activeMembersGrouped[key].push({ ...member, antiguedad, firstActiveDate });
          }

          const sortedAntiguedadKeys = Object.keys(activeMembersGrouped).sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)[0]);
            const numB = parseInt(b.match(/\d+/)[0]);
            return numB - numA;
          });
          
          let totalSocios = 0;
          let htmlContent = '';

          for (const antiguedadKey of sortedAntiguedadKeys) {
            const grupo = activeMembersGrouped[antiguedadKey].sort((a, b) => String(a.memberNumber).localeCompare(String(b.memberNumber)));
            
            const count = grupo.length;
            const groupTitle = `${count} ${memberAttribute.attribute}/s con ${antiguedadKey.toLowerCase()} ▼`;
            const groupId = antiguedadKey.replace(/\s/g, '-'); // Crear un ID para el grupo

            // Fila del encabezado del grupo que se puede pulsar para desplegar


          htmlContent += `<tr class="group-row toggle-group" data-target="${groupId}">
            <td colspan="8" style="font-weight:bold; font-size:1.2rem; background:#f0f0f0; cursor:pointer">
              ${groupTitle}
              <span id="export-button-container-${groupId}" style="float:right;"></span>
            </td>
          </tr>`;


            // Filas de los miembros dentro de un div con un ID para poder mostrar/ocultar
            htmlContent += `<tr id="${groupId}" class="group-content" style="display: none;"><td colspan="8"><table class="sub-table">`;
            for (let i = 0; i < grupo.length; i++) {
                const member = grupo[i];
                totalSocios++;
                htmlContent += `<tr class="clickable-row" data-member-number="${member.memberNumber}">
                                <td>#</td>
                                <td>${member.name}</td>
                                <td>${member.lastName1} ${member.lastName2}</td>
                                <td>${member.memberNumber}</td>
                                <td>${member.firstActiveDate}</td>
                            </tr>`;
            }
            htmlContent += `</table></td></tr>`;
          }
          
          tbody.innerHTML = htmlContent;

          //Excel por grupos
          sortedAntiguedadKeys.forEach(antiguedadKey => {
          const groupId = antiguedadKey.replace(/\s/g, '-');
          const container = document.getElementById(`export-button-container-${groupId}`);
          if (container) {
            const exportBtn = document.createElement('button');
            exportBtn.className = 'button-excel-peque';
            exportBtn.textContent = '📤';
            exportBtn.style.marginLeft = '10px';
            exportBtn.addEventListener('click', () => {
              ListsManager.exportGroupToExcel(groupId, antiguedadKey);
            });
            container.appendChild(exportBtn);
          }
        });


          
          // Añadir el listener para la funcionalidad de desplegar/plegar
          document.querySelectorAll('.toggle-group').forEach(row => {
              row.addEventListener('click', function() {
                  const targetId = this.getAttribute('data-target');
                  const contentRow = document.getElementById(targetId);
                  if (contentRow) {
                      contentRow.style.display = contentRow.style.display === 'none' ? '' : 'none';
                  }
              });
          });

          this.addRowClickListeners();
          // Excel de toooodos los años
          document.getElementById('txtTitleList').textContent = `Antigüedad de Activos/as - Total ${totalSocios}`;
          this.currentListHeaders = ['#', 'Nombre', 'Apellidos', 'Nº Socio', 'Fecha Alta'];
          this.currentListData = [];

          sortedAntiguedadKeys.forEach(antiguedadKey => {
            const grupo = activeMembersGrouped[antiguedadKey].sort((a, b) => String(a.memberNumber).localeCompare(String(b.memberNumber)));
            grupo.forEach(member => {
              this.currentListData.push([
                '#',
                member.name,
                `${member.lastName1} ${member.lastName2}`,
                member.memberNumber,
                member.firstActiveDate
              ]);
            });
          });

          this.currentListFilename = 'Antigüedad_Activos.xlsx';
        } finally {


          document.getElementById('spinner').style.display = 'none';
        }
        break;
      }
    }
    if (!this.rowClickListenersAdded) {
      this.addRowClickListeners();
      this.rowClickListenersAdded = true;
    }
  }


  static exportGroupToExcel(groupId, groupName) {
    const table = document.querySelector(`#${groupId} .sub-table`);
    if (!table) return;

    const rows = Array.from(table.querySelectorAll('tr'));
    const data = rows.map(row => {
      return Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim());
    });

    const headers = ['#', 'Nombre', 'Apellidos', 'Nº Socio', 'Fecha Alta'];
    ExcelUtils.exportToExcel(data, headers, `${groupName}.xlsx`);
    }



  // ✅ renderizado incremental
  async renderList(members, allMembers) {
    const tbody = document.getElementById('tbody-member');
    tbody.innerHTML = '';
    let lineNumber = 1;
    const batchSize = 50;
    for (let i = 0; i < members.length; i += batchSize) {
      const batch = members.slice(i, i + batchSize);
      const rowsHtml = await Promise.all(
        batch.map((member, idx) => this.getHtmlRowMembers(member, lineNumber + idx))
      );
      tbody.insertAdjacentHTML('beforeend', rowsHtml.join(''));
      lineNumber += batch.length;
      await new Promise(requestAnimationFrame);
    }
    document.getElementById('txtTitleList').textContent =
      (allMembers ? "Listado Completo - Total " : "Listado de Activos/as - Total ") + (lineNumber - 1);
    document.getElementById('spinner').style.display = 'none';
    this.addRowClickListeners();
    //ListsManager.hideLoading();
  }

async renderInactivesList(members) {
  const tbody = document.getElementById('tbody-member');
  tbody.innerHTML = '';

  let lineNumber = 1;
  const batchSize = 50;

  for (let i = 0; i < members.length; i += batchSize) {
    const batch = members.slice(i, i + batchSize);
    //<td>${lineNumber + idx}</td> //
    const rowsHtml = await Promise.all(
      batch.map(async (m, idx) => {
        const endDateStr = m.endData
          ? new Date(m.endData).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : '-';

        return `
          <tr class="clickable-row" data-member-number="${m.memberNumber}">
            <td>#</td>                       
            <td>${m.name || ''}</td>                               
            <td>${(m.lastName1 || '')} ${(m.lastName2 || '')}</td> 
            <td>${m.memberNumber || ''}</td>                   
            <td></td>                                            
            <td>${endDateStr}</td>                     
            <td>${m.reasonEnd?.trim() || '-'}</td> 
          </tr>
        `;
      })
    );

    tbody.insertAdjacentHTML('beforeend', rowsHtml.join(''));
    lineNumber += batch.length;
    await new Promise(requestAnimationFrame);
  }

  document.getElementById('txtTitleList').textContent = "Histórico de Inactividad - Total " + (lineNumber - 1);
  document.getElementById('spinner').style.display = 'none';
  this.addRowClickListeners();
  //ListsManager.hideLoading();
}


async getHtmlRowMembers(member, lineNumber) {
  const activeStatus = member.active ? '✓' : 'X';
  let firstActiveDate = '-';
  try {
    firstActiveDate = (await this.getFirstActiveDate(member.id)) || '-';
  } catch (e) {
    console.error("Error fetching first active date:", e);
  }
  const lastPaidYear = await this.getLastPaidYear(member.id);
    //<td>${lineNumber}</td>
  return `
    <tr class="clickable-row" data-member-number="${member.memberNumber}">
      <td>#</td>
      <td>${member.name || ''}</td>
      <td>${(member.lastName1 || '')} ${(member.lastName2 || '')}</td>
      <td>${member.memberNumber || ''}</td>
      <td>${activeStatus}</td>
      <td>${firstActiveDate}</td>
      <td></td>
      <td>${lastPaidYear || '-'}</td>
    </tr>
  `;
}




  async renderPayList(members) {
    const tbody = document.getElementById('tbody-member');
    tbody.innerHTML = '';
    let lineNumber = 1;
    const batchSize = 50;
    for (let i = 0; i < members.length; i += batchSize) {
      const batch = members.slice(i, i + batchSize);
      const rowsHtml = await Promise.all(
        batch.map((member, idx) => this.getHtmlPayRowMembers(member, lineNumber + idx))
      );
      tbody.insertAdjacentHTML('beforeend', rowsHtml.join(''));
      lineNumber += batch.length;
      await new Promise(requestAnimationFrame);
    }
    document.getElementById('txtTitleList').textContent = "Lista de Años Pagados - Total " + (lineNumber - 1);
    document.getElementById('spinner').style.display = 'none';
    this.addRowClickListeners();
    //ListsManager.hideLoading();
  }

  async renderUnpayList(members) {
    const tbody = document.getElementById('tbody-member');
    tbody.innerHTML = '';
    let lineNumber = 1;
    const batchSize = 50;
    for (let i = 0; i < members.length; i += batchSize) {
      const batch = members.slice(i, i + batchSize);
      const rowsHtml = [];
      for (let j = 0; j < batch.length; j++) {
        const member = batch[j];
        const paidYears = await this.getPaidYears(member.id);
        if (!paidYears.includes(this.currentYear)) {
          rowsHtml.push(await this.getHtmlUnpayRowMembers(member, lineNumber));
          lineNumber++;
        }
      }
      tbody.insertAdjacentHTML('beforeend', rowsHtml.join(''));
      await new Promise(requestAnimationFrame);
    }
    document.getElementById('txtTitleList').textContent = "Lista de Impagados - Total " + (lineNumber - 1);
    document.getElementById('spinner').style.display = 'none';
    this.addRowClickListeners();
    //ListsManager.hideLoading();
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
        updatedData = await Promise.all(sortedMembers.map(async m => [m.name, m.lastName1, m.lastName2, m.memberNumber, m.active ? '✓' : 'X', await this.getFirstActiveDate(m.id), await this.getLastPaidYear(m.id)]));
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

  async getHtmlUnpayRowMembers(member, lineNumber) {
    const lastPaidYear = await this.getLastPaidYear(member.id);
    //<td>${lineNumber}</td>
    return `<tr class="clickable-row" data-member-number="${member.memberNumber}">
                <td>#</td>
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
        this.addRowClickListeners();
      });
      actividadesListaElement.appendChild(listItem);
      ListsManager.hideLoading();
      document.getElementById('spinner').style.display = 'none';
    });
  }

  async getHtmlPayRowMembers(member, lineNumber) {
    const paidYears = await this.getPaidYears(member.id);
    
    return `
      <tr class="clickable-row" data-member-number="${member.memberNumber}">
        <td>#</td>
        <td>${member.name || ''}</td>
        <td>${(member.lastName1 || '')} ${(member.lastName2 || '')}</td>
        <td>${member.memberNumber || ''}</td>
        <td>${Array.isArray(paidYears) ? paidYears.join(', ') : '-'}</td>
      </tr>
    `;
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

async getFirstActiveDate(memberId) {
  try {
    const registrys = await RequestGet.getRegistryByMemberId(memberId);
    if (Array.isArray(registrys) && registrys.length) {
      const first = registrys.reduce((min, r) =>
        (!min || new Date(r.startData) < new Date(min.startData)) ? r : min, null);
      return first?.startData
        ? new Date(first.startData).toLocaleDateString('es-ES', { day:'2-digit', month:'2-digit', year:'numeric' })
        : "-";
    }
    return "-";
  } catch (error) {
    console.error("Error al obtener la primera fecha activa:", error);
    return "-";
  }
}

  
  setExportData(data, headers, filename) {
    this.currentListData = data;
    this.currentListHeaders = headers;
    this.currentListFilename = filename;
  }

  static showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'flex';
  }

  static hideLoading() {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) overlay.style.display = 'none';
  }

  async processInBatches(members, batchSize = 100) {
    const results = [];
    for (let i = 0; i < members.length; i += batchSize) {
      const batch = members.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(async m => [
        m.name,
        m.lastName1,
        m.lastName2,
        m.memberNumber,
        m.active ? '✓' : 'X',
        await this.getFirstActiveDate(m.id),
        await this.getLastPaidYear(m.id)
      ]));
      results.push(...batchResults);
    }
    return results;
  }


  setListTitles(tipo) {
    const titulos = {
        completo: {
            apellidos: "APELLIDOS",
            activo: "ACTIVO",
            fechaAlta: "FECHA DE ALTA",
            ultimoPago: "ÚLTIMO AÑO PAGADO"
        },
        activo: {
            apellidos: "APELLIDOS",
            activo: "ACTIVO",
            fechaAlta: "FECHA DE ALTA",
            ultimoPago: "ÚLTIMO AÑO PAGADO"
        },
        inactivo: {
            apellidos: "APELLIDOS",
            motivo: "MOTIVO BAJA",
            fechaAlta: "FECHA DE BAJA"
        },
        antiguedad: {
            apellidos: "APELLIDOS",
            fechaAlta: "ANTIGÜEDAD"            
        }
    };
    const t = titulos[tipo] || titulos.completo;
    ListsManager.getInput("sortByName").textContent = t.apellidos;
    ListsManager.getInput("titleAct").textContent = t.activo;
    ListsManager.getInput("firstActiveDate").textContent = t.fechaAlta;
    ListsManager.getInput("reason").textContent = t.motivo;
    ListsManager.getInput("date").textContent = t.ultimoPago;

    if (tipo === "antiguedad") {
        ListsManager.getInput("titleAct").style.display = "none";
        ListsManager.getInput("reason").style.display = "none";
        ListsManager.getInput("date").style.display = "none";
    }
    else {
        ListsManager.getInput("titleAct").style.display = "";
        ListsManager.getInput("reason").style.display = "";
        ListsManager.getInput("date").style.display = "";
    }
  }

  static delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

}






  