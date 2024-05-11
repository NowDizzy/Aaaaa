const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'amminiyüm',

    execute(client, message) {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.channel.send('Bu komutu kullanmak için **mesajları yönet** iznine sahip olmanız gerekir ❌');
        }

        const setupEmbed = new MessageEmbed();

        setupEmbed.setColor('GREEN');
        setupEmbed.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        setupEmbed.setAuthor('Zirve Graphics Özel Büyü Sistemi');
        setupEmbed.setDescription('Amminiyüm Gardaş!!');
        setupEmbed.setFooter(`Amminiyüm Gardaş!!`);

   
        
        const ticketButton = new MessageButton();

        ticketButton.setEmoji('');
        ticketButton.setStyle('SUCCESS');
        ticketButton.setLabel('Amminiyüm Gardaş');
        ticketButton.setCustomId('createTicket');

        const row = new MessageActionRow().addComponents(ticketButton);

        message.channel.send({ embeds: [setupEmbed], components: [row] });
    },
};
