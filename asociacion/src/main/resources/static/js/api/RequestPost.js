import { RequestBase } from './RequestBase.js';

export class RequestPost {

  static async newFamily(familyUpdate) {
    try {
      /*const response = {
        method: "POST",
        body: JSON.stringify(familyUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };*/
      // Devuelve la respuesta en formato JSON
      return await RequestBase._postRequest(`/api/family`, response);
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      throw error;
    }
  }

  static async newActivity(activityUpdate) {

    try {
      /*const response = {
        method: "POST",
        body: JSON.stringify(activityUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };*/
      // Devuelve la respuesta en formato JSON
      return await RequestBase._postRequest(`/api/activity`, activityUpdate);
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      throw error;
    }
  }


  static async newActivityMember(activityMemberUpdate) {

    try {
      /*const response = {
        method: "POST",
        body: JSON.stringify(activityMemberUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };*/
      // Devuelve la respuesta en formato JSON
      return await RequestBase._postRequest(`/api/activitymember`, activityMemberUpdate);
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      throw error;
    }
  }

  static async newMember(memberUpdate) {

    try {
      /*const response = {
        method: "POST",
        body: JSON.stringify(memberUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };*/
      // Devuelve la respuesta en formato JSON
      alert("Añadido")
      return await RequestBase._postRequest(`/api/members`, memberUpdate);
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      throw error;
    }
  }

  static async newFee(feeUpdate) {

    try {
      /*const response = {
        method: "POST",
        body: JSON.stringify(feeUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };*/
      // Devuelve la respuesta en formato JSON
      return await RequestBase._postRequest(`/api/fee`, feeUpdate);
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      throw error;
    }
  }

  static async newRegistry(registryUpdate) {

    try {
      /*const response = {
        method: "POST",
        body: JSON.stringify(registryUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };*/
      // Devuelve la respuesta en formato JSON
      return await RequestBase._postRequest(`/api/registry`, registryUpdate);
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      throw error;
    }
  }

  static async _postRequest(url, data) {
    try {
      let config = {
        method: 'POST',
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