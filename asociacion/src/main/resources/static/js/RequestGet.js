export class RequestGet {


    static async getActivitiesByMemberId(memberId) {
        const url = "api/activitymember/member/" + memberId
        return await RequestGet._getRequest(url)

    }

    static async getMembersActivityId(activityId) {
        const url = "api/activitymember/activityId/" + activityId
        return await RequestGet._getRequest(url)

    }

    static async getMemberByNumber(memberNumber) {
        const url = "api/members/number/" + memberNumber
        return await RequestGet._getRequest(url)

    }


    static async getMemberById(memberId) {
        const url = "api/members/" + memberId
        return await RequestGet._getRequest(url)

    }


    static async getFeeMember(memberId) {
        const url = "/api/fee/" + memberId
        return await RequestGet._getRequest(url)
    }

    static async getListMembersActives() {
        const url = "/api/members/actives"
        return await RequestGet._getRequest(url)
    }

    static async getListMembersInactives() {
        const url = "/api/members/inactives"
        return await RequestGet._getRequest(url)

    }

    static async getAllMembers() {
        const url = "/api/members"
        return await RequestGet._getRequest(url)

    }

    static async getAllConfigs() {
        const url = "/api/configs"
        return await RequestGet._getRequest(url)

    }

    static async getConfigById(configId) {
        const url = "/api/configs/" + configId
        return await RequestGet._getRequest(url)

    }


    static async getActivityById(activityId) {
        const url = "/api/activity/" + activityId
        return await RequestGet._getRequest(url)

    }

    static async getActivitys() {
        const url = "/api/activity"
        return await RequestGet._getRequest(url)

    }


    static async getMemberByMemberNumber(memberNumber) {
        const url = "api/members/number/" + memberNumber
        return await RequestGet._getRequest(url)

    }

    static async getFamilyById(id) {
        const url = "api/family/" + id
        return await RequestGet._getRequest(url)

    }

    static async getFamilyByMemberNumber(memberNumber) {
        const url = "api/family/memberNumber/" + memberNumber
        return await RequestGet._getRequest(url)

    }

    static async oneFamilyCheck(memberNumber, familyMasterNumber) {
        const url = "api/family/check/" + memberNumber + "/" + familyMasterNumber
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