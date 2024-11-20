import { ActivityManager } from './ActivityManager.js';
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


export { initActivityIndex, initListsIndex, initMemberIndex };

