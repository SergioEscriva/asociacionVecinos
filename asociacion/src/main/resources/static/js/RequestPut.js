
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
      return await _putRequest(`/api/family/${familyTypeId}`, response);
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
      // Devuelve la respuesta en formato JSON
      alert("Cambios Guardados")
      return await _putRequest(`/api/members/${memberId}`, response);
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
