const db = require('quick.db');
const Discord = require('discord.js');
const {DEFAULT_PREFIX, DEFAULT_COLOR} = require('../../config.json');
let prefix = ''

module.exports.run = async (client, message, args) => {

    let prefix = await db.get(`config.${message.guild.id}.prefix`)

    if (prefix == undefined || prefix == null) prefix = DEFAULT_PREFIX

    if (!message.author) return
    
    const HEmbed = new Discord.MessageEmbed()
    .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setDescription(`Hello I'm **Basic Protect by Zitiix**, I allows you to secure your server with 8 commands of protection.`)
    .addField(`● Protection`, "`antichannelcreate`, `antichanneldelete`, `antichannelupdate`, `antilink`, `antirolecreate`, `antiroledelete`, `antiroleupdate`, `antiwebhook`")
    .addField(`● Whitelist`, "`whitelist`")
    .addField(`● Info`, "`help`")
    .setColor(DEFAULT_COLOR)
    .setFooter(`Basic Protect by Zitiix`)
    
    message.reply({ embeds: [HEmbed]})
}

module.exports.help = {
    name: "help",
    aliases: ["h"],
    category: "info",
    usage: `${prefix}help`,
    description: "Allows you to see the available commands", 
    cooldown: 5
}