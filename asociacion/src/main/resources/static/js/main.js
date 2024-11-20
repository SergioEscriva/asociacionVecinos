import { MembersManager } from './MembersManager.js';
import { ActivityManager } from './ActivityManager.js';
import { Listeners } from './Listeners.js';



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

export { initMemberIndex };
export { initActivityIndex };