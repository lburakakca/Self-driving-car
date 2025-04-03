# Self-Driving Car Simulation Project

This project aims to develop an autonomous vehicle simulation from scratch using vanilla JavaScript, HTML, and CSS. The project follows a step-by-step approach, with each phase stored in separate directories.

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