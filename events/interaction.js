const { Events } = require('discord.js');
const { role, log } = require('../config.json')
const DB =  require('db.simple')
const db = new DB.Database()
function padZero(num) {
  return num.toString().padStart(2, '0');
}
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${hours}:${minutes}`;
}
function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
  function hasRole(guild,userID, roleId) {
    try {
    const member = guild.members.cache.get(userID);
     const role = member.roles.cache.get(roleId);
    return !!role;
} catch {}
  }
function giveRole(guild, userId, roleId) {
    try {
    const member = guild.members.cache.get(userId);
    const role = guild.roles.cache.get(roleId);

    member.roles.add(role)
} catch {}
}
function takeRole(guild, userId, roleId) {
    try {
    const member = guild.members.cache.get(userId);
    const role = guild.roles.cache.get(roleId);

    member.roles.remove(role)
} catch {}
}
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		} else if (interaction.isButton()) {
      const { SlashCommandBuilder,EmbedBuilder, ModalBuilder, TextInputBuilder,TextInputStyle ,StringSelectMenuOptionBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, ComponentType } = require('discord.js');
      if (interaction.customId == 'skip') {
        if (!(db.get('forms') || []).some((x) => x.user == interaction.user.id)) return interaction.reply({content: `У вас нет анкеты`, ephemeral:true});
        let filter = db.get('filter_' + interaction.user.id)
        let form
        if(!!filter) {
            if (filter == '0') form = (db.get('forms') || []).filter((obj) => obj.gender.toLowerCase() == 'мужской').filter((obj) => obj.user != interaction.user.id)
            if (filter == '1') form = (db.get('forms') || []).filter((obj) => obj.gender.toLowerCase() == 'женский').filter((obj) => obj.user != interaction.user.id)
        } else {
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

        await interaction.update({embeds:[embed],components:[row]})
      }
      if (interaction.customId == 'ignor') {
        await interaction.message.delete()
      }
      if (interaction.customId.startsWith('like1_')) {
        let id = interaction.customId.split('_')[1]
        const dm = await interaction.client.users.fetch(id)
        var embed = new EmbedBuilder()
        .setColor('2B2D31')
        .setTitle(`Вам ответили взаимностью`)
        .setDescription(`${interaction.user}, ответил взаимностью на ваш лайк`)
        .setThumbnail(interaction.user.avatarURL())
        var button = new ButtonBuilder()
	      .setLabel('Написать')
	      .setURL('https://discord.com/users/' + interaction.user.id)
      	.setStyle(ButtonStyle.Link);
        var row = new ActionRowBuilder().addComponents(button)
        await dm.send({embeds:[embed],components:[row]})
        var embed = new EmbedBuilder()
        .setColor('2B2D31')
        .setTitle(`Вы ответили взаимностью`)
        .setDescription(`${interaction.user}, вы ответили взаимно на лайк <@${id}>`)
        .setThumbnail(interaction.user.avatarURL())
        var button = new ButtonBuilder()
	      .setLabel('Написать')
	      .setURL('https://discord.com/users/' + id)
      	.setStyle(ButtonStyle.Link);
        var row = new ActionRowBuilder().addComponents(button)
        await interaction.update({embeds:[embed],components:[row]})
        db.add('likes2_' + id,1)
        db.get('likes2_' + interaction.user.id,1)

      }
      if (interaction.customId.startsWith('likemsg_')) {
        if (!(db.get('forms') || []).some((x) => x.user == interaction.user.id)) return interaction.reply({content: `У вас нет анкеты`, ephemeral:true});
        let id = interaction.customId.split('_')[1]
        const modal = new ModalBuilder()
        .setCustomId('like_' + id)
        .setTitle('Лайк с комментарием');
        const text = new TextInputBuilder()
        .setCustomId('name')
        .setMinLength(1)
        .setMaxLength(100)
        .setLabel("Комментарий")
        .setStyle(TextInputStyle.Paragraph);
        const in1 = new ActionRowBuilder().addComponents(text);
        modal.addComponents(in1);

        await interaction.showModal(modal);
      }

      if (interaction.customId.startsWith('like_')) {
        if (!(db.get('forms') || []).some((x) => x.user == interaction.user.id)) return interaction.reply({content: `У вас нет анкеты`, ephemeral:true});
        let id = interaction.customId.split('_')[1]
        db.add('likes_' + id,1)
        const dm = await interaction.client.users.fetch(id)
        let obj = (db.get('forms') || []).filter((obj) => obj.user == interaction.user.id)[0]
        const embed = new EmbedBuilder()
        .setColor('2B2D31')
        .setTitle(`Ваша анкета кому-то понравилось`)
        .setDescription(`**Анкета человека, которому вы понравились:**`)
        .addFields({name: '**Имя**', value: "```" + obj.name + "```", inline:true},
          {name: '**Возраст**', value: "```" + obj.age + "```", inline:true},
          {name: '**Пол**', value: "```" + obj.gender + "```", inline:true},
          {name: '**Обо мне**', value: "```" + obj.bio + "```"},)
          const like = new ButtonBuilder()
          .setCustomId('like1_' + obj.user)
          .setLabel('❤️ Ответить взаимностью')
          .setStyle(ButtonStyle.Secondary);
  
          const ignor = new ButtonBuilder()
          .setCustomId('ignor')
          .setLabel('Проигнорировать')
          .setStyle(ButtonStyle.Secondary);
          const row = new ActionRowBuilder().addComponents(like,ignor)
        await dm.send({embeds:[embed],components:[row]})
        const embed2 = new EmbedBuilder()
        .setColor('2B2D31')
        .setTitle('Давайте знакомиться')
        .setDescription(`Вы успешно лайкнули анкету, если она понравится человеку, то вам придет уведомление!`)
        const skip = new ButtonBuilder()
        .setCustomId('skip')
        .setLabel('Продолжить знакомство')
        .setStyle(ButtonStyle.Primary);

        const row2 = new ActionRowBuilder().addComponents(skip)

        await interaction.update({embeds:[embed2],components:[row2]})


      }
		} else if (interaction.isStringSelectMenu()) {

		} else if (interaction.isUserSelectMenu()) {
        }
	},
};