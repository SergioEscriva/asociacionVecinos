import { ActivityManager } from './managers/ActivityManager.js';
import { ConfigManager } from './managers/ConfigManager.js';
import { Listeners } from './utils/Listeners.js';
import { MembersManager } from './managers/MembersManager.js';
import { ListsManager } from './managers/ListsManager.js';
import { SignedManager } from './managers/SignedManager.js';
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
    //const activityManager = new ActivityManager();
    ActivityManager.init()
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

function initSignIndex() {
    const signedManager = new SignedManager();
    signedManager.init()
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
    const elementoFecha = document.getElementById('fecha');
    if (elementoFecha) {
        elementoFecha.innerText = fechaFormateada;
    }
}

// Lógica asíncrona al cargar el módulo
(async () => {
    try {
        const [memberAttribute, titleAttribute, backImage] = await Promise.all([
            RequestGet.getConfigById(3),
            RequestGet.getConfigById(1),
            RequestGet.getConfigById(9)
        ]);

        mostrarFecha();
        document.getElementById('backImage').src = backImage.attribute;
        document.getElementById('title').textContent = titleAttribute.attribute;
        document.getElementById('button1').textContent = "Listado de " + memberAttribute.attribute + "(s)";
        document.getElementById('button2').textContent = "Listado de activo/a(s)";
        document.getElementById('button3').textContent = "Histórico de Inactividad";
        
    } catch (error) {
        console.error('Error en la configuración inicial del módulo:', error);
    }
})();

export { initActivityIndex, initListsIndex, initMemberIndex, initConfigIndex, initFeesByDateIndex, initSignIndex};