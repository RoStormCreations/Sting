require('dotenv').config(); // Load .env file

const { Client, GatewayIntentBits, REST, Routes, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const RPC = require('discord-rpc');

// Load environment variables
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const rpcClientId = process.env.DISCORD_RPC_CLIENT_ID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();

// Load commands from the `commands` folder
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Register Slash Commands with Discord
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Refreshing slash commands...');
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );
        console.log('Slash commands registered!');
    } catch (error) {
        console.error(error);
    }
})();

// Event: Bot Ready
client.once('ready', () => {
    console.log(`${client.user.tag} is online!`);
});

// Event: Handle Slash Command Interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Log in to Discord
client.login(token);

// Discord RPC
const rpc = new RPC.Client({ transport: 'ipc' });

rpc.on('ready', () => {
    console.log('Rich Presence is ready!');
    setRPCStatus('Hello from RPC!');
});

function setRPCStatus(status) {
    rpc.setActivity({
        details: status,
        startTimestamp: new Date(),
        largeImageKey: 'large-image-key', // Add your image assets in Discord Developer Portal
        largeImageText: 'Discord Bot',
        instance: false,
    });
}

// Connect RPC
rpc.login({ clientId: rpcClientId }).catch(console.error);
