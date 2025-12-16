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

// Red bars
const BAR_LEFT_X = 170;
const BAR_RIGHT_X = 900;
const BAR_TEXT_PADDING = 18;

// Panel vertical centers (aligned to template)
const PANEL_CENTERS = [620, 800, 980, 1160, 1340];

/* =========================
   UTILITIES
========================= */

// Auto-fit text to a max width
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

    /* --- SONG TITLE (inside red bar) --- */
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";

    const maxTitleWidth =
      BAR_RIGHT_X - BAR_LEFT_X - BAR_TEXT_PADDING * 2;

    const titleSize = fitText(
      ctx,
      row.Canzone || "",
      maxTitleWidth,
      36,
      700
    );

    ctx.font = `700 ${titleSize}px 'Zalando Sans Expanded', sans-serif`;
    ctx.fillText(
      row.Canzone || "",
      BAR_LEFT_X + BAR_TEXT_PADDING,
      cy + 12
    );

    /* --- METADATA (below bar) --- */
    ctx.font = "400 22px 'Zalando Sans Expanded', sans-serif";

    const appearances = `appeared ${row.Numero_comparse} times`;
    const bestRank = `#${row.Miglior_posto_Canzone}`;
    const bestDate = row.Data_miglior_posto;

    ctx.fillText(
      appearances,
      BAR_LEFT_X + BAR_TEXT_PADDING,
      cy + 44
    );

    ctx.fillText(
      bestRank,
      BAR_RIGHT_X - 180,
      cy + 44
    );

    ctx.fillText(
      bestDate,
      BAR_RIGHT_X - 40,
      cy + 44
    );
  });
}
