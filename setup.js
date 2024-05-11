const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'ticket',

    execute(client, message) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.channel.send('Bu komutu kullanmak için **mesajları yönet** iznine sahip olmanız gerekir ❌');
        }

        const setupEmbed = new MessageEmbed();

        setupEmbed.setColor('GREEN');
        setupEmbed.setThumbnail('https://cdn.discordapp.com/attachments/1231129275835482166/1233109923009663098/20240425_203450.gif?ex=662be69b&is=662a951b&hm=c460dc04c65d046c1ce8205002b9b0c348679fcb6df4852fea48e50cd701f388&');
        setupEmbed.setAuthor('Zirve Graphics Ticket sistemi');
        setupEmbed.setDescription('**Bir bilet oluşturmak için aşağıdaki reaksiyona tıklayın**');
        setupEmbed.setImage('https://cdn.discordapp.com/attachments/1231572185773244446/1237091858824433734/20240506_195722.gif?ex=663a6313&is=66391193&hm=2fc93759ddbd092a70221f6626203fc1c58c35af33a50bd5f31dff1cc5033784&'); // Buraya banner resminin URL'si eklendi
        setupEmbed.setFooter(`Destek Ekipi ile konuşmanız için yeni bir kanal oluşturulacak!`);

        const ticketButton = new MessageButton();

        ticketButton.setEmoji('🔓');
        ticketButton.setStyle('SUCCESS');
        ticketButton.setLabel('Bilet Oluştur');
        ticketButton.setCustomId('createTicket');

        const row = new MessageActionRow().addComponents(ticketButton);

        message.channel.send({ embeds: [setupEmbed], components: [row] });
    },
};