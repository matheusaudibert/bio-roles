async function addRole(member, roleId) {
  try {
    await member.roles.add(roleId);
    return true;
  } catch (error) {
    console.error("Erro ao adicionar cargo:", error);
    return false;
  }
}

module.exports = { addRole };
