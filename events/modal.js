const { Events,EmbedBuilder, embedLength } = require('discord.js');
const { StringSelectMenuOptionBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { role, eventchannel, log } = require('../config.json')
const DB =  require('db.simple');
const db = new DB.Database();
const ms = require('ms');
function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
function padZero(num) {
  return num.toString().padStart(2, '0');
}
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${hours}:${minutes}`;
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
	async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId.startsWith('like_')) {
          let fields = Array.from(interaction.fields.fields.values()).map((x) => x.value)
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
            {name: '**Обо мне**', value: "```" + obj.bio + "```"},
            {name: '**Комментарий**', value: fields[0]},)
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
        if (interaction.customId == "form") {
          let fields = Array.from(interaction.fields.fields.values()).map((x) => x.value)
          if (fields[3].toLowerCase() !== 'мужской' && fields[3].toLowerCase() !== 'женский') return interaction.reply({content: `Укажите пол`, ephemeral:true});
          if (!isNaN(fields[1]) && Number(fields[1]) < 16) return interaction.reply({content: `Укажите возраст больше 16`, ephemeral:true});
          const obj = {
            user: interaction.user.id,
            name: fields[0],
            age: fields[1],
            bio: fields[2],
            gender: fields[3]
          }
          if ((db.get('forms') || []).some((obj) => obj.user == interaction.user.id)) return interaction.reply({content: `У вас уже есть анкета`, ephemeral:true});
          db.push('forms', obj)
          const embed = new EmbedBuilder()
          .setColor('2B2D31')
          .setTitle('Вы успешно создали анкету')
          .setFields({name: '**Имя**', value: "```" + obj.name + "```", inline:true},
            {name: '**Возраст**', value: "```" + obj.age + "```", inline:true},
            {name: '**Пол**', value: "```" + obj.gender + "```", inline:true},
            {name: '**Обо мне**', value: "```" + obj.bio + "```"},
          )
          await interaction.reply({embeds:[embed], ephemeral:true})
        }
        if (interaction.customId == "editform") {
          let fields = Array.from(interaction.fields.fields.values()).map((x) => x.value)
          if (fields[3].toLowerCase() !== 'мужской' && fields[3].toLowerCase() !== 'женский') return interaction.reply({content: `Укажите пол`, ephemeral:true});
          if (!isNaN(fields[1]) && Number(fields[1]) < 16) return interaction.reply({content: `Укажите возраст больше 16`, ephemeral:true});
          const obj = {
            user: interaction.user.id,
            name: fields[0],
            age: fields[1],
            bio: fields[2],
            gender: fields[3]
          }
          db.set('forms', (db.get('forms') || []).filter((x) => x.user != interaction.user.id))
          db.push('forms', obj)
          const embed = new EmbedBuilder()
          .setColor('2B2D31')
          .setTitle('Вы успешно изменили анкету')
          .setFields({name: '**Имя**', value: "```" + obj.name + "```", inline:true},
            {name: '**Возраст**', value: "```" + obj.age + "```", inline:true},
            {name: '**Пол**', value: "```" + obj.gender + "```", inline:true},
            {name: '**Обо мне**', value: "```" + obj.bio + "```"},
          )
          await interaction.reply({embeds:[embed], ephemeral:true})
        }

	},
};