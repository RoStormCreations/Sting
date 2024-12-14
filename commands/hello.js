const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('Greeting')
        .setDescription('👋 Greet the bot.'),
    async execute(interaction) {
        await interaction.reply('👋 Hello!');
    },
};
