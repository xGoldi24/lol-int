export default async function handler(req, res) {
  const RIOT_API_KEY = process.env.RIOT_API_KEY;

  // Replace with your real PUUID
  const puuid = "cEPXUmRpcx8ZWn8DcKousCj574I-XY1jFH-3RMp6lmYVza4ZGMBjmpbRkVnayOpGK0rWdU7IvjKKtw";
  const regionRouting = "europe"; // For match-v5 (EUW/EUNE)
  
  try {
    // 1. Get latest match ID
    const matchIdsRes = await fetch(
      `https://${regionRouting}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1`,
      {
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
        },
      }
    );

    const matchIds = await matchIdsRes.json();
    const latestMatchId = matchIds[0];

    // 2. Get match details
    const matchDataRes = await fetch(
      `https://${regionRouting}.api.riotgames.com/lol/match/v5/matches/${latestMatchId}`,
      {
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
        },
      }
    );

    const matchData = await matchDataRes.json();

    // 3. Find your death count
    const participant = matchData.info.participants.find(
      (p) => p.puuid === puuid
    );

    const deaths = participant.deaths;
    const champ = participant.championName;

    let message = `REDSAPDES played ${champ} and had ${deaths} death${deaths === 1 ? '' : 's'} last game.`;

    if (deaths >= 10) {
      message += " 💀 Definitely a spicy one.";
    } else if (deaths <= 2) {
      message += " 🧘 Clean af.";
    }

    return res.status(200).send(message);
  } catch (err) {
    console.error("Error fetching match data:", err);
    return res.status(500).send("Error retrieving match data.");
  }
}
