const BaseEvent = require("../BaseEvent");
const { Colors } = require("../../Constants");

class AFKHandler extends BaseEvent {
	requirements (msg) {
		if (!msg.guild) return false;
		if (msg.editedAt || msg.type !== "DEFAULT") return false;
		if (msg.author.id === this.client.user.id || msg.author.bot || this.configJSON.userBlocklist.includes(msg.author.id)) {
			if (msg.author.id === this.client.user.id) {
				return false;
			} else {
				winston.silly(`Ignored ${msg.author.tag} for AFK handler.`, { usrid: msg.author.id, globallyBlocked: this.configJSON.userBlocklist.includes(msg.author.id) });
				return false;
			}
		}
		if (!msg.channel.postable) return false;
		if (!msg.mentions.members.size > 0) return false;
		return true;
	}

	async prerequisite (msg) {
		this.serverDocument = await Servers.findOne(msg.guild.id);
	}

	async handle (msg) {
		if (this.serverDocument && msg.mentions.members.size) {
			msg.mentions.members.forEach(async member => {
				if (![this.client.user.id, msg.author.id].includes(member.id) && !member.user.bot) {
					// Check if they have a server AFK message
					// Takes priority over global AFK messages
					const targetMemberDocument = this.serverDocument.members[member.id];
					if (targetMemberDocument && targetMemberDocument.afk_message) {
						msg.channel.send({
							embed: {
								thumbnail: {
									url: member.user.displayAvatarURL(),
								},
								color: Colors.INFO,
								title: `@__${this.client.getName(this.serverDocument, member)}__ is currently AFK.`,
								description: `${targetMemberDocument.afk_message}`,
							},
						});
					} else {
						// User doesn't have server AFK message, go for global one
						const targetUserDocument = await Users.findOne(member.id).catch(err => {
							winston.verbose(`Failed to find user document for global AFK message >.>`, err);
						});
						if (targetUserDocument && targetUserDocument.afk_message) {
							msg.channel.send({
								embed: {
									thumbnail: {
										url: member.user.displayAvatarURL(),
									},
									color: Colors.INFO,
									title: `@__${this.client.getName(this.serverDocument, member)}__ is currently AFK.`,
									description: `${targetUserDocument.afk_message}`,
								},
							});
						}
					}
				}
			});
			this.serverDocument.save();
		}
	}
}

module.exports = AFKHandler;
