

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
      return await _putRequest(`/api/family`, response);
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
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
      return await _postRequest(`/api/members`, response);
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