const {guilds} = require("../schemas")
const {getGuildDoc} = require ("../utils")

module.exports = {
    name: 'join',
    aliases: [],
    description: 'Gives you a self assignable role',
    usage: ['join <name...>'],
    catagory: "Self Assign",
    hidden: false,
    owner: false,
    userPerms: [],
    runPerms: ["MANAGE_ROLES"],
	async execute(message, args) {
        let guild = await getGuildDoc(message.guild.id)
        if(guild.profileMode) return message.channel.send("Sorry! Profile mode is enabled on this server, you cannot edit your roles with this bot")
        if(args.length<1) return message.channel.send("You must supply a role name!")
        let roleName = args.join(' ')

        let role = message.guild.roles.filter(role => guild.roles.has(role.id)).find(role => role.name.toLowerCase() == roleName.toLowerCase())

        if(!role) return message.channel.send("Invalid role!")
        message.member.roles.add(role)

        return message.channel.send(`Gave you ${role.name}`)
    }
};