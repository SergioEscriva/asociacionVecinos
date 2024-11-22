import { RequestGet } from './RequestGet.js';

export class ConfigManager {

  constructor() {

  }

  async init() {
    console.log("entra")
    const response = await RequestGet.getAllConfigs()
    this.renderList(response)

  }

  async renderList(configs) {
    let html = '';
    for (let config of configs) {
      html += this.getHtmlRowConfigs(config);
    }

    let tbody = document.getElementById('tbody-config');
    tbody.innerHTML = html;
  }

  getHtmlRowConfigs(config) {
    return `<tr>
                <td>${config.active} </td>
                <td>${config.option} </td>
                <td>${config.notes}</td>

            </tr>`;

  }


}



