import { RequestGet } from './RequestGet.js';

export class FeesByDate {
    constructor() {

    }


    async init() {

        const sendDateBtn = document.getElementById("sendDateBtn")
        
        sendDateBtn.addEventListener("click", function () {
            
            const date = document.getElementById("date").value;

            
            
            FeesByDate.findByDate(date);
        });

    }

    static async findByDate(date) {
        let response = await RequestGet.getFeesByDate(date)
        FeesByDate.renderList(response)

    }
    static async renderList(members) {
        let html = '';
        for (let member of members) {
          html += await FeesByDate.getHtmlPayRowMembers(member);
        }
    
        let tbody = document.getElementById('tbody-member');
        tbody.innerHTML = html;
      }
    
    static async getHtmlPayRowMembers(member) {
    
        const person = await RequestGet.getMemberById(member.memberId)
        return `<tr>
                    <td>${person.name} </td>
                    <td>${person.lastName1} ${person.lastName2} </td>
                    <td>${person.memberNumber}</td>
                    <td>${member.year}</td>
    
                </tr>`;
    
      }

























}