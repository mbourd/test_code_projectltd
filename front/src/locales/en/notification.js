export default {
  mode: 'en',
  info: {
    fetchTeams: 'Fetching teams list...',
    sendingData: 'Sending data...',
  },
  success: {
    fetchTeams: 'Retrieved all teams',
    createTeam: 'New team created ! 🏆 ',
    sellTeamPlayers: 'Players transfered to their new team ! 🤝🏻',
  },
  error: {
    sellTeamNoPlayers: `Impossible to proceed sells. No players to sell`,
    sellTeamNegativeBalance: `Impossible to proceed sells: {{teamName}} result balance is negative`,
    sellTeamSameNotAllowed: "Same team not allowed",
    createTeamMissingName: 'Player name is missing, then add the new player',
    createTeamMissingSurname: 'Player surname is missing, then add the new player',
  }
}