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

// Red bars (SHIFTED RIGHT TO AVOID TEMPLATE NUMBERS)
const BAR_LEFT_X = 170;
const BAR_RIGHT_X = 935;
const BAR_WIDTH = BAR_RIGHT_X - BAR_LEFT_X;
const BAR_HEIGHT = 52;

// Text padding inside bars
const BAR_PADDING_X = 140;

/* =========================
   ROW POSITIONS (ABSOLUTE)
========================= */

const BAR_TOP_Y = [625, 780, 920, 1050, 1190];

// Title nudges
const TITLE_NUDGE_Y = [0, -10, -10, 0, 0];

// Prevent touching bar edges
const TITLE_CLAMP_Y = 14;

// Metadata spacing
const META_OFFSET_Y = 48;

// Metadata columns
const RANK_X = 690;
const DATE_X = 820;

/* =========================
   UTIL
========================= */

function fitText(ctx, text, maxWidth, baseSize, weight = 700) {
  let size = baseSize;
  ctx.font = `${weight} ${size}px 'Zalando Sans Expanded', sans-serif`;

  // limit shrinking
  while (ctx.measureText(text).width > maxWidth && size > 32) {
    size--;
    ctx.font = `${weight} ${size}px 'Zalando Sans Expanded', sans-serif`;
  }
  return size;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function capitalizeFirstLetter(str = "") {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* =========================
   ARTIST
========================= */

function drawArtistName(ctx, artist) {
  const displayArtist = capitalizeFirstLetter(artist);

  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const size = fitText(ctx, displayArtist, ARTIST_MAX_WIDTH, 140, 900);
  ctx.font = `900 ${size}px 'Zalando Sans Expanded', sans-serif`;

  ctx.fillText(displayArtist, ARTIST_CENTER_X, ARTIST_BASELINE_Y);
}

/* =========================
   SONGS
========================= */

function drawSongs(ctx, rows) {
  // Sort by chart rank (numeric)
  const sortedRows = [...rows].sort(
    (a, b) =>
      Number(a.Miglior_posto_Canzone) - Number(b.Miglior_posto_Canzone)
  );

  sortedRows.forEach((row, i) => {
    const barTop = BAR_TOP_Y[i];

    /* =====================
       TITLE
    ===================== */

    const title = row.Canzone || "";
    const maxTitleWidth = BAR_WIDTH - BAR_PADDING_X * 2;
    const titleSize = fitText(ctx, title, maxTitleWidth, 44, 700);

    ctx.font = `700 ${titleSize}px 'Zalando Sans Expanded', sans-serif`;
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const rawTitleY = BAR_HEIGHT / 2 + (TITLE_NUDGE_Y[i] || 0);
    const titleY =
      barTop +
      clamp(rawTitleY, TITLE_CLAMP_Y, BAR_HEIGHT - TITLE_CLAMP_Y);

    ctx.save();
    ctx.beginPath();
    ctx.rect(BAR_LEFT_X, barTop, BAR_WIDTH, BAR_HEIGHT);
    ctx.clip();

    ctx.fillText(title, BAR_LEFT_X + BAR_PADDING_X, titleY);

    ctx.restore();

    /* =====================
       METADATA
    ===================== */

    ctx.font = "500 28px 'Zalando Sans Expanded', sans-serif";
    ctx.textBaseline = "alphabetic";

    const metaY = barTop + BAR_HEIGHT + META_OFFSET_Y;

    // Appearances
    ctx.textAlign = "left";
    ctx.fillText(
      `appeared ${row.Numero_comparse} times`,
      BAR_LEFT_X + BAR_PADDING_X,
      metaY
    );

    // Rank
    ctx.textAlign = "right";
    ctx.fillText(`#${row.Miglior_posto_Canzone}`, RANK_X, metaY);

    // Date
    ctx.textAlign = "left";
    ctx.fillText(row.Data_miglior_posto, DATE_X, metaY);
  });
}
