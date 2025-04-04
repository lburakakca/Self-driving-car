# Self-Driving Car Simulation (No Libraries)

This project is a simple 2D simulation of a self-driving car environment, built purely with vanilla JavaScript, HTML, and CSS, without relying on any external game or physics libraries.

## Project Goal

The main goal is to simulate cars that can perceive their environment and learn to navigate a multi-lane road with traffic using a simple neural network and evolutionary concepts.

## Current Features

*   **HTML Canvas Rendering:** The simulation uses two canvases: one for the car simulation (`carCanvas`) and one for visualizing the neural network (`networkCanvas`).
*   **Parallel Simulation:** Runs multiple AI cars (`N=100` by default) simultaneously to speed up potential training.
*   **Best Car Tracking:** Identifies the car that travels the furthest down the road without crashing and focuses the main view and network visualization on it.
*   **Road:** A multi-lane road with borders and dashed lane markings.
*   **Player/AI Car:**
    *   Controlled by a simple Neural Network (`AI` type).
    *   Uses sensors (ray casting) to perceive road borders and traffic.
    *   Applies basic rules on top of network outputs (avoids driving off edges, brakes for obstacles in the same lane).
    *   Blue color.
    *   Sensors are only visually rendered for the current best car.
*   **Dummy Traffic:**
    *   Multiple cars moving straight ahead at constant speeds.
    *   Act as obstacles.
    *   Red color.
*   **Neural Network:**
    *   Simple feedforward network (`network.js`).
    *   Visualized in real-time on the `networkCanvas` (`visualizer.js`).
    *   Basic mutation function implemented.
*   **Saving/Loading/Resetting:**
    *   The brain (weights and biases) of the best-performing car can be saved to the browser's `localStorage` using the "Save" button.
    *   Saved brains are automatically loaded and applied (with mutation) to the car population when the simulation restarts.
    *   The "Discard" and "Reset" buttons clear the saved brain from `localStorage` and reload the page for a fresh start with random brains.
*   **Controls:**
    *   Spacebar reloads the simulation (useful for restarting with/without a saved brain).

## File Structure

*   `index.html`: Sets up the two canvases, buttons, and includes all JavaScript files.
*   `style.css`: Styles the page layout, canvases, and buttons.
*   `main.js`: Initializes the simulation, creates the car population and traffic, handles the main animation loop (updating, finding best car, drawing), manages `localStorage`, and handles button/keyboard events.
*   `car.js`: Defines the `Car` class (handles `AI` and `DUMMY` types), movement logic, AI rule application, collision detection, and drawing (with conditional sensor display).
*   `network.js`: Defines the `Level` and `NeuralNetwork` classes, including feedforward and mutation logic.
*   `visualizer.js`: Contains the `Visualizer` class with static methods to draw the neural network on the `networkCanvas`.
*   `road.js`: Defines the `Road` class for geometry and drawing.
*   `sensor.js`: Defines the `Sensor` class for ray casting.
*   `controls.js`: Defines the `Controls` class (currently primarily used to store AI decisions, keyboard listeners only active if `PLAYER` type were used).
*   `utils.js`: (Assumed) Contains utility functions like `lerp`, `polysIntersect`.

## How to Run

1.  Clone or download the repository.
2.  Open the `index.html` file in a web browser.
3.  Observe the simulation: The left canvas shows cars, focusing on the best one. The right canvas shows the best car's neural network.
4.  Use the buttons:
    *   `Save Best Brain`: Saves the current best car's network to `localStorage`.
    *   `Discard Brain` / `Reset Brain`: Clears the saved brain and reloads.
5.  Press `Spacebar` to reload the simulation (will use saved brain if one exists).

## Next Steps (Potential)

*   Implement a proper genetic algorithm (selection, crossover, mutation) to evolve the brains over generations.
*   Improve the fitness function (beyond just furthest distance).
*   Refine the AI rules or replace them with more complex network outputs/structures.
*   Optimize performance for a larger number of cars or more complex networks.

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
- ✅ Advanced Collision Detection: Completed
- 📝 Traffic Integration: Planned
- ✅ Neural Network: Completed

## 🤝 Contributing

Feel free to contribute to this project by submitting issues or pull requests. All contributions are welcome!

## 📜 License

This project is open source and available under the MIT License. 