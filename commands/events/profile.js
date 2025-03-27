const { SlashCommandBuilder,EmbedBuilder, ModalBuilder, TextInputBuilder,TextInputStyle ,StringSelectMenuOptionBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const DB =  require('db.simple')
const db = new DB.Database()
module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Открыть профиль'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
        .setColor('2B2D31')
        .setTitle('Профиль')
        .setDescription(`**Никнейм**: \`${interaction.user.username}\`
**Лайков**: \`${db.get('likes_' + interaction.user.id) || 0}\`
**Взаимных лайков**: \`${db.get('likes2_' + interaction.user.id) || 0}\`
`)
.setThumbnail(interaction.user.avatarURL())
await interaction.reply({embeds:[embed], ephemeral:true})
    }
};