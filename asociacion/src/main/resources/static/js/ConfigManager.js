import { RequestGet } from './RequestGet.js';
import { Utility } from './Utility.js';

export class ConfigManager {

  constructor() {

  }

  async init() {
    const response = await RequestGet.getAllConfigs()
    this.renderList(response)

  }

  async renderList(configs) {
    let html = '';
    for (let config of configs) {
      html += this.getHtmlRowConfigs(config);
      let tbody = document.getElementById('tbody-config');
      tbody.innerHTML = html;
      this.fillInputs(config)
    }

  }

  getHtmlRowConfigs(config) {
    console.log(config)
    return `<tr>
                <td><input type="checkbox" id="active-${config.id}" name="active-${config.id}" checked="${config.active}"></td>
                <td>${config.configOption}</td>
                <td><input type="input-config" id="atributo-${config.id}" name="atributo-${config.id}"></td>
            </tr>`;
  }

  async fillInputs(config) {
    const active = document.getElementById('active-' + config.id)

    active.checked = config.active === 1

    document.getElementById('atributo-' + config.id).value = config.attribute
  }

}



