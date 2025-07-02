import { ActivityMemberManager } from "../managers/ActivityMemberManager.js";
import { MembersManager } from "../managers/MembersManager.js";
import { RegistryManager } from "../managers/RegistryManager.js";
import { RequestGet } from "../api/RequestGet.js";
import { Utility } from "./Utility.js";

export class Listeners {
    constructor() {


    }

    static async init() {
        this.setupActivityManagerListeners()
        this.setupCheckActiveManagerListeners()
        this.listeningActividadesMember()
        this.listeningMember()

    }

    static setupCheckActiveManagerListeners() {

        const activeSel = document.getElementById("active")
        activeSel.addEventListener('click', async (event) => {
            const checkedStatus = event.target.checked
            const checkbox = document.querySelector('input[data-memberby-id]');
            const memberId = checkbox.getAttribute('data-memberby-id');

            if (checkedStatus) {
                RegistryManager.checkActivityTrue(memberId)
            } else {
                RegistryManager.checkActivityFalse(memberId)
            }
        });
    }

    static setupActivityManagerListeners() {
        const activitySel = document.getElementById("ul-activity-member");

        activitySel.addEventListener('click', async (event) => {
            const target = event.target;
            const li = target.closest('li');
            if (!li) return;
            const activityId = li.dataset.activityId;
            const memberId = document.getElementById('memberId').value;
            const activities = await RequestGet.getActivitiesByMemberId(memberId)
            const activityInMember = activities.find(activityOne => activityOne.activityId == activityId)
            const activityIdLong = activityInMember.idLong

            if (target.classList.contains('delete-button') || target.closest('.delete-button')) {
                Utility.delMemberOfActivityMember(memberId, activityIdLong, li);
            } else if (target.tagName === 'LABEL') {
                const activityLink = document.querySelector('a[data-section="activityIndex"]');
                if (activityLink) {
                    activityLink.setAttribute('data-activity-id', activityId)
                    activityLink.click();
                }
            }

        });
    }

    static setupActivityListeners() {
        const activitySel = document.getElementById("ul-activity-member");

        activitySel.addEventListener('click', async (event) => {
            const target = event.target;
            const li = target.closest('li');
            if (!li) return;
            const memberId = li.dataset.activityId;
            const activityId = document.getElementById('activityId')

            if (target.classList.contains('delete-button') || target.closest('.delete-button')) {
                Utility.delMemberOfActivity(memberId, activityId.value, li);
            } else if (target.tagName === 'LABEL') {

                const memberLink = document.querySelector('a[data-section="memberIndex"]');
                if (memberLink) {
                    memberLink.setAttribute('data-member-id', memberId)
                    memberLink.click();
                }
            }
        });
    }

    static listeningActividadesMember() {
        // Listening desplegable Option
        const select1 = document.getElementById('activity-select')
        select1.replaceWith(select1.cloneNode(true)); // elimina envents anteriores

        const handleChange1 = async (event) => {
            const { value } = event.target
            const memberId = document.getElementById('memberId').value
            await ActivityMemberManager.createActivityMemberThis(value, memberId)
            await ActivityMemberManager.getActivitiesByMemberId(memberId);
        }
        document.getElementById('activity-select').addEventListener('change', handleChange1);
    }

    static listeningMember() {
        let memberNumber = 0
        const inputFind = document.getElementById('input-find');
        const suggestionsList = document.getElementById('suggestions');

        inputFind.addEventListener('input', () => {
            const query = inputFind.value;

            if (query.length > 0) {
                fetch(`/api/members/search-member?query=${query}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.token
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        suggestionsList.innerHTML = '';
                        if (data.length > 0) {
                            data.forEach(member => {
                                const suggestionItem = document.createElement('li');
                                suggestionItem.textContent = `${member.name} ${member.lastName1} ${member.lastName2} (${member.memberNumber})`;
                                suggestionItem.addEventListener('click', () => {
                                    inputFind.value = `${member.name} ${member.lastName1} ${member.lastName2} (${member.memberNumber})`;
                                    suggestionsList.innerHTML = '';
                                    memberNumber = member.memberNumber
                                });
                                suggestionsList.appendChild(suggestionItem);
                                memberNumber = member.memberNumber
                            });
                        }
                    })
                    .catch(error => console.error('Error fetching member data:', error));
            } else {
                suggestionsList.innerHTML = '';
            }
        });

        suggestionsList.addEventListener('click', (event) => {
            if (!suggestionsList.contains(event.target) && event.target !== inputFind) {
                suggestionsList.innerHTML = '';
                MembersManager.getMemberByNumber(memberNumber);
            }
        });

    }

}

