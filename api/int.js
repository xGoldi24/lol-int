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

let message = `REDSAPDES played ${champ} and had ${deaths} death${deaths === 1 ? '' : 's'} last game. `;

if (deaths === 0) {
  message += "👑 Achieved immortality. Absolute legend.";
} else if (deaths === 1 || deaths === 2) {
  message += "🧘 Keeping it cool under pressure. Faker would be proud.";
} else if (deaths >= 3 && deaths <= 5) {
  message += "🤔 Played it relatively safe. Respectable.";
} else if (deaths >= 6 && deaths <= 9) {
  message += "😬 Caught a few too many skillshots... happens to the best of us.";
} else if (deaths >= 10 && deaths <= 13) {
  message += "💀 Putting on an inting masterclass. Maybe dodge next time?";
} else if (deaths >= 14) {
  message += "🔥 Absolute griefing. Teemo salutes you.";
}


    return res.status(200).send(message);
  } catch (err) {
    console.error("Error fetching match data:", err);
    return res.status(500).send("Error retrieving match data.");
  }
}
