const { SlashCommandBuilder } = require('discord.js');
const RPC = require('discord-rpc');

// RPC Client (Singleton, shared across commands)
const rpcClient = new RPC.Client({ transport: 'ipc' });
rpcClient.login({ clientId: 'YOUR_RPC_CLIENT_ID' }).catch(console.error);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Sets a custom Rich Presence status')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The status message to set')
                .setRequired(true)
        ),
    async execute(interaction) {
        const statusMessage = interaction.options.getString('message');
        rpcClient.setActivity({
            details: statusMessage,
            startTimestamp: new Date(),
            largeImageKey: 'purplegradient', // Add your image assets in Discord Developer Portal
            largeImageText: 'Discord Bot',
            instance: false,
        });
        await interaction.reply(`Rich Presence updated to: "${statusMessage}"`);
    },
};
