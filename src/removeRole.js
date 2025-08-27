async function removeRole(member, roleId) {
  try {
    await member.roles.remove(roleId);
    return true;
  } catch (error) {
    console.error("Erro ao remover cargo:", error);
    return false;
  }
}

module.exports = { removeRole };
