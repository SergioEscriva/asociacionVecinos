import { RequestBase } from './RequestBase.js';

export class RequestDel {

    static async delActivityMember(idLong) {
        try {
            /*const activityMemberDel = {
                method: 'DELETE',
                body: JSON.stringify({ idLong }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            };*/
            // Devuelve la respuesta en formato JSON
            return await RequestBase._delRequest(`/api/activitymember/${idLong}`, idLong);
        } catch (error) {
            console.error('Error en la solicitud DEL:', error);
            throw error;
        }
    }

    static async delFee(id) {
        try {
            /*const feeDel = {
                method: 'DELETE',
                body: JSON.stringify({ id }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            };*/
            // Devuelve la respuesta en formato JSON
            return await RequestBase._delRequest(`/api/fee/${id}`, id);
        } catch (error) {
            console.error('Error en la solicitud DEL:', error);
            throw error;
        }
    }

    //REQUEST

    static async _delRequest(url, data) {
        try {
            let config = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json; ; charset=UTF-8',
                    'Authorization': sessionStorage.token
                },
                body: JSON.stringify({ data })
            }
            const response = await fetch(url, config)
            //const jsonMessage = await response.json()
            //return jsonMessage
        } catch (error) {
            console.log(error)
            return null
        }

    }
}