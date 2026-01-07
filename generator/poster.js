/* =========================
   TEMPLATES
========================= */

const TEMPLATE_URLS = [
  "https://raw.githubusercontent.com/JDMF-05/Data_Vis_Group_Assignment_JDM_MD_FL/main/generator/template_f_1.png",
  "https://raw.githubusercontent.com/JDMF-05/Data_Vis_Group_Assignment_JDM_MD_FL/main/generator/template_f_2.png",
  "https://raw.githubusercontent.com/JDMF-05/Data_Vis_Group_Assignment_JDM_MD_FL/main/generator/template_f_3.png"
];

function getRandomTemplate() {
  const i = Math.floor(Math.random() * TEMPLATE_URLS.length);
  return TEMPLATE_URLS[i];
}

/* =========================
   LAYOUT
========================= */

// Artist name
const ARTIST_CENTER_X = 450;
const ARTIST_BASELINE_Y = 200;
const ARTIST_MAX_WIDTH = 900;

// Bars
const BAR_LEFT_X = 170;
const BAR_RIGHT_X = 935;
const BAR_WIDTH = BAR_RIGHT_X - BAR_LEFT_X;
const BAR_HEIGHT = 52;

// Text padding inside bars
const BAR_PADDING_X = 140;

/* =========================
   ROW POSITIONS
========================= */

const BAR_TOP_Y = [625, 780, 920, 1050, 1190];
const TITLE_NUDGE_Y = [0, -10, -10, 0, 0];
const TITLE_CLAMP_Y = 14;

const META_OFFSET_Y = 48;
const RANK_X = 690;
const DATE_X = 820;

/* =========================
   UTIL
========================= */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Capitalize every word of artist name
function capitalizeArtistName(str = "") {
  if (!str) return "";
  return str
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Shrink ONLY artist name font
function fitArtistText(ctx, text, maxWidth, baseSize) {
  let size = baseSize;
  ctx.font = `900 ${size}px 'Zalando Sans Expanded', sans-serif`;

  while (ctx.measureText(text).width > maxWidth && size > 60) {
    size--;
    ctx.font = `900 ${size}px 'Zalando Sans Expanded', sans-serif`;
  }
  return size;
}

// Truncate text with "..." — NO shrinking
function truncateText(ctx, text, maxWidth, font) {
  ctx.font = font;

  if (ctx.measureText(text).width <= maxWidth) {
    return text;
  }

  let truncated = text;
  while (
    truncated.length > 0 &&
    ctx.measureText(truncated + "...").width > maxWidth
  ) {
    truncated = truncated.slice(0, -1);
  }

  return truncated + "...";
}

/* =========================
   ARTIST
========================= */

function drawArtistName(ctx, artist) {
  const displayArtist = capitalizeArtistName(artist);

  ctx.fillStyle = "#000";
  ctx.textBaseline = "alphabetic";

  // Fit font size (artist only)
  const size = fitArtistText(ctx, displayArtist, ARTIST_MAX_WIDTH, 140);
  ctx.font = `900 ${size}px 'Zalando Sans Expanded', sans-serif`;

  // Measure width to avoid clipping
  const textWidth = ctx.measureText(displayArtist).width;
  const canvasWidth = ctx.canvas.width;

  // Clamp center position safely
  const safeCenterX = Math.max(
    textWidth / 2 + 20,
    Math.min(canvasWidth - textWidth / 2 - 20, ARTIST_CENTER_X)
  );

  ctx.textAlign = "center";
  ctx.fillText(displayArtist, safeCenterX, ARTIST_BASELINE_Y);
}

/* =========================
   SONGS
========================= */

function drawSongs(ctx, rows) {
  // Sort by rank (invalid last)
  const sortedRows = [...rows].sort((a, b) => {
    const ra = Number(a.Miglior_posto_Canzone);
    const rb = Number(b.Miglior_posto_Canzone);
    if (isNaN(ra)) return 1;
    if (isNaN(rb)) return -1;
    return ra - rb;
  });

  // Always draw 5 rows
  for (let i = 0; i < 5; i++) {
    const barTop = BAR_TOP_Y[i];
    const row = sortedRows[i];

    const hasValidSong =
      row &&
      row.Canzone &&
      row.Canzone.trim() !== "" &&
      !isNaN(Number(row.Miglior_posto_Canzone));

    /* ===== TITLE ===== */

    const title = hasValidSong ? row.Canzone : "...";

    // Truncate later (matches screenshot)
    const maxTitleWidth = BAR_WIDTH - BAR_PADDING_X - 20;
    const titleFont = "700 44px 'Zalando Sans Expanded', sans-serif";
    const displayTitle = truncateText(ctx, title, maxTitleWidth, titleFont);

    ctx.font = titleFont;
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const rawTitleY = BAR_HEIGHT / 2 + (TITLE_NUDGE_Y[i] || 0);
    const titleY =
      barTop +
      clamp(rawTitleY, TITLE_CLAMP_Y, BAR_HEIGHT - TITLE_CLAMP_Y);

    ctx.save();
    ctx.beginPath();
    ctx.rect(
     BAR_LEFT_X,
     barTop - 6,          
     BAR_WIDTH,
     BAR_HEIGHT + 12 
    );
    ctx.clip();

    ctx.fillText(displayTitle, BAR_LEFT_X + BAR_PADDING_X, titleY);
    ctx.restore();

    if (!hasValidSong) continue;

    /* ===== METADATA ===== */

    ctx.font = "500 28px 'Zalando Sans Expanded', sans-serif";
    ctx.textBaseline = "alphabetic";

    const metaY = barTop + BAR_HEIGHT + META_OFFSET_Y;

    ctx.textAlign = "left";
    ctx.fillText(
      `appeared ${row.Numero_comparse} times`,
      BAR_LEFT_X + BAR_PADDING_X,
      metaY
    );

    ctx.textAlign = "right";
    ctx.fillText(`#${row.Miglior_posto_Canzone}`, RANK_X, metaY);

    ctx.textAlign = "right";
    ctx.fillText(row.Data_miglior_posto, DATE_X, metaY);
  }
}
