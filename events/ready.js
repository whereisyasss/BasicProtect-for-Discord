require('colors');
const db = require('quick.db');
const { OWNER_ID } = require('./../config.json');

module.exports = async(client) => {
    console.log(`[CONNECTED] ${client.user.tag} just logged in :)`.green)
    console.log(`By Zitiix. You can use the bot provided you put my credits in your bot.`.yellow) /// :))))
    console.log(`Any use without my consent will be severely punished`.red) /// 😠😠😠😠😠😠😠😠😠😠

    client.guilds.cache.forEach(async g => { /// filters all client's guilds
        let wlOwn = await db.get(`config.${g.id}.whitelist.${OWNER_ID}`) /// finds guild's whitelist in database
        let wl2 = await db.get(`config.${g.id}.whitelist.${g.ownerId}`)
        if (wlOwn == undefined || wlOwn == null || wlOwn.length <= 0) { 
            /// checks that the owner is in the whitelist of all guilds the bot is in
            db.set(`config.${g.id}.whitelist.${OWNER_ID}`, true)
            /// if not, the bot adds it
        } 
        if (wl2 == undefined || wl2 == null || wl2.length <= 0) {
            db.set(`config.${g.id}.whitelist.${g.ownerId}`, true)
        } 
    });
}
