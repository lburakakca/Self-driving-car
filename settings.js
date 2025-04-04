class Settings {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // --- Default Settings --- 
        // Load from localStorage or use defaults
        this.settings = {
            carCount: parseInt(localStorage.getItem('setting_carCount') || '100'),
            maxSpeed: parseFloat(localStorage.getItem('setting_maxSpeed') || '4'),
            mutationRate: parseFloat(localStorage.getItem('setting_mutationRate') || '0.1'),
            // Add more settings as needed (e.g., sensor length, spread)
        };

        // --- UI Elements (Sliders/Buttons drawn on canvas) ---
        this.uiElements = [];
        this.activeElement = null; // For dragging sliders
        this.mouse = { x: 0, y: 0, down: false };

        this.#createUI();
        this.#addEventListeners();
        this.draw(); // Initial draw
    }

    get(key) {
        return this.settings[key];
    }

    #createUI() {
        const margin = 20;
        let currentY = 30;
        const labelWidth = 100;
        const sliderWidth = this.width - labelWidth - margin * 2;
        const sliderHeight = 10;

        // Car Count Slider
        this.uiElements.push({
            type: 'slider', id: 'carCount', label: 'Car Count:', 
            x: margin + labelWidth, y: currentY + sliderHeight / 2, 
            width: sliderWidth, height: sliderHeight, 
            min: 1, max: 500, step: 1
        });
        currentY += 40;

        // Max Speed Slider
        this.uiElements.push({
            type: 'slider', id: 'maxSpeed', label: 'Max Speed:', 
            x: margin + labelWidth, y: currentY + sliderHeight / 2, 
            width: sliderWidth, height: sliderHeight, 
            min: 1, max: 10, step: 0.1
        });
        currentY += 40;

        // Mutation Rate Slider
        this.uiElements.push({
            type: 'slider', id: 'mutationRate', label: 'Mutation:', 
            x: margin + labelWidth, y: currentY + sliderHeight / 2, 
            width: sliderWidth, height: sliderHeight, 
            min: 0, max: 1, step: 0.01
        });
        currentY += 40;

        // Add Apply Button?
        // For now, changes apply immediately and require manual reload/reset
    }

    #addEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.down = true;
            this.#updateMousePos(e);
            
            // Tüm potansiyel hit alanlarını loglayalım
            const hitResults = this.#getHitTestInfo(this.mouse.x, this.mouse.y);
            console.log("Hit Test Results:", hitResults);
            
            this.activeElement = this.#getElementAtPos(this.mouse.x, this.mouse.y);
            console.log("Mousedown:", this.mouse, "Active Element:", this.activeElement?.id);
            
            if (this.activeElement && this.activeElement.type === 'slider') {
                this.#updateSliderValue(this.activeElement, this.mouse.x);
            }
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            if(this.mouse.down) {
                console.log("Mouseup");
            }
            this.mouse.down = false;
            this.activeElement = null;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.#updateMousePos(e);
            if (this.mouse.down && this.activeElement && this.activeElement.type === 'slider') {
                this.#updateSliderValue(this.activeElement, this.mouse.x);
            }
        });
        
        this.canvas.addEventListener('mouseleave', (e) => {
            // Opsiyonel: Mouse canvas'tan çıkarsa sürüklemeyi durdur
            this.mouse.down = false;
            this.activeElement = null;
        });
    }
    
    #updateMousePos(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = event.clientX - rect.left;
        this.mouse.y = event.clientY - rect.top;
        
        // DPI ölçekleme için düzeltme yapabiliriz
        const cssWidth = this.canvas.clientWidth;
        const cssHeight = this.canvas.clientHeight;
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        // Canvas piksel ile CSS piksel arasındaki dönüşüm
        this.mouse.x = (this.mouse.x / cssWidth) * canvasWidth;
        this.mouse.y = (this.mouse.y / cssHeight) * canvasHeight;
    }
    
    // Yeni yardımcı metod - tüm slider'ların hit alanlarını kontrol eder
    #getHitTestInfo(x, y) {
        const results = [];
        
        for (let i = 0; i < this.uiElements.length; i++) {
            const el = this.uiElements[i];
            if (el.type === 'slider') {
                const value = this.settings[el.id];
                const ratio = Math.max(0, Math.min(1, (value - el.min) / (el.max - el.min)));
                const handleX = el.x + ratio * el.width;
                const sliderY = el.y;
                
                const handleRadius = 20;
                const handleDist = Math.hypot(x - handleX, y - sliderY);
                const onSlider = x >= el.x && x <= el.x + el.width && Math.abs(y - sliderY) <= handleRadius;
                
                results.push({
                    id: el.id,
                    handleX,
                    sliderY,
                    handleDist,
                    onSlider,
                    isHandle: handleDist <= handleRadius,
                    mouseX: x,
                    mouseY: y
                });
            }
        }
        
        return results;
    }

    #getElementAtPos(x, y) {
        console.log(`Checking position: ${x}, ${y}`);
        
        // Önce handleları kontrol et (daha küçük kısımlara öncelik)
        for (let i = this.uiElements.length - 1; i >= 0; i--) {
            const el = this.uiElements[i];
            if (el.type === 'slider') {
                const value = this.settings[el.id];
                const ratio = Math.max(0, Math.min(1, (value - el.min) / (el.max - el.min)));
                const handleX = el.x + ratio * el.width;
                const sliderY = el.y;
                
                const handleRadius = 20;
                
                // Önce handle yakınında mı diye kontrol et
                if (Math.hypot(x - handleX, y - sliderY) <= handleRadius) {
                    console.log(`--> Hit handle for ${el.id}`);
                    return el;
                }
            }
        }
        
        // Sonra sliderlardaki barları kontrol et
        for (let i = this.uiElements.length - 1; i >= 0; i--) {
            const el = this.uiElements[i];
            if (el.type === 'slider') {
                const sliderY = el.y;
                
                // Slider çubuğunun üzerinde mi kontrol et
                if (x >= el.x && x <= el.x + el.width && 
                    Math.abs(y - sliderY) <= 20) {
                    console.log(`--> Hit bar for ${el.id}`);
                    return el;
                }
            }
        }
        
        console.log("--> No element hit");
        return null;
    }

    #updateSliderValue(element, mouseX) {
        let ratio = (mouseX - element.x) / element.width;
        ratio = Math.max(0, Math.min(1, ratio)); // Clamp between 0 and 1
        let value = element.min + ratio * (element.max - element.min);
        
        // Snap to step
        value = Math.round(value / element.step) * element.step;
        value = parseFloat(value.toFixed(element.step < 1 ? 2 : 0)); // Adjust precision
        
        if (this.settings[element.id] !== value) {
            this.settings[element.id] = value;
            // Save setting to localStorage
            localStorage.setItem(`setting_${element.id}`, value.toString());
            this.draw(); // Redraw settings panel
            
            // Log change for debugging
            console.log(`Setting ${element.id} changed to ${value}. Reload or Reset simulation.`);
        }
    }

    draw() {
        // Clear canvas with a light gray background
        this.ctx.fillStyle = '#f0f0f0'; // Lighter background
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw Title
        this.ctx.fillStyle = "#2c3e50"; // Darker blue-gray title
        this.ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Settings", this.width / 2, 30);

        // Reset for drawing elements
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "14px 'Segoe UI', Arial, sans-serif";
        this.ctx.lineWidth = 1;

        let startY = 60; // Start drawing elements lower
        const elementSpacing = 55; // Space between sliders
        const padding = 15;
        const labelWidth = 80;
        const valueWidth = 40;
        const sliderX = padding + labelWidth;
        const sliderWidth = this.width - sliderX - valueWidth - padding;

        this.uiElements.forEach((el, index) => {
            const currentY = startY + index * elementSpacing;
            
            if (el.type === 'slider') {
                // Update the slider's y position to match what's used in getElementAtPos
                el.y = currentY + 10; // Store this position for hit detection
                
                // Draw background box for slider area
                this.ctx.fillStyle = "#ffffff"; // White background box
                this.ctx.strokeStyle = "#ccc"; // Light gray border
                this.ctx.lineWidth = 1;
                this.roundRect(padding / 2, currentY - elementSpacing / 2 + 5, this.width - padding, elementSpacing - 10, 5);
                this.ctx.fill();
                this.ctx.stroke();

                // Draw Label
                this.ctx.fillStyle = "#34495e"; // Slightly darker text color
                this.ctx.font = "13px 'Segoe UI', Arial, sans-serif";
                this.ctx.fillText(el.label, padding, currentY);
                
                // --- Draw Slider --- 
                const sliderY = el.y; // Use the same y position saved in el.y
                
                // Draw Slider Bar background
                this.ctx.strokeStyle = "#bdc3c7"; // Gray bar
                this.ctx.lineWidth = 4; 
                this.ctx.lineCap = "round";
                this.ctx.beginPath();
                this.ctx.moveTo(sliderX, sliderY);
                this.ctx.lineTo(sliderX + sliderWidth, sliderY);
                this.ctx.stroke();

                // Draw Slider Filled Bar 
                const value = this.settings[el.id];
                const ratio = Math.max(0, Math.min(1, (value - el.min) / (el.max - el.min))); // Ensure ratio is valid
                const fillWidth = ratio * sliderWidth;
                this.ctx.strokeStyle = "#3498db"; // Blue for filled part
                this.ctx.beginPath();
                this.ctx.moveTo(sliderX, sliderY);
                this.ctx.lineTo(sliderX + fillWidth, sliderY);
                this.ctx.stroke();
                this.ctx.lineCap = "butt"; 

                // Draw Handle 
                const handleX = sliderX + fillWidth;
                const handleRadius = 7;
                this.ctx.fillStyle = "#2980b9"; // Darker blue handle
                if (this.activeElement === el) {
                    this.ctx.fillStyle = "#1f618d"; 
                }
                this.ctx.beginPath();
                this.ctx.arc(handleX, sliderY, handleRadius, 0, Math.PI * 2);
                this.ctx.fill();
                // Add a lighter border to handle
                this.ctx.strokeStyle = "#ecf0f1";
                this.ctx.lineWidth = 1.5;
                this.ctx.stroke();

                // Draw Value Text
                this.ctx.fillStyle = "#2c3e50";
                this.ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
                this.ctx.textAlign = "right";
                this.ctx.fillText(value.toFixed(el.step < 1 ? 2 : 0), this.width - padding, currentY);
                this.ctx.textAlign = "left"; // Reset alignment
            }
        });

        // Update hint text position and style
        this.ctx.fillStyle = "#7f8c8d"; // Gray hint text
        this.ctx.font = "italic 11px 'Segoe UI', Arial, sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Reload (Space) or Discard", this.width / 2, this.height - 30);
        this.ctx.fillText("to apply changed settings.", this.width / 2, this.height - 15);
    }

    // Helper function to draw rounded rectangles (add this method)
    roundRect(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x+r, y);
        this.ctx.arcTo(x+w, y,   x+w, y+h, r);
        this.ctx.arcTo(x+w, y+h, x,   y+h, r);
        this.ctx.arcTo(x,   y+h, x,   y,   r);
        this.ctx.arcTo(x,   y,   x+w, y,   r);
        this.ctx.closePath();
        return this;
      }
} 