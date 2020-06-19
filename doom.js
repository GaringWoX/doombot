const Discord = require('discord.js');
const Request = require("request");
const client = new Discord.Client({
    disableEveryone: true
});
const config = require("./config.json");

client.commands = new Discord.Collection();

client.on('message', (message) = > {

        if (!message.content === `$ {
            prefix
        }`) return;
        if (message.channel.type === "dm") return;
        if (message.author.bot) return;

        const messageArray = message.content.split(" ");
        const command = messageArray[0];
        const args = messageArray.slice(1);

        let commands = client.commands.get(command.slice(prefix.length));
        if (commands) commands.run(client, message, args);

        if (message.content === `$ {
                prefix
            }
            ping`) {
            message.channel.send('Pong! ' + `$ {
                message.client.ping
            }` + 'ms');
        }
    };

    console.log('Connected Successfully');

    client.login(process.env.Token)
