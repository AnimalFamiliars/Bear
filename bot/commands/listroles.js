const {guilds} = require("../schemas")
const {getGuildDoc,capatalizeFirst} = require ("../utils")
const Discord = require("discord.js")
const {escapeMarkdown} = Discord.Util

module.exports = {
    name: 'roles',
    aliases: ['list'],
    description: 'lists the joinable roles',
    usage: ['list'],
    catagory: "Self Assign",
    hidden: false,
    owner: false,
    userPerms: [],
    runPerms: [],
	async execute(message, args) {
        let guild = await getGuildDoc(message.guild.id)
        let catagories = {}
        for (const role of guild.roles) {
            if(!catagories[role[1]]){
                catagories[role[1]] = `> **${await capatalizeFirst(escapeMarkdown(role[1]))}**`
                if(guild.whitelist.has(role[1])){
                    let whitelistRole = await message.guild.roles.resolve(guild.whitelist.get(role[1]))
                    catagories[role[1]] += ` (${whitelistRole.name} required)`
                }
            }
            let guildRole = message.guild.roles.cache.get(role[0])
            if(!guildRole) {
                guild.roles.delete(role[0])
            }
            let userHas = await message.member.roles.cache.has(guildRole.id)
            catagories[role[1]] += `\n${escapeMarkdown(guildRole.name)}${userHas ? " ✅":""}`
        }
        guild.save()
        let msg = `**__Self assignable roles__**`
        for (const key in catagories) {
            if (catagories.hasOwnProperty(key)) {
                const data = catagories[key];
                msg += '\n'+data
            }
        }
        message.channel.send(msg,{split:true})
    }
};