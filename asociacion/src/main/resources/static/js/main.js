import { MembersManager } from './MembersManager.js';
import { Listeners } from './Listeners.js';

function initMemberIndex() {
    const membersManager = new MembersManager();
    Listeners.init();
    membersManager.init();
    console.log("MemberIndex initialized");
}

export { initMemberIndex };