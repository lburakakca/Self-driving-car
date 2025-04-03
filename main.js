const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
carCanvas.height=window.innerHeight - 40;

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;
networkCanvas.height=window.innerHeight - 40;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

// Create the player car - controlled by AI
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");

// Create traffic cars
const traffic = [
    new Car(road.getLaneCenter(0), -100, 30, 50, "DUMMY", 2), // Lane 0, further up
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2.5), // Lane 2, even further up
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2.2), // Lane 1, furthest up
    new Car(road.getLaneCenter(3), -150, 30, 50, "DUMMY", 1.8) // Lane 3
];

animate();

function animate(time){
    // Update traffic
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, []);
    }
    // Update player car
    car.update(road.borders, traffic);
    
    // Adjust canvas heights dynamically (optional, but good for resizing)
    carCanvas.height=window.innerHeight - 40;
    networkCanvas.height=window.innerHeight - 40;

    // Clear car canvas
    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
    
    // Draw car perspective
    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height*0.7);
    road.draw(carCtx);
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx);
    }
    car.draw(carCtx);
    carCtx.restore();

    // Clear and draw network visualization
    networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
    Visualizer.drawNetwork(networkCtx, car.brain, time);
    
    requestAnimationFrame(animate);
}