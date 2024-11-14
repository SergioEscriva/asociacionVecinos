import { MembersManager } from './MembersManager.js'

window.addEventListener('load', async () => {
    const membersManager = new MembersManager()
    await membersManager.init()
})