const { SlashCommandBuilder,EmbedBuilder, ModalBuilder, TextInputBuilder,TextInputStyle ,StringSelectMenuOptionBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const DB =  require('db.simple')
const db = new DB.Database()
module.exports = {
	data: new SlashCommandBuilder()
		.setName('find')
		.setDescription('Начать знакомства')
        .addStringOption(option =>
            option.setName('filter-by-gender')
              .setDescription('Выберите фильтр по гендеру')
              .setRequired(false)
              .addChoices(
                { name: 'Мужской', value: '0' },
                { name: 'Женский', value: '1' },
              )),
    async execute(interaction) {
        if (!(db.get('forms') || []).some((x) => x.user == interaction.user.id)) return interaction.reply({content: `У вас нет анкеты`, ephemeral:true});
        let filter = interaction.options.getString('filter-by-gender')
        let form
        if(!!filter) {
            if (filter == '0') form = (db.get('forms') || []).filter((obj) => obj.gender.toLowerCase() == 'мужской').filter((obj) => obj.user != interaction.user.id)
            if (filter == '1') form = (db.get('forms') || []).filter((obj) => obj.gender.toLowerCase() == 'женский').filter((obj) => obj.user != interaction.user.id)
            db.set('filter_' + interaction.user.id,filter)
        } else {
            db.delete('filter_' + interaction.user.id)
            form = db.get('forms').filter((obj) => obj.user != interaction.user.id) || []
        }
        if (form.length == 0) return interaction.reply({content: `Знакомства пустые`, ephemeral:true});
        let obj = form[Math.floor(Math.random() * form.length)]
        const embed = new EmbedBuilder()
        .setColor('2B2D31')
        .setTitle('Начнем знакомиться!')
        .setFields({name: '**Имя**', value: "```" + obj.name + "```", inline:true},
          {name: '**Возраст**', value: "```" + obj.age + "```", inline:true},
          {name: '**Пол**', value: "```" + obj.gender + "```", inline:true},
          {name: '**Обо мне**', value: "```" + obj.bio + "```"},
        )
        const like = new ButtonBuilder()
        .setCustomId('like_' + obj.user)
        .setLabel('❤️')
        .setStyle(ButtonStyle.Secondary);

        const likewithmsg = new ButtonBuilder()
        .setCustomId('likemsg_' + obj.user)
        .setLabel('💌')
        .setStyle(ButtonStyle.Secondary);

        const skip = new ButtonBuilder()
        .setCustomId('skip')
        .setLabel('Пропустить')
        .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(like,likewithmsg,skip)

        await interaction.reply({embeds:[embed], ephemeral:true,components:[row]})
    }
};