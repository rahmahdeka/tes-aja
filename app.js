let chartBBU, chartTBU, chartBBTB;

// ===== helper =====
async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}

function getSD(data, x) {
  return data.find(d => d.x == x);
}

// ===== status =====
function statusBBU(bb, sd) {
  if (bb < sd["-3"]) return "Gizi Buruk";
  if (bb < sd["-2"]) return "Gizi Kurang";
  if (bb <= sd["+1"]) return "Normal";
  return "Perlu Konfirmasi Tenaga Kesehatan";
}

function statusTBU(tb, sd) {
  if (tb < sd["-2"]) return "Sangat Pendek (Stunting)";
  if (tb <= sd["+3"]) return "Normal";
  return "Sangat Tinggi";
}

function statusBBTB(bb, sd) {
  if (bb < sd["-3"]) return "Gizi Buruk";
  if (bb < sd["-2"]) return "Gizi Kurang";
  if (bb <= sd["+2"]) return "Normal";
  return "Gizi Lebih";
}

// ===== Rekomendasi (bahasa awam & ramah) =====
function rekomendasiBBU(status) {
  switch (status) {
    case "Gizi Buruk":
      return "Berat badan anak jauh di bawah normal. Sebaiknya segera berkonsultasi dengan tenaga kesehatan agar anak mendapat penanganan yang tepat.";

    case "Gizi Kurang":
      return "Berat badan anak masih kurang dari ideal. Cobalah tingkatkan porsi dan kualitas makanan, serta lakukan pemantauan pertumbuhan secara rutin.";

    case "Normal":
      return "Berat badan anak sudah sesuai dengan usianya. Pertahankan pola makan sehat dan kebiasaan makan yang baik.";

    default:
      return "Berat badan anak di atas kisaran normal. Disarankan untuk berkonsultasi dengan tenaga kesehatan untuk evaluasi lebih lanjut.";
  }
}

function rekomendasiTBU(status) {
  switch (status) {
    case "Sangat Pendek (Stunting)":
      return "Tinggi badan anak lebih pendek dari anak seusianya. Disarankan untuk memeriksakan anak ke tenaga kesehatan agar penyebabnya dapat diketahui dan ditangani sejak dini.";

    case "Normal":
      return "Tinggi badan anak sesuai dengan usianya. Teruskan pemberian gizi seimbang dan stimulasi tumbuh kembang anak.";

    default:
      return "Tinggi badan anak lebih tinggi dari kisaran normal. Sebaiknya dilakukan pemeriksaan untuk memastikan pertumbuhan berjalan sehat.";
  }
}

function rekomendasiBBTB(status) {
  switch (status) {
    case "Gizi Buruk":
      return "Berat badan anak sangat rendah dibandingkan tinggi badannya. Anak perlu segera mendapatkan perhatian dan pendampingan dari tenaga kesehatan.";

    case "Gizi Kurang":
      return "Berat badan anak masih kurang dibandingkan tinggi badannya. Perlu ditingkatkan asupan makan dengan menu bergizi seimbang.";

    case "Normal":
      return "Berat dan tinggi badan anak sudah seimbang. Pertahankan pola makan sehat dan aktivitas yang sesuai dengan usia anak.";

    case "Gizi Lebih":
      return "Berat badan anak lebih tinggi dari yang seharusnya. Sebaiknya perhatikan pola makan dan aktivitas fisik anak agar tetap sehat.";

    default:
      return "";
  }
}



// ===== grafik =====
function makeDataset(json) {
  const colors = ["#7f1d1d","#dc2626","#f59e0b","#16a34a","#f59e0b","#dc2626","#7f1d1d"];
  const labels = ["-3","-2","-1","0","+1","+2","+3"];

  return labels.map((l,i)=>({
    label: l+" SD",
    data: json.data.map(d => d.sd[l]),
    borderColor: colors[i],
    borderWidth: 1,
    fill: false,
    pointRadius: 0
  }));
}

function addAnak(ds, x, y) {
  ds.push({
    label: "Anak Anda",
    type: "scatter",
    data: [{x,y}],
    backgroundColor: "#2563eb",
    pointRadius: 6
  });
}

// ===== main =====
async function hitung() {
  const jk = jkEl.value;
  const usia = +usiaEl.value;
  const bb = +beratEl.value;
  const tb = +tinggiEl.value;

  const gender = jk === "L" ? "L" : "P";

  // ===== BBU =====
  const bbu = await loadJSON(`data/BB_U_${gender}_0_60.json`);
  const sdBBU = getSD(bbu.data, usia);
  const statBBU = statusBBU(bb, sdBBU.sd);

  hasilBBU.innerHTML = `
<b>Status:</b> ${statBBU}<br>
<b>Rekomendasi BB:</b> ± ${sdBBU.sd["0"]} kg<br>
<small>${rekomendasiBBU(statBBU)}</small>
`;


  if (chartBBU) chartBBU.destroy();
  let dsBBU = makeDataset(bbu);
  addAnak(dsBBU, usia, bb);

  chartBBU = new Chart(grafikBBU, {
    type:"line",
    data:{labels:bbu.data.map(d=>d.x),datasets:dsBBU}
  });

  // ===== TBU =====
  const tbuFile = usia<=24 ? `data/PB_U_${gender}_0_24.json` : `data/TB_U_${gender}_24_60.json`;
  const tbu = await loadJSON(tbuFile);
  const sdTBU = getSD(tbu.data, usia);
  const statTBU = statusTBU(tb, sdTBU.sd);

  hasilTBU.innerHTML = `
<b>Status:</b> ${statTBU}<br>
<b>Rekomendasi TB:</b> ± ${sdTBU.sd["0"]} cm<br>
<small>${rekomendasiTBU(statTBU)}</small>
`;



  if (chartTBU) chartTBU.destroy();
  let dsTBU = makeDataset(tbu);
  addAnak(dsTBU, usia, tb);

  chartTBU = new Chart(grafikTBU,{
    type:"line",
    data:{labels:tbu.data.map(d=>d.x),datasets:dsTBU}
  });

  // ===== BBTB =====
  const bbtbFile = usia<=24 ? `data/BB_PB_${gender}_0_24.json` : `data/BB_TB_${gender}_24_60.json`;
  const bbtb = await loadJSON(bbtbFile);
  const sdBBTB = getSD(bbtb.data, tb);
  const statBBTB = statusBBTB(bb, sdBBTB.sd);

  hasilBBTB.innerHTML = `
<b>Status:</b> ${statBBTB}<br>
<b>Rekomendasi BB:</b> ± ${sdBBTB.sd["0"]} kg<br>
<small>${rekomendasiBBTB(statBBTB)}</small>
`;


  if (chartBBTB) chartBBTB.destroy();
  let dsBBTB = makeDataset(bbtb);
  addAnak(dsBBTB, tb, bb);

  chartBBTB = new Chart(grafikBBTB,{
    type:"line",
    data:{labels:bbtb.data.map(d=>d.x),datasets:dsBBTB}
  });
}

// shortcut element
const jkEl = document.getElementById("jk");
const usiaEl = document.getElementById("usia");
const beratEl = document.getElementById("berat");
const tinggiEl = document.getElementById("tinggi");
