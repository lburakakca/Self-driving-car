const carCanvas=document.getElementById("carCanvas");
const networkCanvas=document.getElementById("networkCanvas");
const settingsCanvas = document.getElementById("settingsCanvas");
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
// settingsCtx is managed within Settings class

// --- Initialize Settings Panel ---
// Set canvas size before creating Settings instance
settingsCanvas.height = window.innerHeight; // Use full height (assuming CSS sets width)
settingsCanvas.width = 200; // Explicitly set width to match CSS
const settings = new Settings("settingsCanvas");
// ---------------------------------

// Game Elements
const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
const N = settings.get('carCount'); // Get initial car count
let cars = [];
let bestCar = null;
let traffic = [];

// Game State
let animationFrameId = null;

// UI Elements
// const startScreen = document.getElementById("startScreen"); // Removed
const canvasContainer = document.getElementById("canvasContainer");
const controlsContainer = document.getElementById("controlsContainer");
const difficultySelect = document.getElementById("difficultySelect");
// const startButton = document.getElementById("startButton"); // Removed
const saveButton = document.getElementById("saveButton");
const discardButton = document.getElementById("discardButton");

// --- TRAFFIC PATTERNS (Defined early) ---
const trafficPatterns = {
    // Difficulty 1: Very Sparse
    1: {
        height: 600, // Estimated total height of this pattern
        cars: [
            { lane: 0, yOffset: 0 },
            { lane: 2, yOffset: -300 }
        ]
    },
    // Difficulty 2: Sparse rows
    2: {
        height: 800,
        cars: [
            { lane: 1, yOffset: 0 },
            { lane: 3, yOffset: -250 },
            { lane: 0, yOffset: -500 },
            { lane: 2, yOffset: -650 }
        ]
    },
    // Difficulty 3: Some adjacent
    3: {
        height: 1000,
        cars: [
            { lane: 0, yOffset: 0 },    
            { lane: 1, yOffset: 0 },    // Adjacent
            { lane: 3, yOffset: -300 },
            { lane: 1, yOffset: -600 },
            { lane: 2, yOffset: -600 }, // Adjacent
            { lane: 0, yOffset: -850 }
        ]
    },
    // Difficulty 4: Denser, more adjacent
    4: {
        height: 1200,
        cars: [
            { lane: 1, yOffset: 0 },
            { lane: 2, yOffset: -100 }, // Offset adjacent
            { lane: 0, yOffset: -350 },
            { lane: 3, yOffset: -550 },
            { lane: 1, yOffset: -750 },
            { lane: 2, yOffset: -750 }, // Adjacent
            { lane: 0, yOffset: -1000 },
            { lane: 3, yOffset: -1100 } // Offset adjacent
        ]
    },
    // Difficulty 5: Challenging blocks
    5: {
        height: 1500, 
        cars: [
            { lane: 0, yOffset: 0 },
            { lane: 1, yOffset: 0 },    // Block
            { lane: 2, yOffset: -250 },
            { lane: 3, yOffset: -250 }, // Block
            { lane: 1, yOffset: -550 },
            { lane: 0, yOffset: -750 },
            { lane: 2, yOffset: -950 },
            { lane: 3, yOffset: -950 }, // Block
            { lane: 1, yOffset: -1200 },
            { lane: 0, yOffset: -1350 },
            { lane: 2, yOffset: -1450 } // Offset
        ]
    }
};

function getPatternHeight(difficulty) {
    return trafficPatterns[difficulty]?.height || 600; // Default height
}

function loadTrafficPattern(difficulty) {
    console.log(`Loading traffic pattern for difficulty ${difficulty}`);
    traffic = []; // Clear existing traffic
    const pattern = trafficPatterns[difficulty] || trafficPatterns[1]; // Default to 1 if invalid
    const startY = bestCar ? bestCar.y - 300 : -200; // Start traffic ahead of the car

    pattern.cars.forEach(carConfig => {
        const speed = 2 + (Math.random() - 0.5) * 0.5; // Add slight speed variation
        traffic.push(new Car(
            road.getLaneCenter(carConfig.lane),
            startY + carConfig.yOffset, // Calculate absolute Y
            30, 50, "DUMMY", speed
        ));
    });
    console.log("Traffic loaded:", traffic.length, "cars");
}
// ------------------------------------------

// --- Initial Setup & Event Listeners ---

// Load initial difficulty
let currentDifficulty = parseInt(localStorage.getItem("difficulty") || "1");
difficultySelect.value = currentDifficulty.toString();

// Difficulty change listener (triggers reset)
difficultySelect.addEventListener('change', handleDifficultyChange);

// Start Button Listener Removed
// startButton.addEventListener("click", startGame);

// In-Game Buttons
saveButton.addEventListener("click", saveBestBrain);
discardButton.addEventListener("click", discardBrainAndReload);
discardButton.title = "Removes the saved brain and reloads.";
// Reset and Menu listeners already removed

// --- Game Flow Functions (Removed startGame, goToMainMenu) ---
/*
function startGame() { ... }
function goToMainMenu() { ... }
*/

// Difficulty Change Handler (NOW Reloads Page)
function handleDifficultyChange(event) {
    const newDifficulty = parseInt(event.target.value);
    console.log(`Difficulty changed to ${newDifficulty}, reloading...`);
    // Save the new difficulty to localStorage
    localStorage.setItem("difficulty", newDifficulty.toString());
    // Reload the page to apply the new difficulty and potentially load/reset brains
    location.reload();
}

// Initialize simulation state directly on load
initializeSimulationState(); 

