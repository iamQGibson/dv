// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [matches, setMatches] = useState({ cs2: [], lol: [] });
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [players1, setPlayers1] = useState([]);
  const [players2, setPlayers2] = useState([]);

  const loadGames = async () => {
    const { data } = await axios.get('http://localhost:5000/api/matches');
    setMatches(data);

    // Collect unique teams from both games
    const allTeams = [];
    ['cs2', 'lol'].forEach(game => {
      data[game].forEach(match => {
        match.opponents.forEach(o => {
          if (!allTeams.some(t => t.id === o.opponent.id)) {
            allTeams.push({ ...o.opponent, game });
          }
        });
      });
    });
    setTeams(allTeams);
  };

  const loadPlayers = async (team, setPlayers) => {
    if (!team) return;
    const { data } = await axios.get(`http://localhost:5000/api/team/${team.game}/${team.id}/players`);
    setPlayers(data.players);
  };

  return (
    <div className="container">
      <button className="load-btn" onClick={loadGames}>LOAD ESPORTS GAMES</button>

      <div className="matchup">
        <div className="dropdowns">
          <select value={team1.id || ''} onChange={e => {
            const t = teams.find(t => t.id === Number(e.target.value));
            setTeam1(t); setPlayers1([]); if (t) loadPlayers(t, setPlayers1);
          }}>
            <option value="">Select Team #1</option>
            {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
          <span className="vs">-vs-</span>
          <select value={team2.id || ''} onChange={e => {
            const t = teams.find(t => t.id === Number(e.target.value));
            setTeam2(t); setPlayers2([]); if (t) loadPlayers(t, setPlayers2);
          }}>
            <option value="">Select Team #2</option>
            {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
        </div>
        <div className="players-section">
          {[{ players: players1, team: team1 }, { players: players2, team: team2 }].map((side, idx) => (
            <div className="team-players" key={idx}>
              <h3>{side.team?.name || 'Select Team'}</h3>
              {side.players.length === 0 ? <p>(All Players Data Is Hidden Until Team Is Selected)</p> :
                <div>
                  <h4>Players</h4>
                  {side.players.map(player => (
                    <div className="player" key={player.id}>
                      <img src={player.image_url} alt={player.name} />
                      <span>{player.name}</span>
                      <div>
                        <div>[Kills]: {player.stats.map(s => s.kills).join(', ')}</div>
                        <div>[Hs]: {player.stats.map(s => s.hs).join(', ')}</div>
                      </div>
                    </div>
                  ))}
                </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
