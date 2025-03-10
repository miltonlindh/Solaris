document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search); //hämtar parametrar från URL
    const planetName = params.get("planet"); //får planetens namn från parametrarna
    const planetNameElement = document.getElementById("planet-name"); //element för planetens namn
    const planetDataElement = document.getElementById("planet-data"); //element för planetens data

    if (!planetName) { //om inget planetnamn anges
        planetNameElement.innerText = "No planet specified."; //visas det här meddelandet
        planetDataElement.innerText = ""; //tömmer searchbaren
        return;
    }

    fetchPlanetData(planetName, planetNameElement, planetDataElement).then(() => {
        adjustElementPositions(); //justerar positioner
    });
    createStars(); //skapar stjärnorna i bakgrunden
});

async function fetchPlanetData(planetName, planetNameElement, planetDataElement) {
    try {
        const response = await fetch('http://localhost:3000/bodies', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        
        
        
         //hämtar data från API

        if (!response.ok) {
            throw new Error("Could not fetch resource"); //om data ej kan hämtas
        }

        const data = await response.json(); //omvandlar svar till json
        const planet = data.bodies.find(item => item.name.toLowerCase() === planetName.toLowerCase()); //hittar planeten i data

        if (planet) { //om planeten hittas
            let planetInfo = `<h2>${planet.name}</h2><ul class="planet-details">`;

            for (const key in planet) {
                //loopar genom varje nyckel i objektet planet
                if (planet.hasOwnProperty(key) && key !== 'name') {
                    if (key === 'temp') { //om nyckeln är temp
                        planetInfo += `
                            <li class="temp-day-title">Dag temperatur</li>
                            <li class="temp-day">${planet[key].day}°C</li>
                            <li class="temp-night-title">Natt temperatur</li>
                            <li class="temp-night">${planet[key].night}°C</li>
                        `;
                    } else if (key === 'moons' && Array.isArray(planet[key])) { //om nyckeln är 'moons'
                        planetInfo += `
                            <li class="moons-title">Moons</li>
                            <li class="moons">${planet[key].join(', ')}</li>`;
                    } else if (key === 'circumference') { //om nyckeln är 'circumference'
                        planetInfo += `
                            <li class="circumference-title">Omkrets</li>
                            <li class="circumference">${planet[key]}</li>`;
                    } else if (key === 'distance') { //om nyckeln är 'distance'
                        planetInfo += `
                            <li class="distance-title">Avstånd</li>
                            <li class="distance">${planet[key]}</li>`;
                    } else {
                        planetInfo += `<li class="${key}"><strong>${planet[key]}</strong></li>`;
                    }
                }
            }

            planetInfo += `</ul>`;
            planetDataElement.innerHTML = `<div class="planet-container">${planetInfo}</div>`; //visar planetens info
        } else {
            planetDataElement.innerText = "Planet not found."; //meddelande om planeten ej kunde hittas
        }
    } catch (error) {
        console.error("Error occurred during fetch operation:", error); //felmeddelande
        planetDataElement.innerText = "Failed to load planet data."; //om datan ej kunde laddas
    }
}

function adjustElementPositions() {
    const descElement = document.querySelector('.desc'); //element för beskrivning
    if (descElement) {
        const descHeight = descElement.clientHeight; //höjd på beskrivningselementet
        const elementsToAdjust = document.querySelectorAll('.circumference, .distance, .temp-day, .temp-night, .moons, .circumference-title, .distance-title, .temp-day-title, .temp-night-title, .moons-title'); //element att justera

        elementsToAdjust.forEach(el => {
            const initialTop = parseFloat(getComputedStyle(el).top); //ursprunglig topposition
            el.style.top = `${initialTop + descHeight}px`; //justerar toppositionen
        });
    }
}

function createStars() {
    const starCount = 100; //antal stjärnor som ska synas
    const sky = document.querySelector('body'); //hämtar body element

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div'); //skapar stjärnelementet
        star.className = 'star';
        const x = Math.random() * window.innerWidth; //slumpmässig X-position
        const y = Math.random() * window.innerHeight; //slumpmässig Y-position
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        sky.appendChild(star); //lägger till stjärnan i body
    }
}
createStars(); //skapa stjärnorna
