class Road {
    constructor(x, width, laneCount = 4) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        // Define border corner points
        const topLeft = { x: this.left, y: this.top };
        const topRight = { x: this.right, y: this.top };
        const bottomLeft = { x: this.left, y: this.bottom };
        const bottomRight = { x: this.right, y: this.bottom };

        // Store borders as an array of two line segments
        this.borders = [
            [topLeft, bottomLeft],     // Left border segment
            [topRight, bottomRight]    // Right border segment
        ];

        // Lane marking properties
        this.laneWidth = this.width / this.laneCount;
        this.dashLength = 30; // Length of each dash
        this.dashGap = 20; // Gap between dashes
    }

    getLaneCenter(laneIndex){
        const laneWidth = this.width/this.laneCount;
        return this.left + laneWidth/2 + 
            Math.min(laneIndex, this.laneCount-1)*laneWidth;
    }

    draw(ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#FFFFFF";

        // Draw all lane markings
        for(let i = 1; i <= this.laneCount-1; i++){
            const x = lerp(
                this.left,
                this.right,
                i/this.laneCount
            );
            
            ctx.setLineDash([this.dashLength, this.dashGap]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        // Draw road borders
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(this.left, this.top);
        ctx.lineTo(this.left, this.bottom);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.right, this.top);
        ctx.lineTo(this.right, this.bottom);
        ctx.stroke();
    }
}

// Linear interpolation helper function
function lerp(A,B,t){
    return A+(B-A)*t;
} 