import { MembersManager } from './MembersManager.js'
//import { ActivityMemberManager } from './ActivityMemberManager.js';
//import { ActivityManager } from './ActivityManager.js';
import { Listeners } from './Listeners.js';

//window.addEventListener('load', async () => {
document.addEventListener('DOMContentLoaded', function () {
    const membersManager = new MembersManager()
    // ActivityMemberManager.setupActivityListeners();
    // ActivityManager.setupActivityListeners();
    Listeners.init();
    membersManager.init()
})