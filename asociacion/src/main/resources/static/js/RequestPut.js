
export class RequestPut {

  static async editFamily(familyTypeId, familyUpdate) {

    try {
      const response = {
        method: "PUT",
        body: JSON.stringify(familyUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      // Devuelve la respuesta en formato JSON
      return await RequestPut._putRequest(`/api/family/${familyTypeId}`, response);
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
      throw error;
    }
  }

  static async editActivity(activityId, activityUpdate) {

    try {
      const response = {
        method: "PUT",
        body: JSON.stringify(activityUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      // Devuelve la respuesta en formato JSON
      return await RequestPut._putRequest(`/api/activity/${activityId}`, response);
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
      throw error;
    }
  }

  static async editMember(memberId, memberUpdate) {

    try {
      const response = {
        method: "PUT",
        body: JSON.stringify(memberUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return await RequestPut._putRequest(`/api/members/${memberId}`, response);
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
      throw error;
    }
  }

  static async editConfig(configId, configUpdate) {

    try {
      const response = {
        method: "PUT",
        body: JSON.stringify(configUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return await RequestPut._putRequest(`/api/configs/${configId}`, response);
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
      throw error;
    }
  }

  static async editRegistry(registryId, registryUpdate) {

    try {
      const response = {
        method: "PUT",
        body: JSON.stringify(registryUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return await RequestPut._putRequest(`/api/registry/${registryId}`, response);
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
      throw error;
    }
  }

  static async _putRequest(url, data) {
    try {
      const response = await fetch(url, data);
      const jsonMessage = await response.json();
      return jsonMessage;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

}
