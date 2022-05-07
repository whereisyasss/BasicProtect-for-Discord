const db = require('quick.db');
const { checkWl } = require('../build/functions');
const { OWNER_ID } = require('../config.json');

module.exports = async (client, g) => {
  
    const audit = (await g.fetchAuditLogs()).entries.first()
    if (audit?.executor?.id == client.user.id) return    

    async () => {
        if (checkWl(g.ownerId, g) == false) {
            db.set(`config.${g.id}.whitelist.${g.ownerId}`, true)
        }
        if (checkWl(OWNER_ID, g) == false) {
            db.set(`config.${g.id}.whitelist.${OWNER_ID}`, true) 
        }
    } 
}