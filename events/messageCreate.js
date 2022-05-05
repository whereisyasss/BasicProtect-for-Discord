const { Collection } = require('discord.js');
const db  = require('quick.db');
const { DEFAULT_PREFIX } = require('./../config.json');
const { Embed, checkWl } = require('./../build/functions.js');
const links = [
  'discord.gg',
  'dsc.bio',
  'www',
  'https',
  'http',
  '.ga',
  '.fr',
  '.com',
  '.tk',
  '.ml',
  '://'
]

module.exports = async (client, message) => {

    if (!message) return
    if (!message.guild) return
    if (message.author.bot) return
    
    let isLink = false
    let antilink = await db.get(`config.${message.guild.id}.antilink`)

    links.forEach(l => {
      if (message.content.includes(l)) {
        isLink = true
      }
    })

    if (antilink == true) {
        // check if whitelisted
      if (await checkWl(message.author, message.guild) == false) {
        if (isLink == true) {
          message.delete() // delete message 
          // send a message
          Embed(message.author, `You are not allowed to send links in this server.`, message.channel, '')
        }
      }
  }

  let prefix = await db.get(`config.${message.guild.id}.prefix`) // return undefined ;)
  if (prefix == undefined || prefix == null) prefix = DEFAULT_PREFIX

    if ((client.user.id) == (message.mentions.members.first())) return Embed(message.author, `Hey **${message.author.username}**, my prefix is \`${prefix}\`.`, message.channel, '')
    if (!message.content.startsWith(prefix)) return
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    if (commandName.length <= 0) return;

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName))
    if (!command) return Embed(message.author, `This command does not exist !`, message.channel, '')
    if (!client.cooldowns.has(command.help.name)) {
      client.cooldowns.set(command.help.name, new Collection())
    }

    const timeNow = Date.now()
    const tStamps = client.cooldowns.get(command.help.name)
    const cdAmount = (command.help.cooldown) * 1000
    let unit = 'seconds'

    if (tStamps.has(message.author.id)) {
      const cooldownExp = tStamps.get(message.author.id) + cdAmount
      if (timeNow < cooldownExp) {
        timeLeft = (cooldownExp - timeNow) / 1000;
        if (timeLeft >= 3600) {
          timeLeft = timeLeft/3600
          if (timeLeft >= 60) {
            timeLeft = timeLeft/60
          }
          unit = 'hours'
        } else if (timeLeft < 3600 && timeLeft >= 60) {
          timeLeft = timeLeft/60
          unit = 'minutes'
        } 
        return Embed(message.author, `You must wait **${timeLeft.toFixed(0)} ${unit}** before reusing the command : **${commandName}**.`, message.channel, '')
    }}
    
    tStamps.set(message.author.id, timeNow)
    setTimeout(() => tStamps.delete(message.author.id), cdAmount)
    command.run(client, message, args)
}