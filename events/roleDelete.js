const db = require('quick.db')
const { checkWl } = require('../build/functions')

module.exports = async (client, role) => {
  
    const audit = (await role.guild.fetchAuditLogs()).entries.first()
    if (audit?.executor?.id == client.user.id) return    

    let isOn = await db.fetch(`config.${role.guild.id}.antiroledelete`)

    if (isOn == true) {
        // check action
        if (audit?.action !== "ROLE_DELETE") return
        if (audit?.executor?.id == role?.guild?.ownerId) return
        // check if whitelisted
        if (await checkWl(audit?.executor, role.guild) == false) {
            if (audit.action == 'ROLE_DELETE') {
                // create a new role with all features of olf role :)
                role.guild.roles.create({
                    name: role?.name,
                    color: role?.color,
                    hoist: role?.hoist,
                    permissions: role?.permissions,
                    position: role?.position,
                    mentionable: role?.mentionable,
                    reason: 'Anti-Role'
                }).then(
                    // derank executor :)
                        role.guild.members.resolve(audit.executor).roles.cache.forEach(role => {
                        if (role.name !== '@everyone') {
                            role.guild.members.resolve(audit.executor).roles.remove(role).catch(err => {throw err})
                        }
                    }))  
                } else {
                    return
                }
        }
    }
}
