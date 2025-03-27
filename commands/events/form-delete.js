const { SlashCommandBuilder,EmbedBuilder, ModalBuilder, TextInputBuilder,TextInputStyle ,StringSelectMenuOptionBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const DB =  require('db.simple')
const db = new DB.Database()
module.exports = {
	data: new SlashCommandBuilder()
		.setName('from-delete')
		.setDescription('Удалить анкету'),
    async execute(interaction) {
        if (!(db.get('forms') || []).some((x) => x.user == interaction.user.id)) return interaction.reply({content: `У вас нет анкеты`, ephemeral:true});
        db.set('forms', (db.get('forms') || []).filter((x) => x.user != interaction.user.id))
        const embed = new EmbedBuilder()
        .setColor('2B2D31')
        .setTitle('Удаление анкеты')
        .setDescription(`${interaction.user}, вы успешно удалили анкету, надеемся вы нашли себе пару!
`)
.setThumbnail(interaction.user.avatarURL())
await interaction.reply({embeds:[embed], ephemeral:true})
    }
};