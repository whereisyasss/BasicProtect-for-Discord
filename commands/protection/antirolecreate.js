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
        let status = await db.get(`config.${message.guild.id}.antirolecreate`)
        if (status == true) {
            desc = `AntiRoleCreate **On** !`
        } else if (status == false) {
            desc = `AntiRoleCreate **Off** !`
        } else if (status == undefined) {
            desc = `Your AntiRoleCreate is **not configured** !`
        }
        Embed(message.author, desc, message.channel, `AntiRoleCreate`)
    }
    if (args[0]) {
        if (args[0] == 'on') {
            db.set(`config.${message.guild.id}.antirolecreate`, true)
            Embed(message.author, `**AntiRoleCreate** has been **activated** successfully !`, message.channel, '')
        } else if (args[0] == 'off') {
            db.set(`config.${message.guild.id}.antirolecreate`, false)
            Embed(message.author, `**AntiRoleCreate** has been **disabled** successfully !`, message.channel, '')
        } else {
            return message.reply(`invalid parameters`)
        }
    }
}

module.exports.help = {
    name: "antirolecreate",
    aliases: [""],
    category: "protection",
    usage: `${prefix}antirolecreate on/off`,
    description: "Enables or disables AntiRoleCreate", 
    cooldown: 5
}