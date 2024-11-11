
export class RequestPut{


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
        return await _putRequest(`/api/members/${memberId}`, response);
    } catch (error) {
        console.error('Error en la solicitud PUT:', error);
        throw error;
    }
  }


    //REQUEST
    
   static async  _putRequest(url, data) {
      try {
        const response = await fetch(url, data);
        const jsonMessage = await response.json();
        alert("Cambios Guardados")
        return jsonMessage;
      } catch (error) {
        console.log(error);
        return null;
      }
    }
  }
