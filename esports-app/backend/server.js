// backend/server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const PANDA_API_KEY = process.env.PANDA_API_KEY;

// Helper to fetch matches for today
const getTodayMatches = async (game) => {
  const today = new Date().toISOString().split('T')[0];
  const url = `https://api.pandascore.io/${game}/matches?range[begin_at]=${today},${today}&token=${PANDA_API_KEY}`;
  const { data } = await axios.get(url);
  return data;
};

// Endpoint: Get today's matches for CS2 and LoL
app.get('/api/matches', async (req, res) => {
  try {
    const cs2 = await getTodayMatches('csgo');
    const lol = await getTodayMatches('lol');
    res.json({ cs2, lol });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Endpoint: Get last 10 games for a team
app.get('/api/team/:game/:teamId/players', async (req, res) => {
  const { game, teamId } = req.params;
  try {
    // Get last 10 matches for the team
    const url = `https://api.pandascore.io/${game}/matches?filter[opponent_id]=${teamId}&sort=-begin_at&page[size]=10&token=${PANDA_API_KEY}`;
    const { data: matches } = await axios.get(url);

    // Get players from the latest match
    if (matches.length === 0) return res.json({ players: [] });

    const players = matches[0].opponents.find(o => o.opponent.id == teamId)?.opponent.players || [];

    // For each player, collect kills and headshots for last 10 matches
    const playerStats = players.map(player => {
      const stats = matches.map(match => {
        const stat = match.players_stats?.find(p => p.id === player.id) || {};
        return {
          kills: stat.kills || 0,
          hs: stat.headshots || 0,
        };
      });
      return {
        id: player.id,
        name: player.name,
        image_url: player.image_url,
        stats,
      };
    });

    res.json({ players: playerStats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch player data' });
  }
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
