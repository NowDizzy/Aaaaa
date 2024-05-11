module.exports = {
    name: 'ping',

    execute(client, message) {
        message.channel.send(`Dostum Destekde ne kadar yoruldum **${client.ws.ping}ms** 👋`);
    },
}; 