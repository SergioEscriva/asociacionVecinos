import { MembersManager } from './MembersManager.js';
import { ActivityManager } from './ActivityManager.js';
import { Listeners } from './Listeners.js';

function initMemberIndex() {
    const membersManager = new MembersManager();
    Listeners.init();
    membersManager.init();
    console.log("MemberIndex initialized");
}

function initActivityIndex() {
    const activityManager = new ActivityManager();
    //Listeners.init();
    activityManager.init();
    console.log("ActivityIndex initialized");
}

export { initMemberIndex };
export { initActivityIndex };