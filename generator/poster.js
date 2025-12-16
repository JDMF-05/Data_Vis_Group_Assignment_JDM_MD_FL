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

// 🔴 Red bars
const BAR_LEFT_X = 260;
const BAR_RIGHT_X = 975;
const BAR_WIDTH = BAR_RIGHT_X - BAR_LEFT_X;
const BAR_HEIGHT = 52;
const BAR_PADDING_X = 18;

// Vertical grid
const BAR_TOP_START = 600;
const BAR_GAP = 115;

// Row layout offsets (background alignment)
const EXTRA_ROW_SHIFT_Y = [25, 85, 105, 90, 85];

// 🔧 TITLE MOVEMENTS — EXACTLY AS REQUESTED
const TITLE_NUDGE_Y = [
  0,    // 1st → perfect
  -22,  // 2nd → UP A LOT
  -10,  // 3rd → up a bit
  6,    // 4th → down a bit
  24    // 5th → DOWN A LOT
];

// Metadata spacing
const META_OFFSET_Y = 38;

// Right metadata column
const META_RIGHT_X = 820;

// Rank vertical offset (separate line)
const RANK_OFFSET_Y = -14;

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
       TITLE — RED BAR
    ===================== */

    const title = row.Canzone || "";
    const maxTitleWidth = BAR_WIDTH - BAR_PADDING_X * 2;
    const titleSize = fitText(ctx, title, maxTitleWidth, 32, 700);

    ctx.font = `700 ${titleSize}px 'Zalando Sans Expanded', sans-serif`;
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const titleY =
      barTop +
      BAR_HEIGHT / 2 +
      (TITLE_NUDGE_Y[i] || 0);

    ctx.save();
    ctx.beginPath();
    ctx.rect(BAR_LEFT_X, barTop, BAR_WIDTH, BAR_HEIGHT);
    ctx.clip();

    ctx.fillText(title, BAR_LEFT_X + BAR_PADDING_X, titleY);

    ctx.restore();

    /* =====================
       METADATA — BELOW BAR
    ===================== */

    ctx.font = "400 20px 'Zalando Sans Expanded', sans-serif";
    ctx.textBaseline = "alphabetic";

    const metaBaseY = barTop + BAR_HEIGHT + META_OFFSET_Y;

    // Appeared
    ctx.textAlign = "left";
    ctx.fillText(
      `appeared ${row.Numero_comparse} times`,
      BAR_LEFT_X + BAR_PADDING_X,
      metaBaseY
    );

    // Rank — OWN LINE (no overlap ever)
    ctx.textAlign = "right";
    ctx.fillText(
      `#${row.Miglior_posto_Canzone}`,
      META_RIGHT_X,
      metaBaseY + RANK_OFFSET_Y
    );

    // Date — BELOW rank
    ctx.textAlign = "right";
    ctx.fillText(
      row.Data_miglior_posto,
      META_RIGHT_X,
      metaBaseY
    );
  });
}
