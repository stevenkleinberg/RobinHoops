const LOAD_PLAYERS = "player/LOAD_PLAYERS"

const loadPlayers = (players) => ({
    type: LOAD_PLAYERS,
    players
})

export const GetAllPlayers = () => async (dispatch)=> {
    const res = await fetch("/api/players/");
    if (res.ok){
        const players = await res.json()
        console.log(players)
        dispatch(loadPlayers(players))
    }
}

const initialState = { "all": []};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PLAYERS: {
      const newState = { ...state };
      newState.all = action.players.players
      action.players.players.forEach((player) => {
        newState[player.id] = player;
      });
      return newState;
    }
    default:
      return state;
  }
}
