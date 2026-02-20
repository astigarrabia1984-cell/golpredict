export default async function handler(req, res) {
  const response = await fetch("https://api.football-data.org/v4/matches", {
    headers: { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" }
  });

  const data = await response.json();
  res.status(200).json(data);
}
