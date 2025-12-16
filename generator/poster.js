/* =========================
   TEMPLATE
========================= */

const TEMPLATE_URL =
  "https://raw.githubusercontent.com/JDMF-05/Data_Vis_Group_Assignment_JDM_MD_FL/main/generator/template_1.png";

/* =========================
   LAYOUT
========================= */

// Artist name
const ARTIST_CENTER_X = 540;
const ARTIST_BASELINE_Y = 520;
const ARTIST_MAX_WIDTH = 900;

// 🔴 Red bars — MOVED TO THE RIGHT
const BAR_LEFT_X = 260;
const BAR_RIGHT_X = 975;
const BAR_WIDTH = BAR_RIGHT_X - BAR_LEFT_X;
const BAR_HEIGHT = 52;
const BAR_PADDING_X = 18;

// Base vertical grid
const BAR_TOP_START = 600;
const BAR_GAP = 115;

// ✅ Hand-tuned row offsets (from your screenshots)
const EXTRA_ROW_SHIFT_Y = [
  25,   // row 1 → just a bit
  85,   // row 2 → a lot
  105,  // row 3 → even more
  90,   // row 4
  85    // row 5
];

// Metadata spacing
const META_OFFSET_Y = 26;

/* =========================
   UTIL
========================= */

function fitText(ctx, text, maxWidth, baseSize, weight = 700) {
  let size = baseSize;
  ctx.font = `${weight} ${size}px 'Zalando Sans Expanded', sans-serif`;

  while (ctx.measureText(text).width > maxWidth && size > 14) {
    size--;
    ctx.font = `${weight} ${size}px 'Zalando Sans Expanded', sans-serif`;
  }
  return size;
}

/* =========================
   ARTIST
========================= */

function drawArtistName(ctx, artist) {
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const size = fitText(ctx, artist, ARTIST_MAX_WIDTH, 120, 900);
  ctx.font = `900 ${size}px 'Zalando Sans Expanded', sans-serif`;
  ctx.fillText(artist, ARTIST_CENTER_X, ARTIST_BASELINE_Y);
}

/* =========================
   SONGS
========================= */

function drawSongs(ctx, rows) {
  rows.forEach((row, i) => {
    const barTop =
      BAR_TOP_START + i * BAR_GAP + (EXTRA_ROW_SHIFT_Y[i] || 0);

    /* =====================
       TITLE — INSIDE RED BAR
    ===================== */

    const title = row.Canzone || "";
    const maxTitleWidth = BAR_WIDTH - BAR_PADDING_X * 2;
    const titleSize = fitText(ctx, title, maxTitleWidth, 32, 700);

    ctx.font = `700 ${titleSize}px 'Zalando Sans Expanded', sans-serif`;
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    // Perfect vertical centering
    const titleBaseline =
      barTop + BAR_HEIGHT / 2 + titleSize * 0.35;

    // Hard clip so title NEVER escapes the bar
    ctx.save();
    ctx.beginPath();
    ctx.rect(BAR_LEFT_X, barTop, BAR_WIDTH, BAR_HEIGHT);
    ctx.clip();

    ctx.fillText(
      title,
      BAR_LEFT_X + BAR_PADDING_X,
      titleBaseline
    );

    ctx.restore();

    /* =====================
       METADATA — BELOW BAR
    ===================== */

    ctx.font = "400 20px 'Zalando Sans Expanded', sans-serif";
    const metaY = barTop + BAR_HEIGHT + META_OFFSET_Y;

    ctx.fillText(
      `appeared ${row.Numero_comparse} times`,
      BAR_LEFT_X + BAR_PADDING_X,
      metaY
    );

    ctx.fillText(
      `#${row.Miglior_posto_Canzone}`,
      BAR_RIGHT_X - 150,
      metaY
    );

    ctx.fillText(
      row.Data_miglior_posto,
      BAR_RIGHT_X - 20,
      metaY
    );
  });
}
