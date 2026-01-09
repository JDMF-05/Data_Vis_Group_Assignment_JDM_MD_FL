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
      <div class="tenor-gif-embed"
           data-postid="26063026"
           data-share-method="host"
           data-aspect-ratio="1.50235"
           data-width="100%">
        <a href="https://tenor.com/view/peely-the-shame-meme-cringe-caught-gif-26063026">
          Peely The Shame GIF
        </a>
        from
        <a href="https://tenor.com/search/peely-gifs">
          Peely GIFs
        </a>
      </div>
    `
  },
  {
    trigger: "Mattia Dellamonica",
    embedHTML: `
      <div class="tenor-gif-embed"
           data-postid="8510554628372069925"
           data-share-method="host"
           data-aspect-ratio="0.779116"
           data-width="100%">
        <a href="https://tenor.com/view/cat-gun-gif-8510554628372069925">
          Cat Gun GIF
        </a>
        from
        <a href="https://tenor.com/search/cat+gun-gifs">
          Cat Gun GIFs
        </a>
      </div>
    `
  },
  {
    trigger: "Federico Lombardo",
    embedHTML: `
      <div class="tenor-gif-embed"
           data-postid="13290601400007972669"
           data-share-method="host"
           data-aspect-ratio="1"
           data-width="100%">
        <a href="https://tenor.com/view/gundam-mobile-suit-gundam-mcdonald%27s-char-aznable-char-gundam-gif-13290601400007972669">
          Gundam GIF
        </a>
        from
        <a href="https://tenor.com/search/gundam-gifs">
          Gundam GIFs
        </a>
      </div>
    `
  },
  {
    trigger: "Joshua Moshi",
    embedHTML: `
      <div class="tenor-gif-embed"
           data-postid="5319769"
           data-share-method="host"
           data-aspect-ratio="0.715"
           data-width="100%">
        <a href="https://tenor.com/view/futurama-bender-dance-gif-5319769">
          Bender Dancing GIF
        </a>
        from
        <a href="https://tenor.com/search/futurama-gifs">
          Futurama GIFs
        </a>
      </div>
    `
  },
  {
    trigger: "The Weekend",
    embedHTML: `
      <div class="tenor-gif-embed"
           data-postid="20662583"
           data-share-method="host"
           data-aspect-ratio="1"
           data-width="100%">
        <a href="https://tenor.com/view/honeycardi-the-weeknd-abel-abel-tesfaye-gif-20662583">
          Honeycardi The Weeknd GIF
        </a>
        from
        <a href="https://tenor.com/search/honeycardi-gifs">
          Honeycardi GIFs
        </a>
      </div>
    `
  }
];

/* =========================
   TENOR
========================= */

function loadTenorScript() {
  const old = document.getElementById("tenor-embed-js");
  if (old) old.remove();

  const s = document.createElement("script");
  s.id = "tenor-embed-js";
  s.async = true;
  s.src = "https://tenor.com/embed.js";
  document.body.appendChild(s);
}

/* =========================
   CLEAR UI
========================= */

function clearPosterUI() {
  const preview = document.getElementById("poster_preview");
  if (preview) preview.style.display = "none";

  const canvas = document.getElementById("top5_canvas");
  if (canvas) {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = "none";
  }

  const modal = document.getElementById("poster_modal");
  if (modal) modal.classList.remove("open");
  document.body.classList.remove("modal-open");

  document.getElementById("download_btn").style.display = "none";
  document.getElementById("reset_btn").style.display = "none";
}

function clearEasterEgg() {
  const el = document.getElementById("easter_egg");
  if (!el) return;
  el.innerHTML = "";
  el.style.display = "none";
}

function showEasterEggIfAny(query) {
  if (typeof normalize !== "function") return false;

  const el = document.getElementById("easter_egg");
  if (!el) return false;

  const q = normalize(query);
  const match = EASTER_EGGS.find(e => normalize(e.trigger) === q);

  if (!match) {
    clearEasterEgg();
    return false;
  }

  clearPosterUI();
  el.innerHTML = match.embedHTML;
  el.style.display = "block";
  loadTenorScript();

  return true;
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

  const preview = document.getElementById("poster_preview");
  const previewCanvas = document.getElementById("preview_canvas");

  const modal = document.getElementById("poster_modal");
  const modalCanvas = document.getElementById("modal_canvas");
  const closeModal = document.getElementById("close_modal");

  /* ===== MODAL ===== */

  function openModal() {
    modal.classList.add("open");
    document.body.classList.add("modal-open");
  }

  function closeModalFn() {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  closeModal.onclick = closeModalFn;

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModalFn();
  });

  preview.onclick = () => {
    modalCanvas.width = canvas.width;
    modalCanvas.height = canvas.height;
    modalCanvas.getContext("2d").drawImage(canvas, 0, 0);
    openModal();
  };

  /* =========================
     LOAD DATA
  ========================= */

  const [sheetRes, artistsRes] = await Promise.all([
    fetch(SHEET_URL),
    fetch(ARTISTS_URL)
  ]);

  SHEET_DATA = await sheetRes.json();
  ARTIST_INDEX = buildArtistIndex(
    (await artistsRes.text()).split(/\r?\n/).filter(Boolean)
  );

  status.textContent = "Ready";

  /* =========================
     AUTOCOMPLETE
  ========================= */

  input.addEventListener("input", () => {
    const q = input.value;
    const results = searchArtists(q, 10);

    box.innerHTML = "";
    if (!q || !results.length) {
      box.style.display = "none";
      return;
    }

    const r = input.getBoundingClientRect();
    box.style.left = `${r.left + window.scrollX}px`;
    box.style.top = `${r.bottom + window.scrollY + 4}px`;
    box.style.width = `${r.width}px`;

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

  /* =========================
     GENERATE POSTER
  ========================= */

  document.getElementById("generate_top5").onclick = async () => {
    const query = input.value;

    const hasEasterEgg = showEasterEggIfAny(query);
    if (hasEasterEgg) {
      status.textContent = "Easter egg unlocked";
      return;
    }

    clearEasterEgg();
    clearPosterUI();

    const best = bestArtistForQuery(query);
    if (!best) {
      status.textContent = "No matching artist";
      return;
    }

    const rows = SHEET_DATA
      .filter(r => normalize(r.Artista) === normalize(best))
      .sort((a, b) => (+b.Somma_rank) - (+a.Somma_rank))
      .slice(0, 5);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      await document.fonts.load("900 120px 'Zalando Sans Expanded'");
      await document.fonts.load("700 34px 'Zalando Sans Expanded'");
      await document.fonts.load("400 20px 'Zalando Sans Expanded'");

      drawArtistName(ctx, best);
      drawSongs(ctx, rows);

      const ratio = 0.35;
      previewCanvas.width = canvas.width;
      previewCanvas.height = canvas.height * ratio;

      previewCanvas
        .getContext("2d")
        .drawImage(
          canvas,
          0, 0,
          canvas.width, previewCanvas.height,
          0, 0,
          previewCanvas.width, previewCanvas.height
        );

      preview.style.display = "block";
      status.textContent = "Poster ready";
      document.getElementById("download_btn").style.display = "inline-block";
      document.getElementById("reset_btn").style.display = "inline-block";
    };

    img.src = getRandomTemplate() + "?cache=" + Date.now();
  };

  document.getElementById("download_btn").onclick = () => {
    const link = document.createElement("a");
    link.download = "top5-poster.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  document.getElementById("reset_btn").onclick = () => {
    input.value = "";
    status.textContent = "";
    clearPosterUI();
    clearEasterEgg();
  };
});
