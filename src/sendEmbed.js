const {
  ContainerBuilder,
  TextDisplayBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
  SectionBuilder,
  ThumbnailBuilder,
} = require("discord.js");
require("dotenv").config();

async function sendEmbedWithButton(client) {
  const channelId = process.env.CHANNEL_ID;
  const channel = await client.channels.fetch(channelId);

  const container = new ContainerBuilder()
    .setAccentColor(11860621)
    .addSectionComponents(
      new SectionBuilder()
        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            "https://cdn3.emoji.gg/emojis/950972-embaixador.png"
          )
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "# Ganhe seu cargo de embaixador!"
          ),
          new TextDisplayBuilder().setContent(
            "Aqui no **Servidor dos Programadores** temos um sistema de **Embaixadores**: membros que ajudam a divulgar e fortalecer nossa comunidade."
          )
        )
    )
    .addSectionComponents(
      new SectionBuilder()
        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(
            "https://media.discordapp.net/attachments/1386856413938323537/1410108653394067518/image.png?ex=68afd185&is=68ae8005&hm=41577ea7b3b55b42420df3cad46b6baba40961db8359997dd52f7a68d583d45a&=&format=webp&quality=lossless&width=254&height=217"
          )
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "Para ganhar o cargo <@&1409756076794187846> você deve **ser membro do servidor há pelo menos 1 mês** e **utilizar o convite do servidor na sua biografia do Discord**, como no exemplo ao lado:"
          ),
          new TextDisplayBuilder().setContent(
            "Os convites aceitos para receber o cargo são: \n- _**https://discord.gg/programador**_\n- _**.gg/programador**_\n- _**gg/programador**_\n- _**/programador**_"
          )
        )
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        "Para receber o seu cargo basta clicar no botão abaixo que o bot verificará a sua biografia."
      )
    )
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel("Ganhar cargo")
          .setCustomId("875bd65006a94ce880532c49f0f19132")
      )
    )
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        "-# Se você retirar o convite da sua biografia você perderá o cargo!"
      )
    );

  await channel.send({
    flags: MessageFlags.IsComponentsV2,
    components: [container],
  });
}

module.exports = { sendEmbedWithButton };
