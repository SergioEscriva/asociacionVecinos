export class RequestDel {

    static async delActivityMember(idLong) {
        try {
            const activityMemberDel = {
                method: 'DELETE',
                body: JSON.stringify({ idLong }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            };
            // Devuelve la respuesta en formato JSON
            return await RequestDel._delRequest(`/api/activitymember/${idLong}`, activityMemberDel);
        } catch (error) {
            console.error('Error en la solicitud DEL:', error);
            throw error;
        }
    }

    static async delFee(id) {
        try {
            const feeDel = {
                method: 'DELETE',
                body: JSON.stringify({ id }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            };
            // Devuelve la respuesta en formato JSON
            return await RequestDel._delRequest(`/api/fee/${id}`, feeDel);
        } catch (error) {
            console.error('Error en la solicitud DEL:', error);
            throw error;
        }
    }

    //REQUEST

    static async _delRequest(url, data) {
        try {
            const response = await fetch(url, data)
            //const jsonMessage = await response.json()
            //return jsonMessage
        } catch (error) {
            console.log(error)
            return null
        }

    }
}