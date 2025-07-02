import { RequestBase } from './RequestBase.js';


export class RequestPut {

  static async editFamily(familyTypeId, familyUpdate) {

    try {
      /*const response = {
        method: "PUT",
        body: JSON.stringify(familyUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };*/
      // Devuelve la respuesta en formato JSON
      return await RequestBase._putRequest(`/api/family/${familyTypeId}`, familyUpdate);
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
      throw error;
    }
  }

  static async editActivity(activityId, activityUpdate) {

    try {
      /*onst response = {
        method: "PUT",
        body: JSON.stringify(activityUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };*/
      // Devuelve la respuesta en formato JSON
      return await RequestBase._putRequest(`/api/activity/${activityId}`, activityUpdate);
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
      throw error;
    }
  }

  static async editMember(memberId, memberUpdate) {

    try {
      /*const response = {
        method: "PUT",
        body: JSON.stringify(memberUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };*/
      return await RequestBase._putRequest(`/api/members/${memberId}`, memberUpdate);
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
      throw error;
    }
  }

  static async editConfig(configId, configUpdate) {

    try {
      /*const response = {
        method: "PUT",
        body: JSON.stringify(configUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };*/
      return await RequestBase._putRequest(`/api/configs/${configId}`, configUpdate);
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
      throw error;
    }
  }

  static async editRegistry(registryId, registryUpdate) {

    try {
      /*const response = {
        method: "PUT",
        body: JSON.stringify(registryUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };*/
      return await RequestBase._putRequest(`/api/registry/${registryId}`, registryUpdate);
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
      throw error;
    }
  }

  static async _putRequest(url, data) {
    try {
      let config = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.token
        },
        body: JSON.stringify(data)
      }
      const response = await fetch(url, config);
      const jsonMessage = await response.json();
      return jsonMessage;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

}
