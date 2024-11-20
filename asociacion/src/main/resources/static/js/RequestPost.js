

export class RequestPost {

  static async newFamily(familyUpdate) {
    try {
      const response = {
        method: "POST",
        body: JSON.stringify(familyUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      // Devuelve la respuesta en formato JSON
      return await RequestPost._postRequest(`/api/family`, response);
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      throw error;
    }
  }

  static async newActivity(activityUpdate) {

    try {
      const response = {
        method: "POST",
        body: JSON.stringify(activityUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      // Devuelve la respuesta en formato JSON
      return await RequestPost._postRequest(`/api/activity`, response);
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      throw error;
    }
  }


  static async newActivityMember(activityMemberUpdate) {

    try {
      const response = {
        method: "POST",
        body: JSON.stringify(activityMemberUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      // Devuelve la respuesta en formato JSON
      return await RequestPost._postRequest(`/api/activitymember`, response);
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      throw error;
    }
  }

  static async newMember(memberUpdate) {

    try {
      const response = {
        method: "POST",
        body: JSON.stringify(memberUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      // Devuelve la respuesta en formato JSON
      alert("Añadido")
      return await RequestPost._postRequest(`/api/members`, response);
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      throw error;
    }
  }

  static async newFee(feeUpdate) {

    try {
      const response = {
        method: "POST",
        body: JSON.stringify(feeUpdate),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      // Devuelve la respuesta en formato JSON
      return await RequestPost._postRequest(`/api/fee`, response);
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      throw error;
    }
  }

  static async _postRequest(url, data) {
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