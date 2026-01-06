const SHEET_URL =
  "https://opensheet.vercel.app/1sT4nCPZMtuQAb2p1M669HpNv7yRFd2Q6Kjxnd5qtnXM/google_doc";

let SHEET_DATA = null;

/* =========================
   EASTER EGGS
========================= */

const EASTER_EGGS = [
  {
    trigger: "Banana",
    embedHTML: `
      <div class="tenor-gif-embed" data-postid="26063026" data-share-method="host" data-aspect-ratio="1.50235" data-width="100%">
        <a href="https://tenor.com/view/peely-the-shame-meme-cringe-caught-gif-26063026">Peely The Shame GIF</a>
        from <a href="https://tenor.com/search/peely-gifs">Peely GIFs</a>
      </div>
    `
  },
  {
    trigger: "Mattia Dellamonica",
    embedHTML: `
      <div class="tenor-gif-embed" data-postid="8510554628372069925" data-share-method="host" data-aspect-ratio="0.779116" data-width="100%">
        <a href="https://tenor.com/view/cat-gun-gif-8510554628372069925">Cat Gun GIF</a>
        from <a href="https://tenor.com/search/cat+gun-gifs">Cat Gun GIFs</a>
      </div>
    `
  },
  {
    trigger: "Federico Lombardo",
    embedHTML: `
      <div class="tenor-gif-embed" data-postid="13290601400007972669" data-share-method="host" data-aspect-ratio="1" data-width="100%">
        <a href="https://tenor.com/view/gundam-mobile-suit-gundam-mcdonald%27s-char-aznable-char-gundam-gif-13290601400007972669">Gundam GIF</a>
        from <a href="https://tenor.com/search/gundam-gifs">Gundam GIFs</a>
      </div>
    `
  },
  {
    trigger: "Joshua Moshi",
    embedHTML: `
      <div class="tenor-gif-embed" data-postid="5319769" data-share-method="host" data-aspect-ratio="0.715" data-width="100%">
        <a href="https://tenor.com/view/futurama-bender-dance-gif-5319769">Bender Dancing GIF</a>
        from <a href="https://tenor.com/search/futurama-gifs">Futurama GIFs</a>
      </div>
    `
  }
];

function loadTenorScript() {
  const old = document.getElementById("tenor-embed-js");
  if (old) old.remove();

  const s = document.createElement("script");
  s.id = "tenor-embed-js";
  s.async = true;
  s.src = "https://tenor.com/embed.js";
  document.body.appendChild(s);
}

function clearEasterEgg() {
  const el = document.getElementById("easter_egg");
  el.innerHTML = "";
  el.style.display = "none";
}

function showEasterEggIfAny(query) {
  const el = document.getElementById("easter_egg");
  const q = normalize(query);

  const match = EASTER_EGGS.find(e => normalize(e.trigger) === q);
  if (!match) {
    clearEasterEgg();
    return;
  }

  el.innerHTML = match.embedHTML;
  el.style.display = "block";
  loadTenorScript();
}

/* =========================
   APP
========================= */

document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("artist_name");
  const status = document.getElementById("status_msg");
  const box = document.getElementById("autocomplete");
  const canvas = document.getElementById("top5_canvas");
  const ctx = canvas.getContext("2d");

  status.textContent = "Loading...";

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

  document.getElementById("generate_top5").onclick = async () => {
    const query = input.value;

    showEasterEggIfAny(query);

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

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.style.display = "block";
      ctx.drawImage(img, 0, 0);

      await document.fonts.load("900 120px 'Zalando Sans Expanded'");
      await document.fonts.load("700 34px 'Zalando Sans Expanded'");
      await document.fonts.load("400 20px 'Zalando Sans Expanded'");

      drawArtistName(ctx, best);
      drawSongs(ctx, top5);

      status.textContent = "Poster ready";
      download_btn.style.display = "inline-block";
      reset_btn.style.display = "inline-block";
    };

    img.src = getRandomTemplate() + "?cache=" + Date.now();
  };

  document.getElementById("reset_btn").onclick = () => {
    input.value = "";
    canvas.style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearEasterEgg();
  };
});
