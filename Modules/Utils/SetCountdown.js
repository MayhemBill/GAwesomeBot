/**
 * Set countdown for a server
 * @param client The client instance
 * @param {Document} serverDocument The full server document
 * @param {Document} countdownDocument The countdown document
 */
/* eslint-disable require-await*/
module.exports = async (client, serverDocument, countdownDocument) => {
	const svr = client.guilds.get(serverDocument._id);
	if (svr) {
		const ch = svr.channels.get(countdownDocument.channel_id);
		if (ch) {
			client.setTimeout(async () => {
				ch.send({
					embed: {
						color: 0x3669FA,
						description: `3...2...1... **${countdownDocument._id}**`,
					},
				});
				winston.info(`Countdown "${countdownDocument._id}" expired`, { svrid: svr.id, chid: ch.id });
				try {
					const newServerDocument = await Servers.findOne(serverDocument._id);
					const newCountdownQueryDocument = newServerDocument.query.id("config.countdown_data", countdownDocument._id);
					if (newCountdownQueryDocument.val && newCountdownQueryDocument.val._id) newCountdownQueryDocument.remove();
					await newServerDocument.save();
				} catch (err) {
					winston.info("Failed to save server data for countdown expiry", { svrid: svr.id }, err);
				}
			}, countdownDocument.expiry_timestamp - Date.now());
		}
	}
};
