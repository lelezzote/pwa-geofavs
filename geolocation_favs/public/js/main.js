
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      let reg = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registrado!', reg);
    } catch (err) {
      console.log('Falha no service worker:', err);
    }
  });
}


let db;

const request = indexedDB.open("locaisFavoritosDB", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;

  if (!db.objectStoreNames.contains("locais")) {
    db.createObjectStore("locais", { keyPath: "id", autoIncrement: true });
  }
};

request.onsuccess = function (event) {
  db = event.target.result;
  listarLocais();
};

request.onerror = function () {
  console.log("Erro ao abrir IndexedDB");
};


const btnLocalizacao = document.getElementById('localizacao');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');
const mapa = document.getElementById('gmap_canvas');

btnLocalizacao.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocalização não é suportada.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);

      latitude.innerText = lat;
      longitude.innerText = lon;

      mapa.src = `https://maps.google.com/maps?q=${lat},${lon}&z=15&ie=UTF8&iwloc=&output=embed`;
    },
    () => {
      alert("Erro ao obter localização.");
    }
  );
});


document.getElementById("salvarLocal").addEventListener("click", () => {
  const nome = document.getElementById("nomeLocal").value;
  const lat = latitude.innerText;
  const lon = longitude.innerText;

  if (!nome || lat === "0.0") {
    alert("Capture a localização e informe um nome!");
    return;
  }

  const tx = db.transaction(["locais"], "readwrite");
  const store = tx.objectStore("locais");

  const local = {
    nome: nome,
    data: new Date().toLocaleString(),
    latitude: lat,
    longitude: lon,
  };

  store.add(local);

  tx.oncomplete = () => {
    listarLocais();
    document.getElementById("nomeLocal").value = "";
  };
});

function listarLocais() {
  const lista = document.getElementById("listaLocais");
  lista.innerHTML = "";

  const tx = db.transaction(["locais"], "readonly");
  const store = tx.objectStore("locais");

  store.openCursor().onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const item = cursor.value;

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${item.nome}</strong><br>
        📍 ${item.latitude}, ${item.longitude}<br>
        🕒 ${item.data}
      `;

      lista.appendChild(li);

      cursor.continue();
    }
  };
}



