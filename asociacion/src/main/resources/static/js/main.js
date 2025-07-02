import { ActivityManager } from './managers/ActivityManager.js';
import { ConfigManager } from './managers/ConfigManager.js';
import { Listeners } from './utils/Listeners.js';
import { MembersManager } from './managers/MembersManager.js';
import { ListsManager } from './managers/ListsManager.js';
import { RequestGet } from './api/RequestGet.js';
import { FeesByDate } from './managers/FeesByDateManager.js';



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

const memberAttribute = await RequestGet.getConfigById(3)
const titleAttribute = await RequestGet.getConfigById(1)
const backImage = await RequestGet.getConfigById(9);
document.getElementById('backImage').src = backImage.attribute;
document.getElementById('title').textContent = titleAttribute.attribute;
document.getElementById('button1').textContent = "Listado de " + memberAttribute.attribute + "(s)";
document.getElementById('button2').textContent = "Listado de activo/a(s)";
document.getElementById('button3').textContent = "Histórico de Inactividad";




export { initActivityIndex, initListsIndex, initMemberIndex, initConfigIndex, initFeesByDateIndex };

