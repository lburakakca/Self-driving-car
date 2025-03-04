class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.3;
        this.maxSpeed=5;
        this.friction=0.05;
        this.angle=0;
        this.damaged=false;

        this.controls=new Controls();
    }

    update(){
        this.#move();
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
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
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);

        // Car body
        ctx.beginPath();
        ctx.fillStyle = "#2E86C1"; // Modern blue color
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill();

        // Car details
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

        ctx.restore();
    }
}