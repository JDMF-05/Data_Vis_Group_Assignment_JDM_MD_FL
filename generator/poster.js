/* =========================
   TEMPLATE
========================= */

const TEMPLATE_URL =
  "https://raw.githubusercontent.com/JDMF-05/Data_Vis_Group_Assignment_JDM_MD_FL/main/generator/template_1.png";

/* =========================
   GLOBAL LAYOUT
========================= */

// Artist name
const ARTIST_CENTER_X = 540;
const ARTIST_BASELINE_Y = 520;
const ARTIST_MAX_WIDTH = 900;

// Red bars geometry
const BAR_LEFT_X = 170;
const BAR_RIGHT_X = 900;
const BAR_WIDTH = BAR_RIGHT_X - BAR_LEFT_X;
const BAR_HEIGHT = 52;
const BAR_PADDING_X = 18;

// 🔴 Top Y of each red bar (template-tuned)
const BAR_TOPS = [
  566,  // row 1 (intentionally higher)
  742,  // row 2
  892,  // row 3
  1042, // row 4
  1192  // row 5
];

// Text positions relative to bar top
const TITLE_BASELINE_FROM_TOP = 30;
const META_BASELINE_FROM_TOP  = 76;

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
   ARTIST NAME
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
   SONG LIST
========================= */

function drawSongs(ctx, rows) {
  rows.forEach((row, i) => {
    const barTop = BAR_TOPS[i];

    /* --- SONG TITLE (INSIDE RED BAR) --- */
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    const maxTitleWidth = BAR_WIDTH - BAR_PADDING_X * 2;
    const title = row.Canzone || "";

    const titleSize = fitText(ctx, title, maxTitleWidth, 34, 700);
    ctx.font = `700 ${titleSize}px 'Zalando Sans Expanded', sans-serif`;

    // Clip title strictly to red bar
    ctx.save();
    ctx.beginPath();
    ctx.rect(BAR_LEFT_X, barTop, BAR_WIDTH, BAR_HEIGHT);
    ctx.clip();

    ctx.fillText(
      title,
      BAR_LEFT_X + BAR_PADDING_X,
      barTop + TITLE_BASELINE_FROM_TOP
    );

    ctx.restore();

    /* --- METADATA (BELOW BAR) --- */
    ctx.font = "400 20px 'Zalando Sans Expanded', sans-serif";

    const metaY = barTop + META_BASELINE_FROM_TOP;

    ctx.fillText(
      `appeared ${row.Numero_comparse} times`,
      BAR_LEFT_X + BAR_PADDING_X,
      metaY
    );

    ctx.fillText(
      `#${row.Miglior_posto_Canzone}`,
      BAR_RIGHT_X - 170,
      metaY
    );

    ctx.fillText(
      row.Data_miglior_posto,
      BAR_RIGHT_X - 40,
      metaY
    );
  });
}
