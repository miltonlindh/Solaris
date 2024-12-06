//när sidan laddats så körs den här funktionen
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded");

    const starCount = 100; // antalet stjärnor som ska ploppas ut
    createStars(starCount); //skapar stjärnorna

    //hämtar alla element som man kan klicka på (planeterna)
    const clickableElements = document.querySelectorAll('.planet, .sun');
    console.log("Clickable elements found:", clickableElements);//loggar alla klickbara planeter

    //lägger till en klickhändelse på varje element som  ska gå att klicka på
    clickableElements.forEach(element => {
        console.log("Adding click event listener to:", element);
        element.addEventListener('click', handleElementClick);//lägger till händelse vid klick
    });
});

// skapar stjärnor och placerar ut de random
const createStars = (count) => {
    for (let i = 0; i < count; i++) {
        const star = document.createElement("div");
        star.className = "star"; 
        star.style.top = `${Math.random() * 100}vh`; // slumpar topposition
        star.style.left = `${Math.random() * 100}vw`; // slumpar vänsterposition
        star.style.animationDuration = `${Math.random() * 1.5 + 0.5}s`; // slumpar animationstid
        document.body.appendChild(star);//lägger till stjärnorna i bodyn
    }
};

//när man klickar på ett element, hämtas data för den planeten
const handleElementClick = function() {
    const planetName = this.getAttribute('data-planet'); // hämta planetens namn
    console.log(`Element clicked: ${this}, data-planet attribute: ${planetName}`);
    if (planetName) {
        console.log(`Redirecting to page for planet: ${planetName}`);//omdirigierar till planet info sidan
        fetchData(planetName); // hämtar data för planeten tack vare funktionen fetchData
    } else {
        console.error("Planet name is null or undefined");//det ska komma upp i konsolen om planeten är null eller undefined
    }
};

// hämtar data för en planet från api
const fetchData = async (planetName) =>{
    //checkar om planetens namn är angivet
    if (!planetName) {
        console.error("Planet name is not provided");
        return;
    }

    try {
        console.log("Fetching data for planet:", planetName);//loggar vilket planetnamn som ska hämtas
        const response = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies', {
            method: 'GET',
            headers: { 'x-zocom': 'solaris-2ngXkR6S02ijFrTP' }
        });
       //kontorllerar om svaret inte är ok(skickar ett fel om det inte är ok)
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();//omvandlar svaret till json
        console.log("Full API Response Data:", JSON.stringify(data, null, 2));//loggar api svaret

        // kollar om planeten finns i datan
        const planetExists = data.bodies.some(item => item && item.name.toLowerCase().trim() === planetName.toLowerCase().trim());
        //kontrollerar o planteten finns i datan, det gör den genom att jämföra planetenes namn

        if (planetExists) {
            console.log(`Planet ${planetName} found. Redirecting...`);
            window.location.href = `planet.html?planet=${planetName}`; //omdirigerar till planetsidan
        } else {
            console.error(`Planet ${planetName} not found in the response data`);//felmeddelande om den inte hittas i datan
        }

        document.getElementById("searchText").value = "Sök info här...";//rensa sökfältet
    } catch (error) {
        console.error("Error occurred during fetch operation:", error);//felmeddelande om något inte går bra under hämtning
    }
};

//sök planet när värdet ändrats (och enter)
function searchChange(textBox){
    fetchData(textBox.value);//hämtar data beroende på vad personen sökte på
 }
  
 //rensa starttexten när rutan klickas
 function searchClick(textBox) {
     if (textBox.value == "Sök info här..."){
         textBox.value = "";//rensar text om starttext finns kvar
     }
 }
  
 //när rutan tappar fokus och inget skrivits in
 function searchBlur(textBox) {
     if (textBox.value == ""){
         textBox.value = "Sök info här...";//sätter tillbaka starttexten om inget skrivs in i textrutan
     }
 }





