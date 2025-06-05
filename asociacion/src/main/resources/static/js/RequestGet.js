import { RequestBase } from './RequestBase.js';

export class RequestGet {


    static async getActivitiesByMemberId(memberId) {
        const url = "api/activitymember/member/" + memberId
        return await RequestBase._getRequest(url)

    }

    static async getMembersActivityId(activityId) {
        const url = "api/activitymember/activityId/" + activityId
        return await RequestBase._getRequest(url)

    }

    static async getMemberByNumber(memberNumber) {
        const url = "api/members/number/" + memberNumber
        return await RequestBase._getRequest(url)

    }


    static async getMemberById(memberId) {
        const url = "api/members/" + memberId
        return await RequestBase._getRequest(url)

    }


    static async getFeeByMemberId(memberId) {
        const url = "/api/fee/member/" + memberId
        return await RequestBase._getRequest(url)
    }

    static async getLastFeeByMemberId(memberId) {
        const url = "/api/fee/member/lastFee/" + memberId
        return await RequestBase._getRequest(url)
    }

    static async getFeeById(feeId) {
        const url = "/api/fee/" + feeId
        return await RequestBase._getRequest(url)
    }

    static async getFeeByDate(startDate, endDate) {
        const url = "/api/fee/member/FeesByDate/" + startDate + "/" + endDate
        return await RequestBase._getRequest(url)
    }

    static async getFeeList() {
        const url = "/api/fee/"
        return await RequestBase._getRequest(url)
    }

    static async getListMembersActives() {
        const url = "/api/members/actives"
        return await RequestBase._getRequest(url)
    }

    static async getListMembersActivesByName() {
        const url = "/api/members/actives/byName"
        return await RequestBase._getRequest(url)
    }

    static async getListMembersActivesByMemberNumber() {
        const url = "/api/members/actives/byMemberNumber"
        return await RequestBase._getRequest(url)
    }



    static async getListMembersActivesByName() {
        const url = "/api/members/actives/byName"
        return await RequestBase._getRequest(url)
    }

    static async getListMembersActivesByMemberNumber() {
        const url = "/api/members/actives/byMemberNumber"
        return await RequestBase._getRequest(url)
    }



    static async getListMembersInactives() {
        const url = "/api/members/inactives"
        return await RequestBase._getRequest(url)

    }

    static async getListMembersInactivesByName() {
        const url = "/api/members/inactives/byName"
        return await RequestBase._getRequest(url)
    }

    static async getListMembersInactivesByMemberNumber() {
        const url = "/api/members/inactives/byMemberNumber"
        return await RequestBase._getRequest(url)
    }

    static async getListMembersInactivesByName() {
        const url = "/api/members/inactives/byName"
        return await RequestBase._getRequest(url)
    }

    static async getListMembersInactivesByMemberNumber() {
        const url = "/api/members/inactives/byMemberNumber"
        return await RequestBase._getRequest(url)
    }

    static async getAllMembers() {
        const url = "/api/members"
        return await RequestBase._getRequest(url)

    }

    static async getAllMemberOrderByName() {
        const url = "api/members/byName"
        return await RequestBase._getRequest(url)
    }

    static async getAllMemberOrderByMemberNumber() {
        const url = "api/members/byMemberNumber"
        return await RequestBase._getRequest(url)
    }

    static async getPrintCard(memberNumber) {
        const url = "api/pdf/card/" + memberNumber
        return await RequestBase._getRequest(url)

    }


    static async getAllConfigs() {
        const url = "/api/configs"
        return await RequestBase._getRequest(url)

    }

    static async getConfigById(configId) {
        const url = "/api/configs/" + configId
        return await RequestBase._getRequest(url)

    }


    static async getActivityById(activityId) {
        const url = "/api/activity/" + activityId
        return await RequestBase._getRequest(url)

    }

    static async getActivitys(year) {
        const url = "/api/activity/byName/" + year
        return await RequestBase._getRequest(url)

    }


    static async getMemberByMemberNumber(memberNumber) {
        const url = "api/members/number/" + memberNumber
        return await RequestBase._getRequest(url)

    }

    static async getMemberByDni(dni) {
        const url = "api/members/checkDni/" + dni
        return await RequestBase._getRequest(url)

    }

    static async getFamilyById(id) {
        const url = "api/family/" + id
        return await RequestBase._getRequest(url)

    }

    static async getFamilyByMemberNumber(memberNumber) {
        const url = "api/family/memberNumber/" + memberNumber
        return await RequestBase._getRequest(url)

    }

    static async oneFamilyCheck(memberNumber, familyMasterNumber) {
        const url = "api/family/check/" + memberNumber + "/" + familyMasterNumber
        return await RequestBase._getRequest(url)
    }

    static async checkActivity(checkedStatus) {
        const url = "api/registry/" + checkedStatus
        return await RequestBase._getRequest(url)
    }

    static async getRegistryById(registryId) {
        const url = "/api/registry/" + registryId
        return await RequestBase._getRequest(url)
    }

    static async getRegistryByMemberId(registryId) {
        const url = "/api/registry/member/" + registryId
        return await RequestBase._getRequest(url)
    }

    static async getResgistries() {
        const url = "/api/registry"
        return await RequestBase._getRequest(url)
    }

}