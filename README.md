# Self-Driving Car Simulation (No Libraries)

This project is a simple 2D simulation of a self-driving car environment, built purely with vanilla JavaScript, HTML, and CSS, without relying on any external game or physics libraries.

## 🚀 Project Status (Latest Update)

*   **Layout:** Three-column (Settings | Simulation | Network) centered layout.
*   **Settings Panel:** Improved UI with sliders for Car Count, Max Speed, Mutation Rate. Settings saved to `localStorage`, require reload (Space/Discard) to apply.
*   **Cars:** Stylized car shapes with body, roof, headlights, and taillights.
*   **Traffic:** Fixed, looping traffic patterns based on difficulty.
*   **Controls:**
    *   Difficulty change reloads the page.
    *   Spacebar reloads the page.
    *   Save/Discard buttons manage the best car's brain in `localStorage`.

## Project Goal

The main goal is to simulate cars that can perceive their environment and learn to navigate a multi-lane road with traffic using a simple neural network and evolutionary concepts.

## Current Features (Detailed - Reflecting Latest Status)

*   **Layout:** Three-column layout featuring:
    *   **Settings Panel (Left):** Improved UI allows adjusting simulation parameters via interactive sliders (Car Count, Max Speed, Mutation Rate). Settings are saved to `localStorage` and applied on reload.
    *   **Simulation Canvas (Center):** Displays the main car simulation, road, and traffic.
    *   **Network Canvas (Right):** Visualizes the neural network of the best-performing car.
*   **Controls Bar (Bottom):** Contains buttons for saving/discarding the best brain and a dropdown for selecting difficulty.
*   **AI Cars:**
    *   Number adjustable via Settings Panel.
    *   Max speed adjustable via Settings Panel.
    *   Controlled by a simple Neural Network.
    *   Use sensors (ray casting) to perceive road borders and traffic.
    *   Apply basic rules (avoid edges, brake for obstacles).
    *   Blue, stylized car shape with lights.
    *   Sensors are only visually rendered for the current best car.
*   **Fixed Traffic:**
    *   Uses predefined, looping patterns based on selected difficulty (1-5).
    *   Cars are red, stylized shapes with lights.
*   **Neural Network:**
    *   Simple feedforward network (`network.js`).
    *   Visualized in real-time (`visualizer.js`).
    *   Mutation rate adjustable via Settings Panel (`localStorage`).
*   **Persistence & Control:**
    *   **Save:** Saves the brain of the best car to `localStorage`.
    *   **Discard:** Removes the saved brain from `localStorage` and reloads the page (starts with random brains).
    *   **Difficulty Selector:** Changing difficulty saves the selection and reloads the page. The simulation restarts with the new difficulty, using the saved brain if available.
    *   **Spacebar:** Reloads the page, maintaining the current difficulty and loading the saved brain if available.
    *   **Settings Panel:** Changes made here are saved to `localStorage` immediately but require a reload (Spacebar or Discard button) to take effect in the simulation.

## File Structure

*   `index.html`: Sets up the three canvases (`settingsCanvas`, `carCanvas`, `networkCanvas`), the controls bar, and includes all JavaScript files.
*   `style.css`: Styles the page layout (3-column flexbox), canvases, settings panel elements (drawn via JS), and controls bar.
*   `main.js`: Initializes settings and simulation, creates the car population based on settings, handles the main animation loop (updating, drawing), manages `localStorage` for difficulty and brain, and handles button/keyboard events.
*   `settings.js`: Defines the `Settings` class, responsible for drawing the settings panel UI (sliders), handling user interaction with settings, and saving/loading settings values to/from `localStorage`.
*   `car.js`: Defines the `Car` class (handles `AI` and `DUMMY` types), movement logic, AI rule application, collision detection (using a rectangular polygon), and drawing (stylized car shape with roof).
*   `network.js`: Defines the `Level` and `NeuralNetwork` classes, including feedforward and mutation logic.
*   `visualizer.js`: Contains the `Visualizer` class with static methods to draw the neural network.
*   `road.js`: Defines the `Road` class for geometry and drawing.
*   `sensor.js`: Defines the `Sensor` class for ray casting.
*   `controls.js`: Defines the `Controls` class (primarily stores AI decisions).
*   `utils.js`: (Assumed) Contains utility functions like `lerp`, `polysIntersect`.

## How to Run

1.  Clone or download the repository.
2.  Open the `index.html` file in a web browser.
3.  Observe the simulation: Settings on the left, car simulation in the center, network visualization on the right.
4.  Use the controls:
    *   **Settings Panel:** Adjust sliders (requires reload/discard to apply).
    *   **Difficulty Dropdown:** Select difficulty (reloads page).
    *   `Save`: Saves the current best car's network.
    *   `Discard`: Clears the saved brain and reloads.
    *   `Spacebar`: Reloads the simulation (uses saved brain/settings if available).

## Next Steps (Potential)

*   Implement a proper genetic algorithm (selection, crossover) beyond just mutation.
*   Improve the fitness function.
*   Refine AI rules or network structure.
*   Add more adjustable settings (sensor range, angle, etc.).
*   Optimize performance.

## 🤝 Contributing

Feel free to contribute to this project by submitting issues or pull requests. All contributions are welcome!

## 📜 License

This project is open source and available under the MIT License. 