
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
            return await RequestPut._putRequest(`/api/members/${memberId})`); // Devuelve la respuesta en formato JSON
        } catch (error) {
            console.error('Error en la solicitud PUT:', error);
            throw error;
        }
    }
    //REQUEST
    
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
