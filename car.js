class Car{
    constructor(x,y,width,height, controlType="PLAYER", maxSpeed=4){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.25;
        this.maxSpeed= (controlType === "DUMMY") ? maxSpeed * 0.6 : maxSpeed;
        this.friction=0.1;
        this.handling=0.04;
        this.angle=0;
        this.damaged=false;
        this.controlType = controlType;

        this.useBrain = (controlType == "AI");

        this.brakeForce=0.15;

        if(controlType !== "DUMMY"){
            this.sensor=new Sensor(this);
            this.brain= new NeuralNetwork(
                [this.sensor.rayCount, 6, 4]
            );
        }
        this.controls=new Controls(controlType);
    }

    update(roadBorders, traffic){
        if(!this.damaged){
            if (this.controlType === "DUMMY") {
                this.#moveDummy();
            } else {
                if(this.useBrain && this.sensor && this.brain){
                    // 1. Get sensor readings (inputs for the network)
                    const sensorOffsets = this.sensor.readings.map(
                        s => s==null?0:1-s.offset // Closer = higher value (0 to 1)
                    );
                    
                    // 2. Get raw outputs (recommendations) from the neural network
                    const outputs = NeuralNetwork.feedForward(sensorOffsets, this.brain);
                    console.log("Raw AI Outputs:", outputs);

                    // 3. Apply rules based on sensor data and road position
                    const currentLaneIndex = road.getLaneIndex(this.x);
                    const laneWidth = road.laneWidth;
                    const frontSensorThreshold = 0.7; // How close an object needs to be to react (1-offset)
                    let obstacleInLane = false;

                    // Check sensors for obstacles directly in front (within the same lane)
                    for(let i=0; i < this.sensor.rayCount; i++){
                        const reading = this.sensor.readings[i];
                        if(reading && reading.offset < (1 - frontSensorThreshold)) { // If object is close
                            // Calculate the x-coordinate of the detected point
                            const angle = this.sensor.rays[i][1].angle + this.angle; // Consider car's angle
                            const touchX = this.x - Math.sin(angle) * reading.offset * this.sensor.rayLength; // Approximate touch X
                            const obstacleLaneIndex = road.getLaneIndex(touchX);
                            
                            if(obstacleLaneIndex === currentLaneIndex){
                                obstacleInLane = true;
                                console.log(`Obstacle detected in lane ${currentLaneIndex} by sensor ${i}`);
                                break; // Found an obstacle in our lane, no need to check further
                            }
                        }
                    }

                    // --- Apply Control Rules --- 
                    // Default: try to go forward, no turning/reversing
                    this.controls.forward = true;
                    this.controls.left = false;
                    this.controls.right = false;
                    this.controls.reverse = false;

                    // Rule 1: Obstacle in lane? -> Don't go forward, maybe reverse/brake
                    if(obstacleInLane){
                        this.controls.forward = false;
                        // Optional: Engage reverse/brake based on network output or fixed rule
                        // this.controls.reverse = outputs[3] > 0.5; // Use network's reverse suggestion?
                        this.controls.reverse = true; // Simple braking action
                        console.log("Rule Applied: Obstacle -> Brake");
                    }

                    // Rule 2: Avoid Edges -> Override turn signals if on edge lanes
                    if(currentLaneIndex === 0){ // On leftmost lane
                        this.controls.left = false; // Don't allow turning left
                        if(outputs[1] > 0.5) console.log("Rule Applied: Left Edge -> Ignoring Left Turn"); 
                    } else {
                        // Allow left turn only if no obstacle and network suggests it
                        this.controls.left = !obstacleInLane && outputs[1] > 0.5; 
                    }
                    
                    if(currentLaneIndex === road.laneCount - 1){ // On rightmost lane
                        this.controls.right = false; // Don't allow turning right
                         if(outputs[2] > 0.5) console.log("Rule Applied: Right Edge -> Ignoring Right Turn"); 
                    } else {
                        // Allow right turn only if no obstacle and network suggests it
                        this.controls.right = !obstacleInLane && outputs[2] > 0.5; 
                    }
                    
                    // Rule 3: Prioritize Forward (already default)
                    // Only override forward if obstacle detected.
                    // Turn signals are only active if no obstacle and not on edge lane and network suggests.
                    
                    console.log("Final Controls:", JSON.stringify(this.controls));

                    // (Keep the original move call outside the AI block)
                }
                // Move based on final controls (manual or AI + rules)
                this.#move(); 
            }
            this.polygon=this.#createPolygon();
            // Assess damage against borders and traffic (all types except dummy-dummy)
            this.damaged=this.#assessDamage(roadBorders, (this.controlType !== "DUMMY") ? traffic : []);
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
        }
    }

    #assessDamage(roadBorders, traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            if(this.speed > 0){
                this.speed-=this.brakeForce;
            }else{
                this.speed-=this.acceleration;
            }
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            const turnSpeed = this.handling * (0.5 + Math.abs(this.speed/this.maxSpeed));
            if(this.controls.left){
                this.angle+=turnSpeed*flip;
            }
            if(this.controls.right){
                this.angle-=turnSpeed*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    #moveDummy() {
        this.speed = this.maxSpeed;
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx, drawSensor = true){
        // Polygon'u (çarpışma alanını) çiz - bu orijinal davranış
        if(this.damaged){
            ctx.fillStyle="gray";
        } else {
            ctx.fillStyle = (this.controlType === "DUMMY") ? "#E74C3C" : "#2E86C1";
        }

        if(this.polygon){
            ctx.beginPath();
            ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
            for(let i=1; i<this.polygon.length; i++){
                ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
            }
            ctx.fill();
        }

        // Araba görünümünü güzelleştir (polygon üzerine ekstralar)
        if (this.polygon && this.polygon.length === 4) {
            // Çatı/Cam alanı
            const p1 = this.polygon[0]; // sol üst
            const p2 = this.polygon[1]; // sağ üst
            const p3 = this.polygon[2]; // sağ alt
            const p4 = this.polygon[3]; // sol alt

            // Çatı noktaları (arabanın %60'ı genişliğinde ve %40'ı yüksekliğinde)
            const roofPoints = [
                { // sol üst
                    x: p1.x + (p4.x - p1.x) * 0.2 + (p2.x - p1.x) * 0.2,
                    y: p1.y + (p4.y - p1.y) * 0.2 + (p2.y - p1.y) * 0.2
                },
                { // sağ üst
                    x: p2.x + (p3.x - p2.x) * 0.2 + (p1.x - p2.x) * 0.2,
                    y: p2.y + (p3.y - p2.y) * 0.2 + (p1.y - p2.y) * 0.2
                },
                { // sağ alt
                    x: p3.x + (p2.x - p3.x) * 0.2 + (p4.x - p3.x) * 0.2,
                    y: p3.y + (p2.y - p3.y) * 0.2 + (p4.y - p3.y) * 0.2
                },
                { // sol alt
                    x: p4.x + (p1.x - p4.x) * 0.2 + (p3.x - p4.x) * 0.2,
                    y: p4.y + (p1.y - p4.y) * 0.2 + (p3.y - p4.y) * 0.2
                }
            ];

            // Çatı/cam çiz
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.beginPath();
            ctx.moveTo(roofPoints[0].x, roofPoints[0].y);
            for(let i=1; i<roofPoints.length; i++){
                ctx.lineTo(roofPoints[i].x, roofPoints[i].y);
            }
            ctx.closePath();
            ctx.fill();

            // Farlar (hasarsız ise)
            if(!this.damaged) {
                // Farların konumunu hesapla (ön taraf)
                const frontMidX = (p1.x + p2.x) / 2;
                const frontMidY = (p1.y + p2.y) / 2;
                const headlightSpacing = Math.hypot(p2.x - p1.x, p2.y - p1.y) * 0.3;
                const headlightSize = Math.hypot(p2.x - p1.x, p2.y - p1.y) * 0.08;
                
                // Far noktaları (sol ve sağ)
                const headlightVectorX = (p2.x - p1.x) / Math.hypot(p2.x - p1.x, p2.y - p1.y);
                const headlightVectorY = (p2.y - p1.y) / Math.hypot(p2.x - p1.x, p2.y - p1.y);
                
                // Farları çiz
                ctx.fillStyle = this.controlType === "DUMMY" ? "#ffcc00" : "#f1c40f";
                
                // Sol far
                ctx.beginPath();
                ctx.arc(
                    frontMidX - headlightVectorX * headlightSpacing,
                    frontMidY - headlightVectorY * headlightSpacing,
                    headlightSize, 0, Math.PI * 2
                );
                ctx.fill();
                
                // Sağ far
                ctx.beginPath();
                ctx.arc(
                    frontMidX + headlightVectorX * headlightSpacing,
                    frontMidY + headlightVectorY * headlightSpacing,
                    headlightSize, 0, Math.PI * 2
                );
                ctx.fill();
                
                // Arka stoplar
                const backMidX = (p3.x + p4.x) / 2;
                const backMidY = (p3.y + p4.y) / 2;
                const taillightSize = headlightSize * 0.8;
                
                ctx.fillStyle = "#c0392b"; // Kırmızı arka stop
                
                // Sol stop
                ctx.beginPath();
                ctx.arc(
                    backMidX - headlightVectorX * headlightSpacing,
                    backMidY - headlightVectorY * headlightSpacing,
                    taillightSize, 0, Math.PI * 2
                );
                ctx.fill();
                
                // Sağ stop
                ctx.beginPath();
                ctx.arc(
                    backMidX + headlightVectorX * headlightSpacing,
                    backMidY + headlightVectorY * headlightSpacing,
                    taillightSize, 0, Math.PI * 2
                );
                ctx.fill();
            }
        }

        // Sensörleri çiz
        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }
    }
}