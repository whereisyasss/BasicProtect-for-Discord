const db = require('quick.db')
const { checkWl } = require('../build/functions')

module.exports = async (client, channel) => {
  
    const audit = (await channel.guild.fetchAuditLogs()).entries.first()
    if (audit?.executor?.id == client.user.id) return    

    let isOn = await db.fetch(`config.${channel.guild.id}.antichanneldelete`)

    if (isOn == true) {
        // check if whitelisted
        if (await checkWl(audit?.executor, channel.guild) == false) {
            if (audit?.action !== "CHANNEL_DELETE") return
            if (audit?.executor?.id == channel?.guild?.ownerId) return
            // check action
            if ((audit.action == "CHANNEL_DELETE" || audit.action == "CHANNEL_OVERWRITE_DELETE")) {
                // create a new channel with all the features of the channel that has been deleted
                        channel.guild.channels.create(channel.name).then(chan => {
                            chan.edit({
                            type: channel?.type,
                            topic: channel?.topic,
                            position: channel?.position || 0,
                            parent: channel?.parent,
                            nsfw: channel?.nsfw
                        })
                    })
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
        