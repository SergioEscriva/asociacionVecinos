import { ActivityManager } from './ActivityManager.js';
import { ConfigManager } from './ConfigManager.js';
import { Listeners } from './Listeners.js';
import { MembersManager } from './MembersManager.js';
import { ListsManager } from './listsManager.js';
import { RequestGet } from './RequestGet.js';
import { FeesByDate } from './FeesByDate.js';



function initMemberIndex() {
    const membersManager = new MembersManager();

    membersManager.init()
        .then(() => {
            Listeners.init();
        })
        .catch(error => {
            console.error('Error initializing MembersManager:', error);
        });
}

function initActivityIndex() {
    const activityManager = new ActivityManager();
    activityManager.init()
        .then(() => {

        })
        .catch(error => {
            console.error('Error initializing MembersManager:', error);
        });
}


function initListsIndex() {
    const listsManager = new ListsManager();
    listsManager.init()
        .then(() => {

        })
        .catch(error => {
            console.error('Error initializing:', error);
        });
}

function initFeesByDateIndex() {
    const feesByDate = new FeesByDate();
    feesByDate.init()
        .then(() => {

        })
        .catch(error => {
            console.error('Error initializing FeesByDate', error);
        });
}

function initConfigIndex() {
    const configManager = new ConfigManager();
    configManager.init()
        .then(() => {

        })
        .catch(error => {
            console.error('Error initializing:', error);
        });
}

function mostrarFecha() {
    const fechaActual = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const fechaFormateada = fechaActual.toLocaleDateString('es-ES', opciones);
    document.getElementById('fecha').innerText = fechaFormateada;
}

mostrarFecha()

// Variables config

const memberAttribute = await RequestGet.getConfigById(3)
const titleAttribute = await RequestGet.getConfigById(1)
document.getElementById('title').textContent = titleAttribute.attribute;
document.getElementById('button1').textContent = "Todos los " + memberAttribute.attribute + "(s)";
document.getElementById('button2').textContent = memberAttribute.attribute + "(s) activo/a(s)";
//document.getElementById('button3').textContent = memberAttribute.attribute + "(s) inactivo/a(s)";
document.getElementById('button3').textContent = "Histórico inactivo/a(s)";



export { initActivityIndex, initListsIndex, initMemberIndex, initConfigIndex, initFeesByDateIndex };

