function hitungIMT() {
  let bb = parseFloat(document.getElementById("bb").value);
  let tb = parseFloat(document.getElementById("tb").value) / 100;
  let aktivitas = document.getElementById("aktivitas").value;

  if (!bb || !tb) {
    alert("Mohon isi semua data");
    return;
  }

  let imt = (bb / (tb * tb)).toFixed(1);
  let kategori = "";
  let skor = 0;
  let solusi = "";

  // Kategori IMT
  if (imt < 18.5) {
    kategori = "Kurus";
    skor += 1;
    solusi = "Perbanyak asupan protein dan makan teratur.";
  } else if (imt < 23) {
    kategori = "Normal";
    solusi = "Pertahankan pola makan dan aktivitas fisik.";
  } else if (imt < 25) {
    kategori = "Kelebihan Berat Badan";
    skor += 2;
    solusi = "Kurangi gula dan mulai aktivitas fisik ringan.";
  } else {
    kategori = "Obesitas";
    skor += 3;
    solusi = "Disarankan olahraga rutin dan kontrol pola makan.";
  }

  // Aktivitas
  if (aktivitas === "rendah") skor += 2;
  if (aktivitas === "sedang") skor += 1;

  // Risiko
  let risiko = "";
  if (skor <= 2) risiko = "Risiko Rendah";
  else if (skor <= 4) risiko = "Risiko Sedang";
  else risiko = "Risiko Tinggi";

  document.getElementById("hasil").innerHTML =
    `IMT: <b>${imt}</b> <br>Kategori: <b>${kategori}</b><br>Status Risiko: <b>${risiko}</b>`;

  document.getElementById("solusi").innerHTML =
    `<b>Rekomendasi:</b><br>${solusi}`;
}
