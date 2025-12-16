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
const BAR_PADDING_X = 18;

// 🔴 TOP of each red bar (THIS is the key fix)
const BAR_TOPS = [
  610, // 1
  760, // 2
  910, // 3
  1060, // 4
  1210 // 5
];

// Offsets inside / below bar
const TITLE_OFFSET_Y = 32;   // text baseline from bar top
const META_OFFSET_Y = 62;    // metadata baseline from bar top

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

  const size = fitText(
    ctx,
    artist,
    ARTIST_MAX_WIDTH,
    120,
    900
  );

  ctx.font = `900 ${size}px 'Zalando Sans Expanded', sans-serif`;
  ctx.fillText(artist, ARTIST_CENTER_X, ARTIST_BASELINE_Y);
}

/* =========================
   SONG LIST
========================= */

function drawSongs(ctx, rows) {
  rows.forEach((row, i) => {
    const barTop = BAR_TOPS[i];

    /* --- RANK NUMBER --- */
    ctx.fillStyle = "#000";
    ctx.textAlign = "right";
    ctx.textBaseline = "alphabetic";
    ctx.font = "900 32px 'Zalando Sans Expanded', sans-serif";

    ctx.fillText(
      i + 1,
      BAR_LEFT_X - 28,
      barTop + TITLE_OFFSET_Y
    );

    /* --- SONG TITLE (TOP-ALIGNED, NOT CENTERED) --- */
    ctx.textAlign = "left";

    const maxTitleWidth =
      BAR_RIGHT_X - BAR_LEFT_X - BAR_PADDING_X * 2;

    const titleSize = fitText(
      ctx,
      row.Canzone || "",
      maxTitleWidth,
      34,
      700
    );

    ctx.font = `700 ${titleSize}px 'Zalando Sans Expanded', sans-serif`;

    ctx.fillText(
      row.Canzone || "",
      BAR_LEFT_X + BAR_PADDING_X,
      barTop + TITLE_OFFSET_Y
    );

    /* --- METADATA (EXACTLY LIKE REFERENCE) --- */
    ctx.font = "400 20px 'Zalando Sans Expanded', sans-serif";

    ctx.fillText(
      `appeared ${row.Numero_comparse} times`,
      BAR_LEFT_X + BAR_PADDING_X,
      barTop + META_OFFSET_Y
    );

    ctx.fillText(
      `#${row.Miglior_posto_Canzone}`,
      BAR_RIGHT_X - 170,
      barTop + META_OFFSET_Y
    );

    ctx.fillText(
      row.Data_miglior_posto,
      BAR_RIGHT_X - 40,
      barTop + META_OFFSET_Y
    );
  });
}
