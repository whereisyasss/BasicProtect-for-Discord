const db = require('quick.db');
const { checkWl } = require('../build/functions');

module.exports = async (client, channel) => {
  
    const audit = (await channel.guild.fetchAuditLogs()).entries.first()
    if (audit?.executor?.id == client.user.id) return    

    let isOn = await db.fetch(`config.${channel.guild.id}.antichannelcreate`)

    if (isOn == true) {
        // check action
        if (audit?.action !== "CHANNEL_CREATE") return
        // check if whitelisted
        if (await checkWl(audit?.executor, channel.guild) == false) {
            if (audit?.executor?.id == channel?.guild?.ownerId) return // if the action was carried out by the owner, nothing is done 
            if ((audit.action == "CHANNEL_CREATE" || audit.action == "CHANNEL_OVERWRITE_CREATE")) {
                    channel.delete()
                        .then(
                            channel.guild.members.resolve(audit.executor).roles.cache.forEach(role => { 
                            if (role.name !== '@everyone') {
                                channel.guild.members.resolve(audit.executor).roles.remove(role).catch(err => {throw err}) // derank
                            }
                        }))
            } else {
                return
            }
        }
    }
}
        
