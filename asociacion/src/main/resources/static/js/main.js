import { ActivityManager } from './ActivityManager.js';
import { ConfigManager } from './ConfigManager.js';
import { Listeners } from './Listeners.js';
import { MembersManager } from './MembersManager.js';
import { ListsManager } from './listsManager.js';



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

export { initActivityIndex, initListsIndex, initMemberIndex, initConfigIndex };

