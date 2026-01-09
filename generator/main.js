const SHEET_URL =
  "https://opensheet.vercel.app/1sT4nCPZMtuQAb2p1M669HpNv7yRFd2Q6Kjxnd5qtnXM/google_doc";

let SHEET_DATA = null;

/* =========================
   CLEAR UI
========================= */

function clearPosterUI() {
  const preview = document.getElementById("poster_preview");
  if (preview) preview.style.display = "none";

  const canvas = document.getElementById("top5_canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = "none";
  }

  document.getElementById("download_btn").style.display = "none";
  document.getElementById("reset_btn").style.display = "none";
}

/* =========================
   APP
========================= */

document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("artist_name");
  const status = document.getElementById("status_msg");
  const canvas = document.getElementById("top5_canvas");
  const ctx = canvas.getContext("2d");

  const preview = document.getElementById("poster_preview");
  const previewCanvas = document.getElementById("preview_canvas");

  const modal = document.getElementById("poster_modal");
  const modalCanvas = document.getElementById("modal_canvas");
  const closeModal = document.getElementById("close_modal");

  /* ===== MODAL HELPERS ===== */

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
     GENERATE POSTER
  ========================= */

  document.getElementById("generate_top5").onclick = async () => {
    clearPosterUI();

    const best = bestArtistForQuery(input.value);
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
      drawArtistName(ctx, best);
      drawSongs(ctx, rows);

      /* ===== PREVIEW ===== */
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

  document.getElementById("reset_btn").onclick = () => {
    input.value = "";
    status.textContent = "";
    clearPosterUI();
  };
});
