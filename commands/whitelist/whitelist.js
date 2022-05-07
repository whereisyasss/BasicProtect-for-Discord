const db = require('quick.db');
const { DEFAULT_PREFIX, OWNER_ID } = require('../../config.json');
const { Embed } = require('../../build/functions');
let prefix = ''

module.exports.run = async (client, message, args) => {

    let prefix = await db.get(`config.${message.guild.id}.prefix`)

    if (prefix == undefined || prefix == null) prefix = DEFAULT_PREFIX

    if (!message.author) return
    if (message.author.id !== OWNER_ID) return Embed(message.author, `Sorry **${message.author.username}** you must be the owner of the server to use this command.`, message.channel, '')
    
    let whitelist = await db.get(`config.${message.guild.id}.whitelist`)
    let msg = ''
    if (!args[0]) {
        if (!whitelist || !Object.keys(whitelist).length) {
            msg = `No one is whitelisted on this server.`
        }
        else if (whitelist || Object.keys(whitelist).length > 0) {
            Object.keys(whitelist).forEach(w => {
                msg += '<@' + w + '>' + '\n'
            })
        }
        Embed(message.author, msg, message.channel, '')
    } else if (args[0]) {
        whitelist = await db.get(`config.${message.guild.id}.whitelist`)
        if (args[0] == 'add') {
            if (!args[1]) {
                const filter = (collected => collected.author.id == message.author.id)

                message.reply(`Who would you like to **add** to the** whitelist** ?`).then(message => {
                    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                        .then(async collected => {

                            let first   = collected.first();
                            let user    = first.mentions?.users?.first()?.id || first.content

                            if(message.guild?.members?.resolve(user) == undefined) 
                            {
                                message.delete();
                                return Embed(message.author, `The indicated member is not present in the server.`, message.channel, '')
                            }
                            message.delete();
                            if (whitelist !== undefined || whitelist !== null) 
                            {
                                whitelist = Object?.keys(whitelist) // issue
                                if (whitelist.includes(user)) return Embed(message.author, `This person is already in the whitelist of the server.`, message.channel, '')
                            }
                            db.set(`config.${message.guild.id}.whitelist.${user}`, true)
                            Embed(message.author, `<@${user}> has been **added** to the **whitelist** successfully.`, message.channel);
                        })
                }).catch(collected => console.log(collected))
            } else if (args[1]) {
                let user = message.mentions?.users?.first()?.id || message.content
                if(message.guild?.members?.resolve(user) == undefined) 
                {          
                    message.delete();
                    return Embed(message.author, `The indicated member is not present in the server.`, message.channel, '')
                }
                message.delete()
                if (whitelist !== undefined || whitelist !== null) 
                {
                    whitelist = Object?.keys(whitelist)
                    if (whitelist.includes(user)) {
                        if (whitelist.includes(user)) return Embed(message.author, `This person is already in the whitelist of the server.`, message.channel, '')
                    }       
                }
                db.set(`config.${message.guild.id}.whitelist.${user}`, true)
                Embed(message.author, `<@${user}> has been **added** to the **whitelist** successfully.`, message.channel);                        
            }
        } else if (args[0] == 'remove') {
            if (!args[1]) {
                const filter = (collected => collected.author.id == message.author.id)
                message.reply(`Who would you like to **remove** from the **whitelist** ?`).then(message => {
                    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                        .then(async collected => {
                            let first   = collected.first();
                            let user    = first.mentions?.users?.first()?.id || first.content
                            
                            if(message.guild?.members?.resolve(user) == undefined) 
                            {
                                message.delete();
                                return Embed(message.author, `The indicated member is not present in the server.`, message.channel, '')
                            }
                            message.delete();
                            if (whitelist !== undefined || whitelist !== null) 
                            {
                                whitelist = Object.keys(whitelist)
                                if (!whitelist.includes(user)) return Embed(message.author, `This person is not in the server's whitelist.`, message.channel, '')
                            }
                            db.delete(`config.${message.guild.id}.whitelist.${user}`)
                            Embed(message.author, `<@${user}> has been **removed** from the **whitelist** successfully.`, message.channel);                        
                        })
                }).catch(collected => console.log(collected))
            } else if (args[1]) {
                let user = message.mentions?.users?.first()?.id || message.content
                if(message.guild?.members?.resolve(user) == undefined) 
                {  
                    message.delete();
                    return Embed(message.author, `The indicated member is not present in the server.`, message.channel, '')
                }
                message.delete();
                if (whitelist !== undefined) 
                {
                    whitelist = Object?.keys(whitelist)
                    if (!whitelist.includes(user)) return Embed(message.author, `This person is not in the server's whitelist.`, message.channel, '')
                }
                db.delete(`config.${message.guild.id}.whitelist.${user}`)
                Embed(message.author, `<@${user}> has been **removed** from the **whitelist** successfully.`, message.channel);                        
            }
        } else {
            return;
        }
    }
}

module.exports.help = {
    name: "whitelist",
    aliases: ["wl"],
    category: "protection",
    usage: `${prefix}whitelist add/remove (<@user>)`,
    description: "Allows you to add or remove someone from the whitelist", 
    cooldown: 5
}
