// By Zitiix; A Discord Basic Protect Bot For Discord :)
// Discord : Zitiix#2022

const {Collection, Client, Intents} = require('discord.js');
const {LoadCommands, LoadEvents} = require('./build/loader.js');
const {TOKEN} = require('./config.json');
const i = new Intents();

// process.on('unhandledRejection', error => console.log(error)); 
// use the line above if you don't want an error to crash your bot

i.add([
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING
]);

const client = new Client({
    intents: i
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.aliases = new Collection();
LoadCommands(client);
LoadEvents(client);

client.login(TOKEN);