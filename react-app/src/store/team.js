//constants

const LOAD_TEAMS = "team/LOAD_TEAMS";



const loadTeams = (teams) => ({
    type: LOAD_TEAMS,
    teams
})


export const GetAllTeams = () => async (dispatch)=> {
    const res = await fetch("/api/teams/");
    if (res.ok){
        const teams = await res.json()
        console.log(teams)
        dispatch(loadTeams(teams))
    }
}

const initialState = { "all": []};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_TEAMS: {
      const newState = { ...state };
      newState.all = action.teams.teams
      action.teams.teams.forEach((team) => {
        newState[team.id] = team;
      });
      return newState;
    }
    default:
      return state;
  }
}
