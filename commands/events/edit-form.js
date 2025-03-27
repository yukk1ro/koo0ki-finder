const { SlashCommandBuilder,EmbedBuilder, ModalBuilder, TextInputBuilder,TextInputStyle ,StringSelectMenuOptionBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const DB =  require('db.simple')
const db = new DB.Database()
module.exports = {
	data: new SlashCommandBuilder()
		.setName('edit-form')
		.setDescription('Отредактировать анкету'),
    async execute(interaction) {
        if (!(db.get('forms') || []).some((x) => x.user == interaction.user.id)) return interaction.reply({content: `У вас нет анкеты`, ephemeral:true});
        let obj = (db.get('forms') || []).filter((x) => x.user == interaction.user.id)[0]
        const modal = new ModalBuilder()
        .setCustomId('editform')
        .setTitle('Заполнение анкеты');

    const name = new TextInputBuilder()
        .setCustomId('name')
        .setMinLength(1)
        .setMaxLength(25)
        .setValue(obj.name)
        .setLabel("Имя")
        .setStyle(TextInputStyle.Short);

    const age = new TextInputBuilder()
        .setCustomId('age')
        .setMinLength(1)
        .setMaxLength(2)
        .setValue(obj.age)
        .setLabel("Возраст")
        .setStyle(TextInputStyle.Short);

    const bio = new TextInputBuilder()
        .setCustomId('bio')
        .setMinLength(1)
        .setMaxLength(1_000)
        .setValue(obj.bio)
        .setLabel("Расскажите о себе")
        .setStyle(TextInputStyle.Short);

    const gender = new TextInputBuilder()
        .setCustomId('gender')
        .setMinLength(7)
        .setValue(obj.gender)
        .setMaxLength(7)
        .setLabel("Введите ваш пол (мужской/женский)")
        .setStyle(TextInputStyle.Short);

    const in1 = new ActionRowBuilder().addComponents(name);
    const in2 = new ActionRowBuilder().addComponents(age);
    const in3 = new ActionRowBuilder().addComponents(bio);
    const in4 = new ActionRowBuilder().addComponents(gender);

    modal.addComponents(in1,in2,in3,in4);

    await interaction.showModal(modal);
    }
};