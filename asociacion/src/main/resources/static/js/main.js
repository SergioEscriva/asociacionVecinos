import { MembersManager } from './MembersManager.js'
import { Listeners } from './Listeners.js';
import { FeeManager } from './FeeManager.js';

//window.addEventListener('load', async () => {
document.addEventListener('DOMContentLoaded', function () {
    const membersManager = new MembersManager()
    Listeners.init();
    membersManager.init()
})