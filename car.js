class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.25;
        this.maxSpeed=10;
        this.friction=0.1;
        this.handling=0.04;
        this.angle=0;
        this.damaged=false;

        this.brakeForce=0.15;

        this.sensor=new Sensor(this);
        this.controls=new Controls();
    }

    update(roadBorders, traffic){
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders, traffic);
        }
        this.sensor.update(roadBorders, traffic);
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
            const turnSpeed = this.handling * (1 + Math.abs(this.speed/this.maxSpeed));
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

    draw(ctx){
        if(this.damaged){
            ctx.fillStyle="gray";
        }

        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);

        // Shadow effect
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        // Car body
        ctx.beginPath();
        ctx.fillStyle = this.damaged?"#A9A9A9":"#2E86C1";
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = 'transparent';

        if(!this.damaged){
            // Roof
            ctx.fillStyle = "#1B4F72";
            ctx.beginPath();
            ctx.rect(
                -this.width/2 * 0.7,
                -this.height/2 * 0.7,
                this.width * 0.7,
                this.height * 0.4
            );
            ctx.fill();

            // Windows
            ctx.fillStyle = "#A9CCE3";
            // Side windows
            ctx.beginPath();
            ctx.rect(
                -this.width/2 * 0.65,
                -this.height/2 * 0.6,
                this.width * 0.15,
                this.height * 0.3
            );
            ctx.rect(
                this.width/2 * 0.5,
                -this.height/2 * 0.6,
                this.width * 0.15,
                this.height * 0.3
            );
            ctx.fill();

            // Headlights
            ctx.fillStyle = "#F7DC6F";
            ctx.beginPath();
            ctx.rect(
                -this.width/2 * 0.9,
                -this.height/2 * 0.9,
                this.width * 0.2,
                this.height * 0.2
            );
            ctx.rect(
                this.width/2 * 0.7,
                -this.height/2 * 0.9,
                this.width * 0.2,
                this.height * 0.2
            );
            ctx.fill();

            // Taillights
            ctx.fillStyle = "#E74C3C";
            ctx.beginPath();
            ctx.rect(
                -this.width/2 * 0.9,
                this.height/2 * 0.7,
                this.width * 0.2,
                this.height * 0.15
            );
            ctx.rect(
                this.width/2 * 0.7,
                this.height/2 * 0.7,
                this.width * 0.2,
                this.height * 0.15
            );
            ctx.fill();

            // Wheels
            ctx.fillStyle = "#17202A";
            ctx.beginPath();
            // Front wheels
            ctx.rect(
                -this.width/2 * 0.9,
                -this.height/2 * 0.6,
                this.width * 0.15,
                this.height * 0.25
            );
            ctx.rect(
                this.width/2 * 0.75,
                -this.height/2 * 0.6,
                this.width * 0.15,
                this.height * 0.25
            );
            // Rear wheels
            ctx.rect(
                -this.width/2 * 0.9,
                this.height/2 * 0.35,
                this.width * 0.15,
                this.height * 0.25
            );
            ctx.rect(
                this.width/2 * 0.75,
                this.height/2 * 0.35,
                this.width * 0.15,
                this.height * 0.25
            );
            ctx.fill();
        }

        ctx.restore();
        
        this.sensor.draw(ctx);
    }
}