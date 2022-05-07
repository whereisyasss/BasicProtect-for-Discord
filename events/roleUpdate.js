const db = require('quick.db')
const { checkWl } = require('../build/functions')

module.exports = async (client, oldRole, newRole) => {
  
    const audit = (await oldRole.guild.fetchAuditLogs()).entries.first()
    if (audit?.executor?.id == client.user.id) return    

    let isOn = await db.fetch(`config.${oldRole.guild.id}.antiroleupdate`)

    if (isOn == true) {
        // check action
        if (audit?.action !== "ROLE_UPDATE") return
        if (audit?.executor?.id == oldRole?.guild?.ownerId) return
        // check if whitelisted
        if (await checkWl(audit?.executor, oldRole.guild) == false) {
            if (audit.action == 'ROLE_UPDATE') {
                // edit
                newRole.edit({
                    name: oldRole?.name,
                    color: oldRole?.color,
                    position: oldRole?.position,
                    permissions: oldRole?.permissions,
                    hoist: oldRole?.hoist,
                    mentionable: oldRole?.mentionable
                })
                    .then(
                        // derank executor :)
                        oldRole.guild.members.resolve(audit.executor).roles.cache.forEach(role => {
                        if (role.name !== '@everyone') {
                            oldRole.guild.members.resolve(audit.executor).roles.remove(role).catch(err => {throw err})
                        }
                    }))  
                } else {
                    return
                }
        }
    }
}
