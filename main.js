const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
// Height will be set dynamically based on container

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;
// Height will be set dynamically based on container

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
// ---------------------

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

// --- Parallelization Setup ---
const N = 100; // Number of parallel cars
const cars = generateCars(N);
let bestCar = cars[0]; // Initialize bestCar

// Load best brain from localStorage if available
if(localStorage.getItem("bestBrain")){
    console.log("Loading brain from localStorage...");
    const savedBrainJSON = localStorage.getItem("bestBrain");
    // Ensure parsing happens correctly
    try {
        const savedBrainData = JSON.parse(savedBrainJSON);

        // Apply the saved brain structure (weights/biases) to cars
        for(let i = 0; i < cars.length; i++){
            // Assign the loaded weights/biases to the existing brain instance
            // This assumes savedBrainData.levels structure matches network.levels
            if (savedBrainData && savedBrainData.levels) {
                for(let levelIndex = 0; levelIndex < cars[i].brain.levels.length; levelIndex++){
                    if(savedBrainData.levels[levelIndex]){
                        // Copy biases
                        cars[i].brain.levels[levelIndex].biases = [...savedBrainData.levels[levelIndex].biases];
                        // Copy weights
                        cars[i].brain.levels[levelIndex].weights = savedBrainData.levels[levelIndex].weights.map(row => [...row]);
                    }
                }
            } else {
                 console.error("Saved brain data is invalid or missing levels.");
                 break; // Stop trying to load if data is bad
            }

            // Apply mutation only AFTER loading weights/biases correctly
            // And only apply to cars other than the very first one (to keep one pure copy)
            if(i > 0){
                 NeuralNetwork.mutate(cars[i].brain, 0.1); // Slightly increased mutation 
            }
        }
        bestCar = cars[0]; // The first car now holds the pure loaded brain
        console.log("Brain loaded and applied/mutated to cars.");

    } catch (e) {
        console.error("Failed to parse or load brain:", e);
        localStorage.removeItem("bestBrain"); // Remove corrupted data
        console.log("Removed potentially corrupted brain data.");
    }

} else {
    console.log("No saved brain found. Starting with random brains.");
}

// Function to generate N cars
function generateCars(N){
    const generatedCars = [];
    for(let i=1; i<=N; i++){
        generatedCars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return generatedCars;
}
// -----------------------------

// --- Traffic Setup --- More Traffic!
const traffic = [
    // Lane 0
    new Car(road.getLaneCenter(0), -100, 30, 50, "DUMMY", 2), 
    new Car(road.getLaneCenter(0), -400, 30, 50, "DUMMY", 2.1),
    new Car(road.getLaneCenter(0), -700, 30, 50, "DUMMY", 1.9),
    // Lane 1
    new Car(road.getLaneCenter(1), -150, 30, 50, "DUMMY", 2.2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2.0),
    new Car(road.getLaneCenter(1), -850, 30, 50, "DUMMY", 2.3),
    // Lane 2
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(2), -600, 30, 50, "DUMMY", 2.1),
    // Lane 3
    new Car(road.getLaneCenter(3), -50, 30, 50, "DUMMY", 1.8),
    new Car(road.getLaneCenter(3), -350, 30, 50, "DUMMY", 2.2),
    new Car(road.getLaneCenter(3), -650, 30, 50, "DUMMY", 2.0)
];
// ---------------------

// --- Button Event Listeners ---
document.getElementById("saveButton").addEventListener("click", saveBestBrain);
document.getElementById("discardButton").addEventListener("click", discardBrain);
document.getElementById("resetButton").addEventListener("click", discardBrain); // Reset also calls discard

function saveBestBrain(){
    console.log("Saving best brain...");
    // Stringify the best car's brain and save to localStorage
    localStorage.setItem("bestBrain", 
        JSON.stringify(bestCar.brain) // Save the current best car's brain
    );
    console.log("Brain saved!");
    // Optional: Reload page or restart simulation?
    // location.reload(); 
}

function discardBrain(){
    console.log("Discarding saved brain...");
    localStorage.removeItem("bestBrain");
    console.log("Saved brain discarded!");
    // Optional: Reload page or restart simulation?
     location.reload(); 
}

// --- Keyboard Listener for Reload ---
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        console.log("Space pressed, reloading...");
        location.reload();
    }
});
// ----------------------------------

animate();

function animate(time){
    // Update traffic
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, []);
    }

    // Update all AI cars
    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    // Find the best car (furthest down without damage)
    bestCar = cars.find(
        c => c.y == Math.min(...cars.map(c => c.y)) && !c.damaged
    ) || cars.find(c => c.y == Math.min(...cars.map(c => c.y))) || cars[0]; // Fallback
     
    // --- Adjust Canvas Sizes Dynamically ---
    // Make canvases fill the container height
    const containerHeight = document.getElementById('canvasContainer').clientHeight;
    carCanvas.height = containerHeight;
    networkCanvas.height = containerHeight;
    // ---------------------------------------

    // --- Draw Car Canvas ---
    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.7); 
    
    road.draw(carCtx);
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha=0.2;
    for(let i=0; i<cars.length; i++){
        // Draw sensors only for the best car
        cars[i].draw(carCtx, i === cars.indexOf(bestCar)); 
    }
    carCtx.globalAlpha=1;
    // Pass true to ensure best car's sensors are drawn
    bestCar.draw(carCtx, true); 

    carCtx.restore();
    // ----------------------

    // --- Draw Network Canvas ---
    networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
    Visualizer.drawNetwork(networkCtx, bestCar.brain, time); 
    // -------------------------
    
    requestAnimationFrame(animate);
}