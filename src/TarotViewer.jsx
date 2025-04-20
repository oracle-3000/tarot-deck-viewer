import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function TarotViewer() {
  const [cards, setCards] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [current, setCurrent] = useState(null);

  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_G8A6D-vFqOIxRzY9K_p1xI06uzUq3GBY3OUAg9n0nB_O2SPAsNiECr5iNWBc2kWcIBhEQxlvo5wX/pub?output=csv";

  useEffect(() => {
    Papa.parse(sheetURL, {
      download: true,
      header: true,
      complete: (result) => {
        const data = result.data.filter((row) => row["Card Name"]);
        setCards(data);
        setFiltered(data);
        setCurrent(data[Math.floor(Math.random() * data.length)]);
      },
    });
  }, []);

  const drawRandom = () => {
    const randomCard = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrent(randomCard);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 700, margin: "auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Tarot Deck Viewer</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
        {["All", ...Array.from(new Set(cards.map((card) => card.House)))].map((house) => (
          <button
            key={house}
            onClick={() =>
              house === "All" ? setFiltered(cards) : setFiltered(cards.filter((c) => c.House === house))
            }
          >
            {house}
          </button>
        ))}
        <button onClick={drawRandom}>Draw Random</button>
      </div>

      {current && (
        <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <h2>{current["Card Name"]}</h2>
          {current["Image Link"] && (
            <img
              src={current["Image Link"]}
              alt={current["Card Name"]}
              style={{ maxWidth: "100%", maxHeight: "400px", marginBottom: "1rem" }}
            />
          )}
          <p style={{ fontStyle: "italic", whiteSpace: "pre-wrap" }}>
            {current["Interpretation"] || "No interpretation provided yet."}
          </p>
        </div>
      )}
    </div>
  );
}
