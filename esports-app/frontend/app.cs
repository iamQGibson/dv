/* frontend/src/App.css */
body, html, #root {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #181818;
  color: #fff;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 1rem;
  width: 100vw;
  box-sizing: border-box;
}

.load-btn {
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: #0099ff;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  width: 100%;
  max-width: 400px;
}

.matchup {
  margin-top: 2rem;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dropdowns {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
}

select {
  font-size: 1rem;
  padding: 0.5rem;
  margin: 0 0.5rem;
  border-radius: 6px;
  border: 1px solid #333;
  background: #222;
  color: #fff;
  width: 45vw;
  max-width: 180px;
}

.vs {
  font-size: 1.2rem;
  margin: 0 0.5rem;
}

.players-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.team-players {
  margin: 1.5rem 0;
  text-align: center;
  width: 100%;
}

.player {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
}

.player img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

@media (max-width: 600px) {
  .container, .matchup {
    max-width: 100vw;
    padding: 0.5rem;
  }
  .dropdowns {
    flex-direction: column;
  }
  select {
    width: 90vw;
    max-width: none;
    margin-bottom: 0.5rem;
  }
}
