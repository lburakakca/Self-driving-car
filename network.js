class Level {
    constructor(inputCount, outputCount) {
        // Initialize arrays for inputs, outputs, and biases
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        // Initialize the weights matrix
        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            // Each input neuron connects to all output neurons
            this.weights[i] = new Array(outputCount);
        }

        // Randomize initial weights and biases
        Level.#randomize(this);
    }

    // Static private method to initialize weights and biases with random values
    static #randomize(level) {
        // Randomize weights between -1 and 1
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                // Assign a random weight
                level.weights[i][j] = Math.random() * 2 - 1; // Value between -1 and 1
            }
        }

        // Randomize biases between -1 and 1
        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1; // Value between -1 and 1
        }
    }

    // Feedforward method
    static feedForward(givenInputs, level) {
        // Copy given inputs to the level's input array
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        // Calculate outputs for each neuron in the level
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            // Sum weighted inputs
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            // Apply activation (simple threshold based on bias for now)
            // If sum is greater than the bias, output neuron is 'active' (1), otherwise inactive (0)
            // Note: This is a very simple activation. Alternatives like Sigmoid or ReLU might be better.
            if (sum + level.biases[i] > 0) { // Check if weighted sum + bias is positive
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }
}

class NeuralNetwork {
    constructor(neuronCounts) { // neuronCounts is an array like [inputCount, hiddenCount1, ..., outputCount]
        this.levels = [];
        // Create levels based on the neuron counts
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(
                neuronCounts[i],      // Input count for this level
                neuronCounts[i + 1]   // Output count for this level
            ));
        }
    }

    static feedForward(givenInputs, network) {
        // Get initial outputs by feeding inputs to the first level
        let outputs = Level.feedForward(
            givenInputs, 
            network.levels[0]
        );

        // Propagate outputs through subsequent levels
        for (let i = 1; i < network.levels.length; i++) {
            // The output of the previous level is the input for the current level
            outputs = Level.feedForward(
                outputs, 
                network.levels[i]
            );
        }

        // Return the final outputs from the last level
        return outputs;
    }

    // Static method to mutate the network's weights and biases
    static mutate(network, amount = 1) { // amount: 0=no change, 1=full random change
        network.levels.forEach(level => {
            // Mutate biases
            for (let i = 0; i < level.biases.length; i++) {
                // Interpolate bias towards a random value (-1 to 1)
                level.biases[i] = Visualizer.lerp( // Using Visualizer.lerp, assumes it's available globally or passed
                    level.biases[i],
                    Math.random() * 2 - 1,
                    amount
                );
            }
            // Mutate weights
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    // Interpolate weight towards a random value (-1 to 1)
                    level.weights[i][j] = Visualizer.lerp(
                        level.weights[i][j],
                        Math.random() * 2 - 1,
                        amount
                    );
                }
            }
        });
    }
}
