import { RequestGet } from './RequestGet.js';
import { Utility } from './Utility.js';

export class ConfigManager {

  constructor() {

  }

  async init() {
    const response = await RequestGet.getAllConfigs()
    this.renderList(response)

    // document.addEventListener('DOMContentLoaded', function () {
    // const inputs = document.querySelectorAll('input[id^="atributo-"]');
    // inputs.forEach(input => {
    // input.addEventListener('blur', function () {
    //  ConfigManager.showInputValue(this);
    //  });
    // });
    // });

  }

  async renderList(configs) {
    let html = ''
    for (let config of configs) {
      html += this.getHtmlRowConfigs(config)
    }
    let tbody = document.getElementById('tbody-config')
    tbody.innerHTML = html

    for (let config of configs) {
      this.fillInputs(config);
      const input = document.getElementById(`atributo-${config.id}`);
      input.addEventListener('blur', function () {
        ConfigManager.showInputValue(this);
      });
    }

  }

  getHtmlRowConfigs(config) {
    return `<tr>
                <td><input type="checkbox" id="active-${config.id}" name="active-${config.id}"></td>
                <td>${config.configOption}</td>
                <td><input type="text" id="atributo-${config.id}" name="atributo-${config.id}" value="${config.attribute}"></td>
            </tr>`
  }

  fillInputs(config) {
    let checkbox = document.getElementById(`active-${config.id}`)
    if (config.active) {
      checkbox.checked = true
    }

  }

  static showInputValue(input) {
    if (!input.hasShownAlert) {
      alert("Valor introducido: " + input.value);
      input.hasShownAlert = true;
    }
  }



}