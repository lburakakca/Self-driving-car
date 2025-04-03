const canvas=document.getElementById("myCanvas");
canvas.width=200;
canvas.height=window.innerHeight;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);
const traffic = [];

animate();

function animate(){
    car.update(road.borders, traffic);
    
    // Clear the canvas before drawing the new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(0, -car.y + canvas.height*0.7);
    
    road.draw(ctx);
    car.draw(ctx);
    
    ctx.restore();
    requestAnimationFrame(animate);
}