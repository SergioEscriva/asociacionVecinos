import { RequestPost } from './RequestPost.js';
import { RequestPut } from './RequestPut.js';

export class ActivityManager {




  async algoTemporal() {

    const deleteButtons = document.querySelectorAll('.delete-button');

    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const
          li = button.parentNode;
        li.parentNode.removeChild(li);
      });
    });
  }

  static async delMemberOfActivity(memberId, activityId, li) {
    if (confirm("¿Estás seguro de que quieres borrar este elemento?")) {
      console.log(memberId, " --  ", activityId)
      li.remove();

    } else {
      console.log(memberId, " --  ", activityId)

    }
  }
}
