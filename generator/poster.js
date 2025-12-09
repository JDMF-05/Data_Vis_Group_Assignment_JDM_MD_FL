const TEMPLATE_URL =
  "https://freight.cargo.site/t/original/i/W2687942959401309016670551378695/template.png";

const PANEL_CENTERS = [520, 779, 1038, 1297, 1567];
const PANELS = PANEL_CENTERS.map(cy => ({
  xLeft: 170,
  xRight: 580,
  nameY: cy - 40,
  bestY: cy,
  sumY: cy + 50
}));

const ARTIST_CENTER_X = 540;
const ARTIST_BASELINE_Y = 520;

function drawArtistName(ctx, artist) {
  ctx.fillStyle = "rgb(217,189,76)";
  ctx.textAlign = "center";
  ctx.font = "700 128px 'Playfair Display'";
  ctx.fillText(artist, ARTIST_CENTER_X, ARTIST_BASELINE_Y);
}

function drawSongs(ctx, rows) {
  rows.forEach((row, i) => {
    const p = PANELS[i];
    ctx.fillStyle = "#000";
    ctx.textAlign = "left";

    ctx.font = "700 27.8px 'Poppins'";
    ctx.fillText(row.Canzone || "", p.xLeft, p.nameY);

    ctx.font = "400 21.3px 'Poppins'";
    ctx.fillText(`Best_Rank: ${row.Miglior_posto_Canzone}`, p.xLeft, p.bestY);
    ctx.fillText(`Date_Best_Rank: ${row.Data_miglior_posto}`, p.xRight, p.bestY);
    ctx.fillText(`Sum_Ranks: ${row.Somma_rank}`, p.xLeft, p.sumY);
    ctx.fillText(`Sum_appearances: ${row.Numero_comparse}`, p.xRight, p.sumY);
  });
}
