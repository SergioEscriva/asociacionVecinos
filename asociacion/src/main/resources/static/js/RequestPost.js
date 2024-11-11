

export class RequestPost{

    static async newMember(memberId, memberUpdate) {
  
        try {
            const response = {
              method: "POST",
              body: JSON.stringify(memberUpdate),
              headers: {
                'Content-Type': 'application/json'
              }
            };
            // Devuelve la respuesta en formato JSON
            return await _postRequest(`/api/members`, response);
        } catch (error) {
            console.error('Error en la solicitud POST:', error);
            throw error;
        }
      }

    //REQUEST

    static async  _postRequest(url, data) {
        try {
        const response = await fetch(url, data);
        const jsonMessage = await response.json();
        alert("Añadido")
        return jsonMessage;
        } catch (error) {
        console.log(error);
        return null;
        }
        }
}