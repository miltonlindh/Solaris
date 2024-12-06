//för planeten till vänster på info sidan

class CustomPlanet {
    constructor(data) {
        this.name = data.name;
        this.color = this.getColorByPlanetName(data.name) || '#FFF'; // Använder planetens färg
        this.size = '50vW'; // Sätter storleken på planeten
    }
// genererar färg beroende på vilken planet de sökte på
    getColorByPlanetName(name) {
        const colors = {
            'Solen': '#FFD700', 
            'Merkurius': '#B0B0B0', 
            'Venus': '#F5DEB3', 
            'Jorden': '#0000FF', 
            'Mars': '#FF4500', 
            'Jupiter': '#D2B48C', 
            'Saturnus': '#DAA520', 
            'Uranus': '#00FFFF', 
            'Neptunus': '#0000FF' 
        };
        return colors[name] || '#FFF'; //använder planetens färg eller vitt om den ej hittas
    }

    createPlanetElement() {
        const planetContainer = document.createElement('div');
        planetContainer.className = 'custom-planet'; //klassnamn för container

        const planetElement = document.createElement('div');
        planetElement.className = 'planet'; //klassnamn för planet
        planetElement.style.width = this.size; //sätter bredden
        planetElement.style.height = this.size; //sätter höjden
        planetElement.style.borderRadius = '50%'; //rundar av hörnen
        planetElement.style.background = `radial-gradient(circle, #FFF, ${this.color})`; //bakgrundsfärg

        planetContainer.appendChild(planetElement); // lägger till planet i containern
        document.body.appendChild(planetContainer); // lägger till container i body
    }

    render() {
        console.log(`Rendering planet: ${this.name} with color: ${this.color}`);
        this.createPlanetElement(); //skapar och renderar planeten
    }
}

async function addCustomPlanetToScreen(planetName) {
    try {
        console.log(`Fetching data for planet: ${planetName}`);
        const response = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies', {
            method: 'GET',
            headers: { 'x-zocom': 'solaris-2ngXkR6S02ijFrTP' }
        });

        if (!response.ok) {
            throw new Error("Could not fetch resource"); //om datan ej hittas blir det error
        }

        const data = await response.json(); //omvandlar svar till json
        console.log("API Response:", data);
        const planet = data.bodies.find(item => item.name.toLowerCase() === planetName.toLowerCase()); //hittar planeten

        if (planet) { //om planeten hittas
            console.log(`Planet found: ${planet.name}`);
            const customPlanet = new CustomPlanet(planet);
            customPlanet.render(); //renderar planeten
        } else {
            console.error("Planet not found."); //fel om planet ej hittas
        }
    } catch (error) {
        console.error("Error occurred during fetch operation:", error); //loggar fel
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search); //hämtar parametrar från url
    const planetName = params.get("planet"); //får planetens namn
    console.log("DOMContentLoaded event fired, planet:", planetName);
    addCustomPlanetToScreen(planetName); //lägger till planeten
});

