import { RequestGet } from './RequestGet.js';
import { RequestPut } from './RequestPut.js';

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
        ConfigManager.showInputValue(this, config);
      });
    }

  }

  getHtmlRowConfigs(config) {
    return `<tr>
                <td><input type="checkbox" id="active-${config.id}" name="active-${config.id}"></td>
                <td>${config.configOption}</td>
                <td><input type="input-config" id="atributo-${config.id}" name="atributo-${config.id}" value="${config.attribute}"></td>
            </tr>`
  }

  fillInputs(config) {
    let checkbox = document.getElementById(`active-${config.id}`)
    if (config.active) {
      checkbox.checked = true
    }

  }

  static showInputValue(input, config) {
    if (!input.hasShownAlert) {
      if (input.value != config.attribute) {
        alert("Nuevo valor introducido: " + input.value);
        this.updateConfig(input, config)
        input.hasShownAlert = true;
      }
    }
  }

  static async updateConfig(input, config) {
    const configId = config.id

    const configUpdate = {
      configId: configId,
      configOption: config.configOption,
      active: config.active,
      attribute: input.value
    }
    await RequestPut.editConfig(configId, configUpdate)
  }

}