function initializeSimulationState(){
    console.log("Initializing simulation state...");
    cars = generateCars(settings.get('carCount'));
    bestCar = cars[0];
    loadBrainIfExists();
    loadTrafficPattern(currentDifficulty);
    // Ensure difficulty dropdown reflects state after potential load/reset
    difficultySelect.value = currentDifficulty.toString();
}

// --- Brain Management ---

function loadBrainIfExists(){
     if(localStorage.getItem("bestBrain")){
        console.log("Loading brain from localStorage...");
        const savedBrainJSON = localStorage.getItem("bestBrain");
        try {
            const savedBrainData = JSON.parse(savedBrainJSON);
            for(let i = 0; i < cars.length; i++){
                if (savedBrainData && savedBrainData.levels) {
                    // Copy weights and biases
                    if (cars[i].brain && cars[i].brain.levels) {
                         for(let levelIndex = 0; levelIndex < cars[i].brain.levels.length; levelIndex++){
                            if(savedBrainData.levels[levelIndex] && cars[i].brain.levels[levelIndex]){
                                cars[i].brain.levels[levelIndex].biases = [...savedBrainData.levels[levelIndex].biases];
                                cars[i].brain.levels[levelIndex].weights = savedBrainData.levels[levelIndex].weights.map(row => [...row]);
                            }
                        }
                    } else {
                        console.warn(`Car ${i} does not have a valid brain structure to load into.`);
                    }
                } else {
                     console.error("Saved brain data is invalid or missing levels.");
                     break;
                }
                // Apply mutation
                if(i > 0){
                     NeuralNetwork.mutate(cars[i].brain, settings.get('mutationRate'));
                }
            }
            bestCar = cars[0];
            console.log("Brain loaded and applied/mutated to cars.");
        } catch (e) {
            console.error("Failed to parse or load brain:", e);
            localStorage.removeItem("bestBrain");
            console.log("Removed potentially corrupted brain data.");
        }
    } else {
        console.log("No saved brain found. Starting with random brains.");
    }
}

function saveBestBrain(){
    if(!bestCar || !bestCar.brain){
        console.error("Cannot save, no best car or brain found.");
        return;
    }
    console.log("Saving best brain...");
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
    console.log("Brain saved!");
    // Maybe add visual feedback like button text change?
}

function discardBrainAndReload(){
    console.log("Discarding saved brain and reloading...");
    localStorage.removeItem("bestBrain");
    location.reload();
}

// Reset function removed
/*
function resetSimulationInPlace(){ ... }
*/

// --- Keyboard Listener for Reload (In-Game) ---
window.addEventListener('keydown', (event) => {
    // Now always active, as game starts immediately
    if (event.code === 'Space') { 
        console.log("Space pressed, reloading simulation...");
        location.reload();
    }
});
// ----------------------------------

// --- Car Generation ---
function generateCars(numCars){
    console.log("Generating", numCars, "cars...");
    const generatedCars = [];
    for(let i=1; i<=numCars; i++){
        generatedCars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", settings.get('maxSpeed')));
    }
    return generatedCars;
}
// --------------------

// --- Animation Loop ---
// Start animation loop directly after initial setup
animationFrameId = requestAnimationFrame(animate);

function animate(time){
    // 1. Update Traffic & Loop
    const patternHeight = getPatternHeight(currentDifficulty); // Need function to get pattern height
    const loopThreshold = bestCar.y + carCanvas.height * 0.5; // Point below the view

    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, []);
        // Check if car is below the loop threshold
        if (traffic[i].y > loopThreshold) {
            // Move car to the top of the pattern
            traffic[i].y -= patternHeight;
            // Maybe slightly adjust x too, or re-read from pattern?
            // For now, just reset y.
        }
    }

    // 2. Update AI Cars
    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    // 3. Find Best Car
    const candidates = cars.filter(c => !c.damaged);
    bestCar = candidates.length > 0 
        ? candidates.reduce((best, current) => current.y < best.y ? current : best, candidates[0])
        : cars.reduce((best, current) => current.y < best.y ? current : best, cars[0]); // Fallback if all damaged
     
    // 4. Manage Dynamic Traffic (REMOVED)
    // traffic = traffic.filter(...);
    // if (bestCar.y < lastSpawnTriggerY - trafficSpawnThreshold) { ... }

    // 5. Adjust Canvas Sizes
    const rowHeight = document.getElementById('canvasRow').clientHeight;
    if (settingsCanvas.height !== rowHeight) settingsCanvas.height = rowHeight;
    if (carCanvas.height !== rowHeight) carCanvas.height = rowHeight;
    if (networkCanvas.height !== rowHeight) networkCanvas.height = rowHeight;
    // Widths are mostly handled by CSS, but we might need to update Road if carCanvas width changes
    // road.width = carCanvas.width*0.9; // Update road width if canvas resizes - potential performance hit?

    // 6. Draw Canvases
    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
    networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
    
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.7);
    road.draw(carCtx);
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha=0.2;
    for(let i=0; i<cars.length; i++){
        if (cars[i] !== bestCar) {
             cars[i].draw(carCtx, false); // Don't draw sensors for non-best cars
        }
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, true); // Draw best car sensors
    carCtx.restore();

    Visualizer.drawNetwork(networkCtx, bestCar.brain, time);
    
    settings.draw(); // Ensure settings canvas is redrawn too
    
    requestAnimationFrame(animate);
}
// ---------------------

// --- Traffic Pattern Loading Logic (MOVED EARLIER) ---

// --- Utility Functions (Example - if not in utils.js) ---
// function lerp(a, b, t) { return a + (b - a) * t; }
// ---------------------------------------------------------