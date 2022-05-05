const Discord = require('discord.js');
const {DEFAULT_COLOR} = require('./../config.json');
const db = require('quick.db');

const Embed = (author, desc, channel, title = '', timeout = undefined, thumbnail='') => {
    if (!channel) return;
    let e = new Discord.MessageEmbed()
        .setAuthor(author.tag, author.displayAvatarURL({dynamic : true}))
        .setDescription(desc)
        .setColor(DEFAULT_COLOR)
        .setFooter(`Basic Protect by Zitiix`)
        .setThumbnail(author.displayAvatarURL({dynamic:true}))
    return channel.send({embeds : [e]})
}

const checkWl = async (user, guild) => {
    let wl = await db.get(`config.${guild.id}.whitelist`)
    if(wl == undefined || wl.length <= 0) return false
    else if(!Object.keys(wl).includes(user.id)) { 
        return false
    }
    else {
        return true
    }
}

module.exports = { Embed, checkWl }