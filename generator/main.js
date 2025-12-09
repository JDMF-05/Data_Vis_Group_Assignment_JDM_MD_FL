const SHEET_URL =
  "https://opensheet.vercel.app/1VfAJhE8r2Iv3NWEOd8x1DKSeSARmPzzFgqi_I-rrCVc/google_doc";

let SHEET_DATA = null;

document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("artist_name");
  const status = document.getElementById("status_msg");
  const box = document.getElementById("autocomplete");
  const canvas = document.getElementById("top5_canvas");
  const ctx = canvas.getContext("2d");

  status.textContent = "Loading...";

  // load both files
  const [sheetRes, artistsRes] = await Promise.all([
    fetch(SHEET_URL),
    fetch(ARTISTS_URL)
  ]);

  SHEET_DATA = await sheetRes.json();
  const artistsText = await artistsRes.text();

  ARTIST_INDEX = buildArtistIndex(
    artistsText.split(/\r?\n/).filter(Boolean)
  );

  status.textContent = "Ready";

  // AUTOCOMPLETE
  input.addEventListener("input", () => {
    const q = input.value;
    const results = searchArtists(q, 10);

    box.innerHTML = "";
    if (!q || !results.length) {
      box.style.display = "none";
      return;
    }

    const r = input.getBoundingClientRect();
    box.style.left = r.left + "px";
    box.style.top = r.bottom + 4 + "px";
    box.style.width = r.width + "px";

    results.forEach(a => {
      const item = document.createElement("div");
      item.className = "autocomplete-item";
      item.textContent = a.original;
      item.onclick = () => {
        input.value = a.original;
        box.style.display = "none";
      };
      box.appendChild(item);
    });

    box.style.display = "block";
  });

  document.addEventListener("click", e => {
    if (!box.contains(e.target) && e.target !== input) {
      box.style.display = "none";
    }
  });

  // GENERATE POSTER
  document.getElementById("generate_top5").onclick = () => {
    const query = input.value;
    const best = bestArtistForQuery(query);
    if (!best) {
      status.textContent = "No matching artist";
      return;
    }

    const rows = SHEET_DATA.filter(r =>
      normalize(r.Artista) === normalize(best)
    );

    rows.sort((a, b) => (+b.Somma_rank) - (+a.Somma_rank));
    const top5 = rows.slice(0, 5);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.style.display = "block";
      ctx.drawImage(img, 0, 0);

      drawArtistName(ctx, best);
      drawSongs(ctx, top5);

      status.textContent = "Poster ready";
      document.getElementById("download_btn").style.display = "inline-block";
    };

    img.src = TEMPLATE_URL;
  };

  // DOWNLOAD
  document.getElementById("download_btn").onclick = () => {
    const link = document.createElement("a");
    link.download = "top5-poster.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
});
