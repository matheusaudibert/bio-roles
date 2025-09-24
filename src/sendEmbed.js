const {
  ContainerBuilder,
  TextDisplayBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  MediaGalleryBuilder,
  ActionRowBuilder,
} = require("discord.js");
require("dotenv").config();

async function sendEmbedWithButton(client) {
  const channelId = process.env.CHANNEL_ID;
  const channel = await client.channels.fetch(channelId);

  const container = new ContainerBuilder().setAccentColor(1379773);

  const media = new MediaGalleryBuilder().addItems([
    {
      media: {
        url: "https://i.postimg.cc/8cXQwVRy/PROGRAMADORES7.png",
      },
    },
  ]);

  const text1 = new TextDisplayBuilder().setContent("# Torne-se um embaixador");
  const text2 = new TextDisplayBuilder().setContent("Aqui no **Servidor dos Programadores**  temos um sistema de **Embaixadores**: membros que ajudam a divulgar e fortalecer nossa comunidade.");
  const text3 = new TextDisplayBuilder().setContent("Para ganhar o cargo **<@&1409756076794187846>** você deve ser __membro do servidor há pelo menos 1 mês__ e __utilizar o convite do servidor na sua biografia do Discord__.");
  const text4 = new TextDisplayBuilder().setContent("Os convites aceitos para receber o cargo são: ");
  const text5 = new TextDisplayBuilder().setContent("- **https://discord.gg/programador**\n- **.gg/programador**\n- **gg/programador**\n- **/programador**");
  const text6 = new TextDisplayBuilder().setContent("Para receber o seu cargo basta clicar no botão abaixo que o bot verificará a sua biografia.");
  const text7 = new TextDisplayBuilder().setContent("-# Se você retirar o convite da sua biografia você perderá o cargo!");

  container.addMediaGalleryComponents(media);
  container.addTextDisplayComponents(text1, text2, text3, text4, text5, text6, text7);

  const button = new ButtonBuilder()
    .setCustomId("875bd65006a94ce880532c49f0f19132")
    .setLabel("Ganhar cargo de Embaixador")
    .setStyle(ButtonStyle.Primary);

  const actionRow = new ActionRowBuilder().addComponents(button);

  await channel.send({
    flags: MessageFlags.IsComponentsV2,
    components: [container, actionRow],
  });
}

module.exports = { sendEmbedWithButton };