import { RequestPost } from './RequestPost.js';
import { RequestPut } from './RequestPut.js';
import { RequestDel } from './RequestDel.js';
import { RequestGet } from './RequestGet.js';


export class FeeManager {
    constructor() {

    }


    static async checkFee() {
        const button = document.getElementById('updateFee')
        const currentYear = new Date().getFullYear();
        const memberId = document.getElementById('memberId').value
        const feesMember = await RequestGet.getFeeMember(memberId)
        const exist = feesMember.some(item => item.year === currentYear); // || item.date.startsWith('2023'));
        if (exist) {
            button.classList = 'buttonFee button-green'
            button.textContent = "Sin Deudas"
        } else {
            button.classList = 'buttonFee button-red'
            button.textContent = "Con Deudas"
        }
    }


}