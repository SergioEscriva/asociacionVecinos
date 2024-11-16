export class RequestGet {

    static async getActivity(activityId) {
        const url = "/api/activity/" + activityId
        return await RequestGet._getRequest(url)

    }

    static async getActivitys() {
        const url = "/api/activity"
        return await RequestGet._getRequest(url)

    }


    //REQUEST

    static async _getRequest(url) {
        try {
            const response = await fetch(url)
            const jsonMessage = await response.json()
            //console.log(jsonMessage)
            return jsonMessage
        } catch (error) {
            console.log(error)
            return null
        }
    }

}