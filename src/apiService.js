const axios = require("axios");
require("dotenv").config();

async function getDiscordProfile(userId) {
  const url = `https://discord.com/api/v10/users/${userId}/profile`;
  const token = process.env.ACCOUNT_TOKEN;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    console.log(response.data);
    if (response.data.user.bio === "") {
      return null;
    }
    return response.data.user.bio;
  } catch (error) {
    console.error(
      "Erro ao buscar perfil do Discord:",
      error.response?.data || error.message
    );
    return null;
  }
}

module.exports = { getDiscordProfile };
