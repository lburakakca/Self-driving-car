# Self-Driving Car Simulation (No Libraries)

This project is a simple 2D simulation of a self-driving car environment, built purely with vanilla JavaScript, HTML, and CSS, without relying on any external game or physics libraries.

## Project Goal

The main goal is to simulate a car that can perceive its environment (road borders and other traffic) using sensors and eventually learn to navigate the road autonomously.

## Current Features

*   **HTML Canvas Rendering:** The simulation is drawn on an HTML canvas.
*   **Road:** A multi-lane road with borders and dashed lane markings.
*   **Player Car:**
    *   Controlled using arrow keys (forward, reverse, left, right).
    *   Blue color.
    *   Equipped with sensors that detect road borders and other cars.
    *   Collision detection: Turns gray when it collides with road borders or traffic.
*   **Dummy Traffic:**
    *   Multiple cars moving straight ahead at constant, predefined speeds.
    *   Red color.
    *   No sensors or user controls.
    *   Act as obstacles for the player car.
*   **Basic Physics:** Simple acceleration, friction, handling, and collision detection.

## File Structure

*   `index.html`: The main HTML file that sets up the canvas and includes the necessary JavaScript files.
*   `style.css`: Contains basic CSS rules for styling the page and canvas.
*   `main.js`: The entry point of the simulation. Initializes the canvas, road, player car, and traffic. Contains the main animation loop (`animate`) that updates and draws all elements.
*   `car.js`: Defines the `Car` class.
    *   Handles both `PLAYER` and `DUMMY` car types.
    *   Includes logic for movement (player controls and dummy movement), collision detection (`#assessDamage`), polygon creation (`#createPolygon`), and drawing.
*   `road.js`: Defines the `Road` class, responsible for calculating road geometry (lanes, borders) and drawing the road.
*   `sensor.js`: Defines the `Sensor` class used by the player car to detect obstacles via ray casting.
*   `controls.js`: Defines the `Controls` class that listens for keyboard events to control the player car.
*   `utils.js`: (Assumed) Contains utility functions like linear interpolation (`lerp`) and polygon intersection (`polysIntersect`).

## How to Run

1.  Clone or download the repository.
2.  Open the `index.html` file in a web browser that supports HTML5 Canvas and modern JavaScript.
3.  Use the arrow keys to control the blue car.

## Next Steps (Potential)

*   Implement a neural network for the car's brain.
*   Train the car to drive autonomously using the sensor data.
*   Improve traffic behavior (e.g., lane changing, varying speeds).
*   Enhance visuals and physics.

## 🚗 Project Structure

The project is organized into the following phases:

1. **Car Control**
   - Basic car movement with keyboard controls
   - Canvas-based rendering
   - Physics simulation (acceleration, friction)
   - Realistic car visualization with details

2. **Sensor System** (Current Phase)
   - Ray-casting implementation with multiple sensors
   - Collision detection with road borders
   - Traffic detection capability
   - Visual feedback system
     - Yellow rays for normal sensing
     - Red highlights for detected obstacles
   - Distance-based sensing with offset calculations

3. **Road Drawing**
   - Lane creation and rendering
   - Road boundaries
   - Scrolling road effect
   - Multiple lane support

4. **Traffic Simulation** (Coming Soon)
   - Random vehicle generation
   - Collision detection
   - Traffic behavior patterns

5. **Neural Network** (Coming Soon)
   - Implementation of neural network
   - Evolutionary algorithms
   - Reward-penalty system for learning

## 🛠 Technologies Used

- HTML5 Canvas
- Vanilla JavaScript
- CSS
- No external libraries

## 🎮 Controls

- ⬆️ Up Arrow: Accelerate
- ⬇️ Down Arrow: Brake/Reverse
- ⬅️ Left Arrow: Turn Left
- ➡️ Right Arrow: Turn Right

## 🚀 Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. Use arrow keys to control the car
4. Observe sensor behavior with obstacles

## 📝 Project Features

### Car Features
- Realistic physics (acceleration, braking, friction)
- Smooth turning mechanics
- Visual details (body, windows, lights)

### Sensor System
- Multiple ray sensors (default: 5 rays)
- 45-degree spread angle
- Collision detection with:
  - Road borders
  - Other vehicles (coming soon)
- Visual feedback:
  - Yellow: Active sensors
  - Red: Detected obstacles
- Distance-based readings with offset calculations

## 🔄 Development Status

- ✅ Car Control: Completed
- ✅ Basic Sensor System: Completed
- 🚧 Advanced Collision Detection: In Progress
- 📝 Traffic Integration: Planned
- 📝 Neural Network: Planned

## 🤝 Contributing

Feel free to contribute to this project by submitting issues or pull requests. All contributions are welcome!

## 📜 License

This project is open source and available under the MIT License. 