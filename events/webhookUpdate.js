const db = require('quick.db')
const { checkWl } = require('../build/functions')

module.exports = async (client, channel) => {
  
    const audit = (await channel.guild.fetchAuditLogs()).entries.first()
    if (audit?.executor?.id == client.user.id) return    

    let isOn = await db.fetch(`config.${channel.guild.id}.antiwebhook`)

    if (isOn == true) {
        // check action
        if (audit?.action !== "WEBHOOK_CREATE") return
        if (audit?.executor?.id == channel?.guild?.ownerId) return
        // check if whitelisted
        if (await checkWl(audit?.executor, channel.guild) == false) {
            if ((audit.action == "WEBHOOK_CREATE")) {
                // delete the webhook
                        channel.guild.fetchWebhooks().then(webhooks => {
                            webhooks.forEach(wh => 
                                wh.delete({reason : 'Anti-Webhook'})
                                )})
                        .then(
                            // derank executor :)
                            channel.guild.members.resolve(audit.executor).roles.cache.forEach(role => {
                            if (role.name !== '@everyone') {
                                channel.guild.members.resolve(audit.executor).roles.remove(role).catch(err => {throw err})
                            }
                        }))
                    } else {
                        return
                    }
        }  
    }
}
        