require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { sendEmbedWithButton } = require("./src/sendEmbed");
const { getDiscordProfile } = require("./src/apiService");
const { addRole } = require("./src/addRole");
const {
  ContainerBuilder,
  ActivityType,
  TextDisplayBuilder,
  MessageFlags,
} = require("discord.js");
const { startCheckLoop } = require("./src/checkUsers");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildEmojisAndStickers,

  ],
});

client.once("ready", async () => {
  console.log(`Bot está online como ${client.user.tag}`);

  client.user.setActivity("ur bios 🍃", {
    type: ActivityType.Watching,
  });

  const channelId = process.env.CHANNEL_ID;
  const channel = await client.channels.fetch(channelId);

  let fetched;
  do {
    fetched = await channel.messages.fetch({ limit: 100 });
    if (fetched.size > 0) {
      await channel.bulkDelete(fetched, true);
    }
  } while (fetched.size >= 2);

  await sendEmbedWithButton(client);

  startCheckLoop(client);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

const cooldownMap = new Map();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== "875bd65006a94ce880532c49f0f19132") return;

  try {
    await interaction.deferReply({ ephemeral: true });

    const cargoId = process.env.CARGO;
    let container = new ContainerBuilder();

    if (interaction.member.roles.cache.has(cargoId)) {
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `Você já possui o cargo de <@&${cargoId}>.`
        )
      );
      await interaction.editReply({
        flags: MessageFlags.IsComponentsV2,
        components: [container],
        ephemeral: true,
      });
      return;
    }

    const joinedTimestamp = interaction.member.joinedTimestamp;
    const now = Date.now();
    const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
    if (!joinedTimestamp || now - joinedTimestamp < oneMonthMs) {
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          "Você precisa estar há mais de 1 mês no servidor para receber o cargo."
        )
      );
      await interaction.editReply({
        flags: MessageFlags.IsComponentsV2,
        components: [container],
        ephemeral: true,
      });
      return;
    }

    const userId = interaction.user.id;
    const lastUsed = cooldownMap.get(userId) || 0;
    const cooldownMs = 2 * 60 * 1000;
    if (now - lastUsed < cooldownMs) {
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          "Tente novamente daqui a 2 minutos."
        )
      );
      await interaction.editReply({
        flags: MessageFlags.IsComponentsV2,
        components: [container],
        ephemeral: true,
      });
      return;
    }
    cooldownMap.set(userId, now);

    const bio = await getDiscordProfile(userId);

    const hasInvite =
      bio &&
      (bio.includes("https://discord.gg/programador") ||
        bio.includes(".gg/programador") ||
        bio.includes("gg/programador") ||
        bio.includes("/programador"));

    if (hasInvite) {
      const success = await addRole(interaction.member, cargoId);
      if (success) {
        container.addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `Cargo <@&${cargoId}> adicionado ao seu perfil.`
          )
        );
      } else {
        container.addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "Ocorreu um erro ao adicionar o cargo."
          )
        );
      }
    } else {
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          "Você não colocou o convite do servidor na sua biografia."
        )
      );
    }

    await interaction.editReply({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
      ephemeral: true,
    });
  } catch (err) {
    console.error("Erro na interação:", err);
    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
          ephemeral: true,
        });
      }
    } catch (e) {}
  }
});

client.login(process.env.BOT_TOKEN);
