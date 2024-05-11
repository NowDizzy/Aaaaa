const { createWriteStream } = require('fs');
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js');
const path = require('path');

module.exports = async (client, int) => {
    const req = int.customId.split('_')[0];

    client.emit('ticketsLogs', req, int.guild, int.member.user);

    switch (req) {
        case 'createTicket': {
            const selectMenu = new MessageSelectMenu()
                .setCustomId('newTicket')
                .setPlaceholder('Bilet için bir neden seçin')
                .addOptions([
                    {
                        emoji: '🙋',
                        label: 'Destek',
                        description: 'Yardım isteyin',
                        value: 'newTicket_Destek'
                    },
                    {
                        emoji: '💳',
                        label: 'Tasarım',
                        description: 'Satın Alın',
                        value: 'newTicket_Tasarım'
                    },
                ]);

            const row = new MessageActionRow().addComponents(selectMenu);
            return int.reply({ content: 'Biletin sebebi ne olacak?', components: [row], ephemeral: true });
        }

        case 'newTicket': {
            const reason = int.values[0].split('_')[1];
            const channelName = `ticket-${reason.toLowerCase()}-${int.member.id}`;
            const channel = int.guild.channels.cache.find(x => x.name === channelName);

            if (!channel) {
                const newChannel = await int.guild.channels.create(channelName, {
                    type: 'GUILD_TEXT',
                    topic: `Bilet ${int.member.user.username} tarafından oluşturuldu. Sebep: ${reason} ${new Date().toLocaleString()}`,
                    permissionOverwrites: [
                        { id: int.guild.id, deny: ['VIEW_CHANNEL'] },
                        { id: int.member.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'] },
                        { id: client.user.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] },
                        { id: '1221947799340585081', allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] },
                        { id: '1234156371201490964', allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] },
                    ]
                });

                const ticketEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setAuthor(`Biletiniz başarıyla oluşturuldu ${int.member.user.username} (${reason}) ✅`)
                    .setDescription('*Mevcut bileti kapatmak için aşağıdaki butona tıklayın, dikkat geri dönemeyeceksiniz!*');

                const closeButton = new MessageButton()
                    .setStyle('DANGER')
                    .setLabel('Bu bileti kapat')
                    .setCustomId(`closeTicket_${int.member.id}`);

                await newChannel.send({
                    content: `<@&1221947799340585081> <@&1234156371201490964> <@${int.member.id}>`,
                    embeds: [ticketEmbed],
                    components: [new MessageActionRow().addComponents(closeButton)]
                });

                return int.update({
                    content: `Biletiniz Açıldı <@${int.member.id}> <#${newChannel.id}> ✅`,
                    components: [],
                    ephemeral: true
                });
            } else {
                return int.update({ content: `Zaten açık bir biletiniz var <#${channel.id}> ❌`, components: [], ephemeral: true });
            }
        }

        case 'closeTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);
            await channel.delete();
            return int.update({ content: 'Bilet kapatıldı ve kanal silindi.', components: [], ephemeral: true });
        }

        case 'reopenTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.edit({
                permissionOverwrites: [
                    {
                        id: int.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: int.customId.split('_')[1],
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: client.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                ]
            });

            const ticketEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setAuthor(`Bilet yeniden açıldı ✅`)
                .setDescription('*Mevcut bileti kapatmak için aşağıdaki tepkiye tıklayın, dikkat geri dönemeyeceksiniz!*');

            const closeButton = new MessageButton()
                .setStyle('DANGER')
                .setLabel('Bu bileti kapat')
                .setCustomId(`closeTicket_${int.customId.split('_')[1]}`);

            return int.reply({ embeds: [ticketEmbed], components: [new MessageActionRow().addComponents(closeButton)] });
        }

        case 'deleteTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);
            return channel.delete();
        }

        case 'saveTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.messages.fetch().then(async messages => {
                let content = messages.filter(m => !m.author.bot).map(m => {
                    const date = new Date(m.createdTimestamp).toLocaleString();
                    const user = `${m.author.tag}${m.author.id === int.customId.split('_')[1] ? ' (ticket creator)' : ''}`;
                    return `${date} - ${user} : ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`;
                }).reverse().join('\n');

                if (content.length < 1) content = 'Bu bilette mesaj yok... garip';

                const ticketID = Date.now();
                const filePath = path.join(__dirname, `./data/${ticketID}.txt`);
                const stream = createWriteStream(filePath);

                stream.once('open', () => {
                    stream.write(`Kullanıcı bileti ${int.customId.split('_')[1]} (channel #${channel.name})\n\n`);
                    stream.write(`${content}\n\nLogs ${new Date(ticketID).toLocaleString()}`);
                    stream.end();
                });

                stream.on('finish', () => {
                    int.reply({ files: [filePath] });
                });
            });
        }
    }
};