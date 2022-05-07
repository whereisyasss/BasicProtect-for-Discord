const db = require('quick.db');
const { DEFAULT_PREFIX, OWNER_ID } = require('../../config.json');
const { Embed } = require('../../build/functions');
let prefix = ''

module.exports.run = async (client, message, args) => {

    let prefix = await db.get(`config.${message.guild.id}.prefix`)

    if (prefix == undefined || prefix == null) prefix = DEFAULT_PREFIX

    if (!message.author) return
    if (message.author.id !== OWNER_ID) return Embed(message.author, `Sorry **${message.author.username}** you must be the owner to use this command.`, message.channel, '')
    let desc = ''

    if (!args[0]) {
        let status = await db.get(`config.${message.guild.id}.antiwebhook`)
        if (status == true) {
            desc = `AntiWebhook **On** !`
        } else if (status == false) {
            desc = `AntiWebhook **Off** !`
        } else if (status == undefined) {
            desc = `Your AntiWebhook is **not configured** !`
        }
        Embed(message.author, desc, message.channel, `AntiWebhook`)
    }
    if (args[0]) {
        if (args[0] == 'on') {
            db.set(`config.${message.guild.id}.antiwebhook`, true)
            Embed(message.author, `**AntiWebhook** has been **activated** successfully !`, message.channel, '')
        } else if (args[0] == 'off') {
            db.set(`config.${message.guild.id}.antiwebhook`, false)
            Embed(message.author, `**AntiWebhook** has been **disabled** successfully !`, message.channel, '')
        } else {
            return message.reply(`invalid parameters`)
        }
    }
}

module.exports.help = {
    name: "antiwebhook",
    aliases: [""],
    category: "protection",
    usage: `${prefix}antiwebhook on/off`,
    description: "Enables or disables AntiWebhook", 
    cooldown: 5
}