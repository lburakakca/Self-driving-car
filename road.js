class Road {
    constructor(x, width, laneCount = 1) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        // Lane marking properties
        this.laneWidth = this.width / this.laneCount;
        this.dashLength = 30; // Length of each dash
        this.dashGap = 20; // Gap between dashes
    }

    draw(ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#FFFFFF";

        // Draw center lane markings
        ctx.setLineDash([this.dashLength, this.dashGap]);
        ctx.beginPath();
        ctx.moveTo(this.x, this.top);
        ctx.lineTo(this.x, this.bottom);
        ctx.stroke();

        // Reset dash settings
        ctx.setLineDash([]);
    }
} 