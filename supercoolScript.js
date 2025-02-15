console.log("Ton script super cool est bien relié");

// Fonction pour récupérer les données météo via API
async function miniWeather() {
  const apiKey = 'b5264219f5fdca65f3424d3ce2b4d002'; // Ta clé API
  const city = 'Lausanne'; // Ville à changer selon ton besoin
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.cod === 200) {
      const weatherInfo = document.getElementById('miniWeatherInfo');
      weatherInfo.innerHTML = `
        <div id="miniWeatherInfo">
          <p class="city">${data.name}</p> <!-- Nom de la ville -->
          <div class="weather-details">
            <div class="weather-item">
              <img src="temp.png" alt="" class="icon"> 
              <p>${data.main.temp} <sup>°C</sup> </p>
            </div>
            <div class="weather-item">
              <img src="weather.png" alt="" class="icon">
              <p>${data.weather[0].description}</p>
            </div>
            <div class="weather-item">
              <img src="wind.png" alt="" class="icon">
              <p>${data.wind.speed} m/s</p>
            </div>
          </div>
        </div>
      `;
    } else {
      alert('Erreur lors de la récupération des données météo');
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}

function loadPosition(elementId) {
  const position = JSON.parse(localStorage.getItem(elementId));
  if (position) {
    const element = document.getElementById(elementId);
    element.style.left = position.x + 'px';
    element.style.top = position.y + 'px';
  }
}

// Sauvegarde de la position dans localStorage
function savePosition(elementId, x, y) {
  const position = { x, y };
  localStorage.setItem(elementId, JSON.stringify(position));
}

function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  
  // Récupération des heures, minutes, secondes et millisecondes
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  // Mise à jour de l'affichage de l'heure, y compris les millisecondes
  clock.textContent = `${hours}:${minutes}:${seconds}`;
}

window.onload = function () {
  // Chargement des positions pour les IDs
  loadPosition('miniWeather');
  loadPosition('clock');
  loadPosition('speMiniHome');
  loadPosition('speCard');
  loadPosition('miMi');
  
  // Appel des autres fonctions nécessaires
  miniWeather();
  setInterval(updateClock, 1000);
  updateClock(); // Appel initial pour afficher l'heure immédiatement
};

// Fonction de déplacement des éléments
document.querySelectorAll('.miniHome, .card, #clock, #miniWeather, #miMi').forEach(element => {
  let isDragging = false; // Indique si l'élément est en train d'être déplacé
  let offsetX, offsetY; // Position du curseur par rapport au coin supérieur gauche de l'élément

  // Lorsque l'utilisateur commence à cliquer
  element.addEventListener('mousedown', (event) => {
    isDragging = true; // Active le mode déplacement
    // Calculer l'écart entre le curseur et le coin supérieur gauche de l'élément
    offsetX = event.clientX - element.offsetLeft;
    offsetY = event.clientY - element.offsetTop;

    // Ajouter une classe pour styliser l'élément en déplacement (optionnel)
    element.classList.add('dragging');
  });

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = element.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    element.style.zIndex = 1000;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      element.style.zIndex = '';
      const rect = element.getBoundingClientRect();
      savePosition(element.id, rect.left, rect.top);
    }
  });
});

// Fonction pour démarrer le flux de la caméra
async function startCamera() {
  try {
      // Demander l'accès à la caméra de l'utilisateur
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Récupérer l'élément vidéo
      const video = document.getElementById('video');
      
      // Attacher le flux vidéo à l'élément <video>
      video.srcObject = stream;
  } catch (error) {
      console.error("Erreur lors de l'accès à la caméra", error);
  }
}

// Appeler la fonction pour démarrer la caméra
startCamera();