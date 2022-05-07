const db = require('quick.db')
const { checkWl } = require('../build/functions')

module.exports = async (client, oldChannel, newChannel) => {
  
    const audit = (await oldChannel.guild.fetchAuditLogs()).entries.first()
    if (audit?.executor?.id == client.user.id) return    

    let isOn = await db.fetch(`config.${oldChannel.guild.id}.antichannelupdate`)

    if (isOn == true) {
        // check if whitelisted
        if (await checkWl(audit?.executor, oldChannel.guild) == false) {
            // check action
            if (audit?.action !== "CHANNEL_UPDATE") return
            if (audit?.executor?.id == oldChannel?.guild?.ownerId) return
            if ((audit.action == "CHANNEL_UPDATE" || audit.action == "CHANNEL_OVERWRITE_UPDATE")) {
                // edit
                        newChannel.edit({
                            name: oldChannel?.name,
                            type: oldChannel?.type,
                            position: oldChannel?.position || 0,
                            parent: oldChannel?.parent
                        })
                        .then(
                            oldChannel.guild.members.resolve(audit.executor).roles.cache.forEach(role => {
                            if (role.name !== '@everyone') {
                                oldChannel.guild.members.resolve(audit.executor).roles.remove(role).catch(err => {throw err}) // derank
                            }
                        }))
                    } else {
                        return
                    }
        }  
    }
}
        