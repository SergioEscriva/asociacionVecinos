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


}
