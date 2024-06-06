const canvas = document.querySelector('canvas')
// console.log(canva)
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight
                                                    // Player class
class Player{
    constructor() {
        this.velocity = {
            x:0,
            y:0
        },
        this.rotation = 0

        const image = new Image()
        image.src = './image/spaceship.png'
        image.onload = () => {
            this.image = image
            this.width = image.width * .15
            this.height = image.height * .15
            this.position = {
                x:canvas.width/2 - this.width/2,
                y:canvas.height - this.height - 5
            }
        }
        
    }

    

    draw() {

        c.save()
        c.translate(player.position.x + player.width / 2 ,
                    player.position.y + player.height / 2)
        c.rotate(this.rotation)
        
        c.translate(-player.position.x - player.width / 2 ,
                    -player.position.y - player.height / 2)

        
        
        c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
        c.restore()
    }

    update() {
        if (this.image){
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}
                                                        // Projectile class
class Projectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 5
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x ,this.position.y ,this.radius ,0 ,Math.PI * 2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y
    }
}

                                                    // invader class
class Invader{
    constructor({position}) {
        this.position = {
            x: this.x,
            y: this.y
        },
        this.velocity = {
            x:0,
            y:0
        }
        
        const image = new Image()
        image.src = './image/invaders.svg'
        image.onload = () => {
            this.image = image
            this.width = image.width * .05
            this.height = image.height * .05
            this.position = {
                x:position.x,
                y:position.y
            }
        }
        
    }
    draw() {

        c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
        
    }

    update({velocity}) {
        if (this.image){
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectiles){
        invaderProjectiles.push(
            new InvaderProjectile({
            position:{
                x: this.position.x + this.width/ 2,
                y: this.position.y + this.height
            },
            velocity:{
                x:0,
                y:5
            }
        }))
    }
}

class InvaderProjectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.height = 10
        this.width = 3
    }

    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y
    }
}

class Grid{
    constructor() {
        this.position = {
            x:0,
            y:0
        }
        this.velocity = {
            x:3,
            y:0
        }

        this.invaders = []

        const row = Math.floor(Math.random()*5+2)
        const col = Math.floor(Math.random()*10+2)

        this.width = col * 50
        for(let x = 0;x < col;x++){
            for(let y = 0; y < row ; y++){
                this.invaders.push(new Invader({
                    position:{
                        x:x * 50,
                        y:y * 50
                    }
                }))
            }
        }
        // console.log(this.invaders)
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.position.y
        
        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0){
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

const player = new Player()
const projectiles = []
const invaderProjectiles = []
const grids = [new Grid()]
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}
let frames = 0
let randomInterval = (Math.random()*500) + 500

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width,canvas.height)
    
    
    player.update()

    invaderProjectiles.forEach((invaderProjectile) => {
        invaderProjectile.update()
    })

    invaderProjectiles.forEach((invaderProjectile,index) => {
        if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height ){
            setTimeout(() => {
                invaderProjectiles.splice(index,1)
            },0)
        } else {
            invaderProjectile.update()
        }

        if(invaderProjectile.position.y + invaderProjectile.height >= player.position.y 
            && invaderProjectile.position.x + invaderProjectile.width >= player.position.x 
            && invaderProjectile.position.x <= player.position.x + player.width){
                console.log('lose')
            }
    })
    projectiles.forEach((projectile,index) => {
        if (projectile.position.y + projectile.radius <= 0){
            projectiles.splice(index,1)
            // projectiles.splice(index,1)
        }
        else{
            projectile.update()
        }  
    })

    grids.forEach((grid,gridIndex) => {
        grid.update()

        // spwan projectile
        if (frames % 100 === 0 && grid.invaders.length > 0){
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }

        grid.invaders.forEach((invader,i) => {
            invader.update({velocity: grid.velocity})
            projectiles.forEach((projectile,j) => {
                if(projectile.position.y - projectile.radius <= invader.position.y+invader.height && 
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y){
                    setTimeout(()=>{
                        const invaderFound = grid.invaders.find(invader2 => invader2 === invader)
                        const projectileFound = projectiles.find(projectile2 => projectile2 === projectile) 
                        
                        
                        if(invaderFound && projectileFound){
                        grid.invaders.splice(i,1)
                        projectiles.splice(j,1)
                        
                        if (grid.invaders.length > 0) {
                            const firstInvader = grid.invaders[0]
                            const lastInvader = grid.invaders[grid.invaders.length - 1]

                            grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                            grid.position.x = firstInvader.position.x
                        }
                        else{
                            grids.splice(gridIndex,1)
                        }
                    
                    }
                    },0)
                }
            })
        })
    })
    
    if(keys.a.pressed && player.position.x >= 0){
        player.velocity.x = -5
        player.rotation = -0.15
    }else if (keys.d.pressed && player.position.x + player.width<= canvas.width){
        player.velocity.x = 5
        player.rotation = 0.15
    }else{
        player.velocity.x = 0
        player.rotation = 0
    }

if (frames % randomInterval === 0){
    grids.push(new Grid())
    randomInterval = 500      
}
frames++
}
animate()

addEventListener('keydown' , ({ key }) => {
    switch(key){
        case 'a':
            // console.log('left')
            keys.a.pressed = true
            break
        case 'd':
            // console.log('down')
            keys.d.pressed = true
            break
        case ' ':
            // console.log(projectiles)
            
            projectiles.push(
                // left arm
                new Projectile({
                    position:{
                        x:player.position.x + player.width/2,
                        y:player.position.y 
                    },
                    velocity:{
                        x:0,
                        y:-10
                    }
                })
            )
            break
    }
})

addEventListener('keyup' , ({ key }) => {
    switch(key){
        case 'a':
            // console.log('left')
            keys.a.pressed = false
            break
        case 'd':
            // console.log('down')
            keys.d.pressed = false
            break
        case 'space':
            // console.log('space')
            break
    }
})