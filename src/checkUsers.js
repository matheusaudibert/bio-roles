const { getDiscordProfile } = require("./apiService");
const { removeRole } = require("./removeRole");
require("dotenv").config();

let memberQueue = [];
let queueIndex = 0;

async function updateQueue(client) {
  const cargoId = process.env.CARGO;
  memberQueue = [];
  queueIndex = 0;

  for (const [, guild] of client.guilds.cache) {
    const role = guild.roles.cache.get(cargoId);
    if (!role) continue;
    for (const [, member] of role.members) {
      memberQueue.push(member);
    }
  }
}

async function checkNextAmbassador(client) {
  if (memberQueue.length === 0) {
    await updateQueue(client);
    if (memberQueue.length === 0) return;
  }

  // Pega o próximo membro da fila
  const member = memberQueue[queueIndex % memberQueue.length];
  queueIndex++;

  const bio = await getDiscordProfile(member.id);

  const hasInvite =
    bio &&
    (bio.includes("https://discord.gg/programador") ||
      bio.includes(".gg/programador") ||
      bio.includes("gg/programador") ||
      bio.includes("/programador"));

  if (!hasInvite) {
    await removeRole(member, process.env.CARGO);
    console.log(
      `Cargo removido de ${member.user.tag} por não ter o convite na bio.`
    );
  }
}

function startCheckLoop(client) {
  updateQueue(client); // Inicializa a fila
  setInterval(() => {
    checkNextAmbassador(client);
  }, 10 * 60 * 1000); // 10 minutos
}

module.exports = { startCheckLoop };
