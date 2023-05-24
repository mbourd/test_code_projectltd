export default {
  mode: 'en',
  detail: {
    totalPlayers: 'Total players',
    moneyBalance: 'Money balance',
    country: 'Country',
    colListPlayers: 'Team players'
  },
  create: {
    title: 'Creating Team',
    form: {
      validationSchema: {
        name: "Enter the team name",
        country: "Choose the country for the team",
        moneyBalance: "Enter the money balance for the team",
        players: {
          name: "Enter the name of the player",
          surname: "Enter the surname of the player",
        },
      },
      input: {
        submit: {
          label: 'Create the new team'
        },
        select: {
          defaultOptionLabel: '-- Choose --'
        }
      },
      group: {
        player: {
          label: 'Add a player',
          name: {
            label: 'Name'
          },
          surname: {
            label: 'Surname'
          },
          button: {
            add: 'Add 🏅'
          }
        },

        name: {
          label: 'Team name'
        },
        moneyBalance: {
          label: 'Money balance'
        },
        country: {
          label: 'Country'
        }
      }
    },
    confirmAlert: {
      confirmCreate: {
        title: 'Confirm',
        message: 'Confirm the creation of the team ?'
      }
    },
  },
  sell: {
    title: 'Team sell',
    resultIncome: 'Result income',
    resultBalance: 'Result balance',
    totalPlayersToSell: 'Total players to sell',
    form: {
      validationSchema: {
        idTeam1: "Please select a team",
        idTeam2: "Please select a team"
      },
      input: {
        submit: {
          label: 'Proceed sells'
        },
        select: {
          defaultOptionLabel: '-- Choose --'
        }
      },
      group: {
        idTeam1: {
          label: 'Select a team'
        },
        idTeam2: {
          label: 'Select a team'
        },
        playerToSell: {
          label: 'Players available'
        },
        price: {
          label: 'Price'
        },
        buttonAdd: 'Add ✔️'
      }
    },
    confirmAlert: {
      confirmSell: {
        title: 'Confirm',
        message: 'Proceed sells ?'
      },
      confirmChange: {
        title: 'Confirm',
        message: "The form contains players, confirm to change ?"
      }
    },
  }
}