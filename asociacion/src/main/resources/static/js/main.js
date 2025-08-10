import { ActivityManager } from './managers/ActivityManager.js';
import { ConfigManager } from './managers/ConfigManager.js';
import { Listeners } from './utils/Listeners.js';
import { MembersManager } from './managers/MembersManager.js';
import { ListsManager } from './managers/ListsManager.js';
import { SignedManager } from './managers/SignedManager.js';
import { RequestGet } from './api/RequestGet.js';
import { FeesByDate } from './managers/FeesByDateManager.js';

// Función genérica para inicializar cualquier manager
async function initializeManager(ManagerClass, ...args) {
    const manager = new ManagerClass();
    await manager.init(...args);
    return manager;
}

// Funciones de inicialización que usan la función genérica
async function initMemberIndex(memberId = null) {
    const membersManager = await initializeManager(MembersManager, memberId);
    Listeners.init();
}

async function initActivityIndex() {
    await initializeManager(ActivityManager);
}

async function initListsIndex() {
    await initializeManager(ListsManager);
}

async function initFeesByDateIndex() {
    await initializeManager(FeesByDate);
}

async function initConfigIndex() {
    await initializeManager(ConfigManager);
}

async function initSignIndex() {
    await initializeManager(SignedManager);
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
        document.getElementById('button7').textContent = "Firma Documentos";
    } catch (error) {
        console.error('Error en la configuración inicial del módulo:', error);
    }
})();

export { initActivityIndex, initListsIndex, initMemberIndex, initConfigIndex, initFeesByDateIndex, initSignIndex};