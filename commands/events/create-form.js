const { SlashCommandBuilder,EmbedBuilder, ModalBuilder, TextInputBuilder,TextInputStyle ,StringSelectMenuOptionBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const DB =  require('db.simple')
const db = new DB.Database()
module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-form')
		.setDescription('Создать анкету'),
    async execute(interaction) {
        const modal = new ModalBuilder()
        .setCustomId('form')
        .setTitle('Заполнение анкеты');

    const name = new TextInputBuilder()
        .setCustomId('name')
        .setMinLength(1)
        .setMaxLength(25)
        .setLabel("Имя")
        .setStyle(TextInputStyle.Short);

    const age = new TextInputBuilder()
        .setCustomId('age')
        .setMinLength(1)
        .setMaxLength(2)
        .setLabel("Возраст")
        .setStyle(TextInputStyle.Short);

    const bio = new TextInputBuilder()
        .setCustomId('bio')
        .setMinLength(1)
        .setMaxLength(1_000)
        .setLabel("Расскажите о себе")
        .setStyle(TextInputStyle.Short);

    const gender = new TextInputBuilder()
        .setCustomId('gender')
        .setMinLength(7)
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