import { MembersManager } from './MembersManager.js'
import { ActivityMemberManager } from './ActivityMemberManager.js';

//window.addEventListener('load', async () => {
document.addEventListener('DOMContentLoaded', function () {
    const membersManager = new MembersManager()
    ActivityMemberManager.setupActivityListeners();
    membersManager.init()
})