// List of poster background templates.
// One of these is randomly selected each time a poster is generated.
const TEMPLATE_URLS = [
  "https://raw.githubusercontent.com/JDMF-05/Data_Vis_Group_Assignment_JDM_MD_FL/main/generator/template_f_1.png",
  "https://raw.githubusercontent.com/JDMF-05/Data_Vis_Group_Assignment_JDM_MD_FL/main/generator/template_f_2.png",
  "https://raw.githubusercontent.com/JDMF-05/Data_Vis_Group_Assignment_JDM_MD_FL/main/generator/template_f_3.png"
];

// Returns a random template URL from the list above
function getRandomTemplate() {
  const i = Math.floor(Math.random() * TEMPLATE_URLS.length);
  return TEMPLATE_URLS[i];
}

// Layout values for positioning the artist name
const ARTIST_CENTER_X = 450;
const ARTIST_BASELINE_Y = 200;
const ARTIST_MAX_WIDTH = 900;

// Horizontal layout values for song bars
const BAR_LEFT_X = 170;
const BAR_RIGHT_X = 935;
const BAR_WIDTH = BAR_RIGHT_X - BAR_LEFT_X;
const BAR_HEIGHT = 52;

// Horizontal padding used when drawing text inside bars
const BAR_PADDING_X = 140;

// Vertical positions for each song row
const BAR_TOP_Y = [625, 780, 920, 1050, 1190];

// Small vertical adjustments for song titles to match design
const TITLE_NUDGE_Y = [0, -10, -10, 0, 0];

// Limits how far titles can move vertically inside the bar
const TITLE_CLAMP_Y = 14;

// Vertical spacing for metadata below each bar
const META_OFFSET_Y = 48;

// X positions for rank number and date text
const RANK_X = 690;
const DATE_X = BAR_RIGHT_X;

// Ensures a value stays within a minimum and maximum range
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Capitalizes the first letter of every word in the artist name
function capitalizeArtistName(str = "") {
  if (!str) return "";
  return str
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Reduces font size until the artist name fits within the allowed width
// This only affects the artist name, not other text
function fitArtistText(ctx, text, maxWidth, baseSize) {
  let size = baseSize;
  ctx.font = `900 ${size}px 'Zalando Sans Expanded', sans-serif`;

  while (ctx.measureText(text).width > maxWidth && size > 60) {
    size--;
    ctx.font = `900 ${size}px 'Zalando Sans Expanded', sans-serif`;
  }
  return size;
}

// Shortens text and adds "..." if it exceeds the available width
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

// Draws the artist name at the top of the poster
function drawArtistName(ctx, artist) {
  const displayArtist = capitalizeArtistName(artist);

  ctx.fillStyle = "#000";
  ctx.textBaseline = "alphabetic";

// Adjust font size so the name fits without overflowing
  const size = fitArtistText(ctx, displayArtist, ARTIST_MAX_WIDTH, 140);
  ctx.font = `900 ${size}px 'Zalando Sans Expanded', sans-serif`;

// Measure text width to keep it safely inside the canvas
  const textWidth = ctx.measureText(displayArtist).width;
  const canvasWidth = ctx.canvas.width;

// Prevent the text from being clipped near the edges
  const safeCenterX = Math.max(
    textWidth / 2 + 20,
    Math.min(canvasWidth - textWidth / 2 - 20, ARTIST_CENTER_X)
  );

  ctx.textAlign = "center";

// Apply a skew transformation to visually simulate italic text
  ctx.save();
  ctx.translate(safeCenterX, ARTIST_BASELINE_Y);
  ctx.transform(1, 0, -0.25, 1, 0, 0);
  ctx.fillText(displayArtist, 0, 0);
  ctx.restore();
}

// Draws the list of top songs and their metadata
function drawSongs(ctx, rows) {
// Sort songs by best chart position (invalid values are pushed last)
  const sortedRows = [...rows].sort((a, b) => {
    const ra = Number(a.Miglior_posto_Canzone);
    const rb = Number(b.Miglior_posto_Canzone);
    if (isNaN(ra)) return 1;
    if (isNaN(rb)) return -1;
    return ra - rb;
  });

// Always render exactly five rows on the poster
  for (let i = 0; i < 5; i++) {
    const barTop = BAR_TOP_Y[i];
    const row = sortedRows[i];

// Check whether the current row contains valid song data
    const hasValidSong =
      row &&
      row.Canzone &&
      row.Canzone.trim() !== "" &&
      !isNaN(Number(row.Miglior_posto_Canzone));

    const title = hasValidSong ? row.Canzone : "...";

// Calculate available width for the title text
    const maxTitleWidth = BAR_WIDTH - BAR_PADDING_X - 20;
    const titleFont = "700 44px 'Zalando Sans Expanded', sans-serif";
    const displayTitle = truncateText(ctx, title, maxTitleWidth, titleFont);

    ctx.font = titleFont;
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

// Adjust title position slightly for visual balance
    const rawTitleY = BAR_HEIGHT / 2 + (TITLE_NUDGE_Y[i] || 0);
    const titleY =
      barTop +
      clamp(rawTitleY, TITLE_CLAMP_Y, BAR_HEIGHT - TITLE_CLAMP_Y);

// Clip the title so it never overflows the bar area
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

// Draw metadata below the bar (appearances, rank, date)
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
