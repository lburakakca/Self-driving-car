class Visualizer {
    static drawNetwork(ctx, network, time = 0) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        const levelHeight = height / network.levels.length;

        // Draw levels from bottom to top (input at bottom, output at top)
        for (let i = network.levels.length - 1; i >= 0; i--) {
            const levelTop = top +
                Visualizer.lerp(
                    height - levelHeight,
                    0,
                    network.levels.length == 1
                        ? 0.5
                        : i / (network.levels.length - 1)
                );

            ctx.setLineDash([7, 3]); // Dashed lines for level boundaries
            Visualizer.drawLevel(ctx,
                network.levels[i],
                left,
                levelTop,
                width,
                levelHeight,
                i == network.levels.length - 1 // Is it the output layer?
                    ? ['↑', '←', '→', '↓'] // Output labels (arrows)
                    : [],
                time // Pass time for potential animation
            );
        }
    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels, time) {
        const right = left + width;
        const bottom = top + height;

        const { inputs, outputs, weights, biases } = level;

        // Style connections (weights)
        const nodeRadius = 18;
        ctx.lineWidth = 2;

        // Draw connections between input and output nodes
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.getNodeX(inputs, i, left, right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.getNodeX(outputs, j, left, right),
                    top
                );
                // Set color based on weight (positive=yellow, negative=blue)
                ctx.strokeStyle = Visualizer.getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        // Draw input nodes
        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black"; // Node background
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            // Fill color based on input value (intensity)
            ctx.fillStyle = Visualizer.getRGBA(inputs[i]);
            ctx.fill();
        }

        // Draw output nodes
        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.getNodeX(outputs, i, left, right);
            // Draw node background
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            // Draw activation fill based on output value
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = Visualizer.getRGBA(outputs[i]);
            ctx.fill();

            // Draw bias visualization (outer ring)
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
            // Color based on bias value
            ctx.strokeStyle = Visualizer.getRGBA(biases[i]);
             // Add animation effect to bias ring using time
            const phase = Math.sin(time / 500 + i * 0.5) * 5 + 5; // Pulsating effect
            ctx.setLineDash([phase, 3]); 
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash

            // Draw output labels if provided
            if (outputLabels[i]) {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = (nodeRadius * 1) + "px Arial";
                ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
                ctx.lineWidth=0.5;
                ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
            }
        }
    }

    // Helper to calculate horizontal position of a node
    static getNodeX(nodes, index, left, right) {
        return Visualizer.lerp(
            left,
            right,
            nodes.length == 1
                ? 0.5
                : index / (nodes.length - 1)
        );
    }

    // Helper to get RGBA color based on value (positive=yellow, negative=blue)
    static getRGBA(value) {
        const alpha = Math.abs(value); // Intensity based on absolute value
        const R = value > 0 ? 0 : 255;    // Blue if negative
        const G = R;                      // Yellow/Blue mix based on sign
        const B = value < 0 ? 0 : 255;    // Yellow if positive
        return `rgba(${R},${G},${B},${alpha})`;
    }

    // Linear interpolation
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }
} 