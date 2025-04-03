export default async function handler(req, res) {
  const RIOT_API_KEY = process.env.RIOT_API_KEY;
  const summonerName = "Tonlye";
  const tagLine = "EUW";
  const regionRouting = "europe"; // For match-v5
  const platformRouting = "euw1"; // For summoner-v4

  try {
    // 1. Get PUUID
    const accountRes = await fetch(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tagLine}`,
      {
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
        },
      }
    );
    const accountData = await accountRes.json();
    const puuid = accountData.puuid;

    // 2. Get latest match
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

    // 3. Get match data
    const matchDataRes = await fetch(
      `https://${regionRouting}.api.riotgames.com/lol/match/v5/matches/${latestMatchId}`,
      {
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
        },
      }
    );
    const matchData = await matchDataRes.json();
    const participant = matchData.info.participants.find(p => p.puuid === puuid);

    const deaths = participant.deaths;

    // 4. Custom flavor message
    let message = `REDSAPDES had ${deaths} death${deaths !== 1 ? "s" : ""} in their last game.`;
    if (deaths >= 10) message += ` 💀 Definitely a rough one.`;
    else if (deaths <= 2) message += ` 🧘 Clean.`

    return res.status(200).send(message);
  } catch (err) {
    return res.status(500).send("Error retrieving match data.");
  }
}
