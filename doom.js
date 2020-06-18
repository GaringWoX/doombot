const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone: true});
const config = require('./config.json');
const fs = require ('fs');
const ytdl = require('ytdl-core');
const token = (config.token);
const prefix = (config.prefix);

client.commands = new Discord.Collection();

const size = config.colors; //RAINBOW
const rainbow = new Array(size); //RAINBOW

const speed = (config.speed); //RAINBOW

fs.readdir("./commands/", (err, files) => {
	if(err) console.error(err);

	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length <= 0) {
		console.log("No commands to load!");
		return;
	}

	console.log(`loading ${jsfiles.length} commands!`);

	jsfiles.forEach((f, i) => {
		let props = require(`./commands/${f}`);
		console.log(`${i + 1}: ${f} loaded!`);
		client.commands.set(props.help.name, props);
	});
});

client.on('ready', () => {
	console.log('It\'s ON!');
	console.log(client.commands);
	setInterval(changeColor, config.speed); //RAINBOW
	client.user.setActivity('The Rainbow', {type: 'WATCHING'});
});

//RAINBOW
for (let i = 0; i < size; i++) {
	  let red = sin_to_hex(i, 0 * Math.PI * 2 / 3); // 0   deg
	  let blue = sin_to_hex(i, 1 * Math.PI * 2 / 3); // 120 deg
	  let green = sin_to_hex(i, 2 * Math.PI * 2 / 3); // 240 deg

	  rainbow[i] = '#' + red + green + blue;
}

function sin_to_hex(i, phase) {
	  let sin = Math.sin(Math.PI / size * 2 * i + phase);
	  let int = Math.floor(sin * 127) + 128;
	  let hex = int.toString(16);

	  return hex.length === 1 ? '0' + hex : hex;
}

let place = 0;
const servers = config.servers;

function changeColor() {
	  for (let index = 0; index < servers.length; ++index) {
		      client.guilds.get(servers[index]).roles.find('name', config.roleName).setColor(rainbow[place])
		  		.catch(console.error);

		      if(config.logging) {
			            console.log(`[ColorChanger] Changed color to ${rainbow[place]} in server: ${servers[index]}`);
			          }
		      if(place == (size - 1)) {
			            place = 0;
			          }
else{
					        place++;
					      }
		    }
}
//RAINBOW

client.on('message', (message) => {

	if (!message.content === `${prefix}`) return;
	if (message.channel.type === "dm") return;
	if (message.author.bot) return;
	
	const messageArray = message.content.split(" ");
	const command = messageArray[0];
	const args = messageArray.slice(1);

	let commands = client.commands.get(command.slice(prefix.length));
	if(commands) commands.run(client, message, args);

	if (message.content === `${prefix}ping`) {
		message.channel.send('Pong! '+`${message.client.ping}`+'ms');
	}

	if (message.content === `${prefix}play`) {
        if (message.channel.type !== 'text') return;

        const { voiceChannel } = message.member;

        if (!voiceChannel) {
            return message.reply('please join a voice channel first!');
        }

        voiceChannel.join().then(connection => {
            const stream = ytdl('https://www.youtube.com/watch?v=D57Y1PruTlw', { filter: 'audioonly' });
            const dispatcher = connection.playStream(stream);

            dispatcher.on('end', () => voiceChannel.leave());
        });
    }

});

client.login(config.token);
