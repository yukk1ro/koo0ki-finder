const fs = require('node:fs');
const { REST, Routes } = require('discord.js');
const path = require('node:path');
const { Client, Collection, PermissionsBitField, RoleSelectMenuBuilder, UserSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, GatewayIntentBits } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const Perm = PermissionsBitField.Flags
const Intent = GatewayIntentBits
const client = new Client({ intents: [
    Intent.Guilds, 
    Intent.GuildMessages, 
    Intent.MessageContent, 
    Intent.GuildMembers,
    Intent.GuildVoiceStates                   
    ] });
    
const DB =  require('db.simple')
const db = new DB.Database()

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);


process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection');
	console.log(reason, p)
  })
  
  process.on("uncaughtException", (err, origin) => {
	console.log('Uncaught Exception');
	console.log(err, origin)
  })
  
  process.on('uncaughtExceptionMonitor', (err, origin) => {
	console.log('Uncaught Monitor Exception');
	console.log(err, origin)
  })