/* =========================
   TEMPLATE
========================= */

const TEMPLATE_URL =
  "https://raw.githubusercontent.com/JDMF-05/Data_Vis_Group_Assignment_JDM_MD_FL/main/generator/template_1.png";

/* =========================
   LAYOUT CONSTANTS
========================= */

// Artist name
const ARTIST_CENTER_X = 540;
const ARTIST_BASELINE_Y = 520;
const ARTIST_MAX_WIDTH = 900;

// Red bars geometry
const BAR_LEFT_X = 170;
const BAR_RIGHT_X = 900;
const BAR_TEXT_PADDING = 18;

// Vertical positions (aligned to template)
const PANEL_CENTERS = [620, 800, 980, 1160, 1340];

// Vertical offsets
const META_OFFSET_Y = 36;

/* =========================
   UTILITIES
========================= */

// Auto-fit text to a maximum width
function fitText(ctx, text, maxWidth, baseSize, fontWeight = 700) {
  let size = baseSize;
  ctx.font = `${fontWeight} ${size}px 'Zalando Sans Expanded', sans-serif`;

  while (ctx.measureText(text).width > maxWidth && size > 12) {
    size -= 1;
    ctx.font = `${fontWeight} ${size}px 'Zalando Sans Expanded', sans-serif`;
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
   SONG PANELS
========================= */

function drawSongs(ctx, rows) {
  rows.forEach((row, i) => {
    const cy = PANEL_CENTERS[i];

    /* --- RANK NUMBER (1–5) --- */
    ctx.fillStyle = "#000";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = "900 32px 'Zalando Sans Expanded', sans-serif";

    ctx.fillText(
      i + 1,
      BAR_LEFT_X - 24,
      cy
    );

    /* --- SONG TITLE (centered inside red bar) --- */
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const maxTitleWidth =
      BAR_RIGHT_X - BAR_LEFT_X - BAR_TEXT_PADDING * 2;

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
      BAR_LEFT_X + BAR_TEXT_PADDING,
      cy
    );

    /* --- METADATA (below bar) --- */
    ctx.textBaseline = "alphabetic";
    ctx.font = "400 20px 'Zalando Sans Expanded', sans-serif";

    const metaY = cy + META_OFFSET_Y;

    ctx.fillText(
      `appeared ${row.Numero_comparse} times`,
      BAR_LEFT_X + BAR_TEXT_PADDING,
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
