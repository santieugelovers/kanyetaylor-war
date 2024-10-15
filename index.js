const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
console.log(canvas)

const scoreEl = document.querySelector('#scoreEl')
const loseText = document.getElementById('lose')
const winText = document.getElementById('win')

//ANIMACION AL INICIAR




//ANIMACION PERDER

function loseAnimation () {
  loseText.style.display = 'flex'
  gameMusic.pause()
  loseAudio.play()
  loseAudio.volume = 0.5;
  cancelAnimationFrame(animationId)
}

//AUDIOS
function playWaka () {
  const waka = new Audio ('https://github.com/santieugelovers/kanyetaylor-war/blob/main/sounds/waka.mp3?raw=true');
  waka.volume = 0.2;
  waka.play();
}

const loseAudio = new Audio('https://github.com/santieugelovers/kanyetaylor-war/blob/main/sounds/lose-sound.mp3?raw=true')

const powerAudio = new Audio('https://github.com/santieugelovers/kanyetaylor-war/blob/main/sounds/powerup.wav?raw=true')



//AUDIOS

//EMPEZAR PLAYLIST Y JUEGO

const playlist = [
  'https://github.com/santieugelovers/kanyetaylor-war/blob/main/music/blank-space.mp3?raw=true',
  'https://github.com/santieugelovers/kanyetaylor-war/blob/main/music/love-story.mp3?raw=true',
  'https://github.com/santieugelovers/kanyetaylor-war/blob/main/music/paper-rings.mp3?raw=true',
  'https://github.com/santieugelovers/kanyetaylor-war/blob/main/music/shake-it-off.mp3?raw=true',
  'https://github.com/santieugelovers/kanyetaylor-war/blob/main/music/the-man.mp3?raw=true',
  'https://github.com/santieugelovers/kanyetaylor-war/blob/main/music/you-belong-with-me.mp3?raw=true'
];

// Función para obtener un índice aleatorio
function getRandomIndex() {
  return Math.floor(Math.random() * playlist.length);
}

let currentSongIndex = getRandomIndex(); // Inicializamos con una canción aleatoria
const gameMusic = new Audio();

// Iniciar la playlist después de que se presione una flecha direccional
function startPlaylistAndGame() {
  gameMusic.src = playlist[currentSongIndex];
  gameMusic.play();
  gameMusic.volume = 0.8;
}

// Definimos el listener de teclado
const keydownHandler = (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      startPlaylistAndGame();
      // Eliminamos el listener para que no se ejecute nuevamente
      document.body.removeEventListener('keydown', keydownHandler);
  }
};

// Escuchar eventos de teclado
document.body.addEventListener('keydown', keydownHandler);

// Cuando termina una canción, reproduce una canción aleatoria
gameMusic.addEventListener('ended', () => {
  let nextSongIndex;

  do {
      nextSongIndex = getRandomIndex();
  } while (nextSongIndex === currentSongIndex); // Evitar repetir la misma canción inmediatamente

  currentSongIndex = nextSongIndex;
  gameMusic.src = playlist[currentSongIndex];
  gameMusic.play();
});

// Reproduce automáticamente en bucle
gameMusic.loop = false;
//PLAYLIST

canvas.width = innerWidth
canvas.height = innerHeight


class Boundary {
    static width = 60
    static height = 60
    constructor({position, image}) {
        this.position = position
        this.width = 60
        this.height = 60
        this.image = image
    }

    draw() {

        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player{
    constructor({ position, velocity, imageSrc, powerImageSrc}) {
        this.position = position
        this.velocity = velocity
        this.radius = 28
        this.powerState = false

        this.image = new Image()
        this.image.src = imageSrc
        this.originalImageSrc = imageSrc
        this.powerImageSrc = powerImageSrc
  
        this.image.onload = () => {
            this.width = this.image.width
            this.height = this.image.height
        }
    
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'transparent'
        c.fill()
        c.closePath()
        c.drawImage(
            this.image,
            this.position.x - this.width / 2, 
            this.position.y - this.height / 2, 
            this.width,
            this.height
        )
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.powerState) {
          this.image.src = this.powerImageSrc
        } else {
          this.image.src = this.originalImageSrc
        }
      
        c.drawImage(
            this.image,
            this.position.x - this.width / 2, 
            this.position.y - this.height / 2, 
            this.width,
            this.height
        )
    }
}

class Ghost{
  static speed = 2
  constructor({ position, velocity, imageSrc, scaredImageSrc}) {
      this.position = position
      this.velocity = velocity
      this.radius = 28
      this.prevCollisions = []
      this.speed = 2.5
      this.scared = false
      
      this.image = new Image()
      this.image.src = imageSrc
      this.originalImageSrc = imageSrc
      this.scaredImageSrc = scaredImageSrc

      this.image.onload = () => {
      this.width = this.image.width
      this.height = this.image.height

      this.recentDirections = [];

      }

      

  }

  draw() {
      c.beginPath()
      c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
      c.fillStyle = 'transparent'
      c.fill()
      c.closePath()

      if (this.scared) {
        this.image.src = this.scaredImageSrc
      } else {
        this.image.src = this.originalImageSrc
      }
    
      c.drawImage(
          this.image,
          this.position.x - this.width / 2, 
          this.position.y - this.height / 2, 
          this.width,
          this.height
      )
  }

  update() {
    this.draw()
    
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}



class Pellet{
    constructor({ position}) {
        this.position = position
        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }
}

class PowerUp{
  constructor({ position, imageSrc}) {
      this.position = position
      this.radius = 10
      this.image = new Image()
      this.image.src = imageSrc
      this.image.onload = () => {
          this.width = this.image.width
          this.height = this.image.height
      }
  }

  draw() {
    if (this.image.complete) {
      c.drawImage(
        this.image,
        this.position.x - this.width / 2,
        this.position.y - this.height / 2,
        this.width,
        this.height
      )
    }
  }
}

const powerUps = []

const pellets = []

const boundaries = []

const ghosts = [
  new Ghost ({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height /2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    },
    imageSrc: 'https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/personajes/kanye.png?raw=true',
    scaredImageSrc: 'https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/personajes/kanye_scared.png?raw=true'
  }),
  new Ghost ({
    position: {
      x: Boundary.width * 4 + Boundary.width / 2,
      y: Boundary.height * 8 + Boundary.height /2
    },
    velocity: {
      x: 0,
      y: Ghost.speed
    },
    imageSrc: 'https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/personajes/kanye.png?raw=true',
    scaredImageSrc: 'https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/personajes/kanye_scared.png?raw=true'
  }),
  new Ghost ({
    position: {
      x: Boundary.width * 19 + Boundary.width / 2,
      y: Boundary.height * 5 + Boundary.height /2
    },
    velocity: {
      x: 0,
      y: -Ghost.speed
    },
    imageSrc: 'https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/personajes/kanye.png?raw=true',
    scaredImageSrc: 'https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/personajes/kanye_scared.png?raw=true'
  }),
  new Ghost ({
    position: {
      x: Boundary.width * 14 + Boundary.width / 2,
      y: Boundary.height * 9 + Boundary.height /2
    },
    velocity: {
      x: 0,
      y: -Ghost.speed
    },
    imageSrc: 'https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/personajes/kanye.png?raw=true',
    scaredImageSrc: 'https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/personajes/kanye_scared.png?raw=true'
  }),
]

const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height /2
    },
    velocity: {
        x:0,
        y:0
    },
    imageSrc: 'https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/personajes/taylor.png?raw=true',
    powerImageSrc: 'https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/personajes/taylor_power.png?raw=true'
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '^', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '_', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '.', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', 'b', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '.', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', 'b', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '.', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '^', '.', '.', '.', 'p', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '_', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ]

let lastKey = ''

let score = 0

function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      switch (symbol) {
        case '-':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/pipeHorizontal.png?raw=true')
            })
          )
          break
        case '|':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/pipeVertical.png?raw=true')
            })
          )
          break
        case '1':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/pipeCorner1.png?raw=true')
            })
          )
          break
        case '2':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/pipeCorner2.png?raw=true')
            })
          )
          break
        case '3':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/pipeCorner3.png?raw=true')
            })
          )
          break
        case '4':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/pipeCorner4.png?raw=true')
            })
          )
          break
        case 'b':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/block.png?raw=true')
            })
          )
          break
        case '[':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/capLeft.png?raw=true')
            })
          )
          break
        case ']':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/capRight.png?raw=true')
            })
          )
          break
        case '_':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/capBottom.png?raw=true')
            })
          )
          break
        case '^':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/capTop.png?raw=true')
            })
          )
          break
        case '+':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/pipeCross.png?raw=true')
            })
          )
          break
        case '5':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/pipeConnectorTop.png?raw=true')
            })
          )
          break
        case '6':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/pipeConnectorRight.png?raw=true')
            })
          )
          break
        case '7':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/pipeConnectorBottom.png?raw=true')
            })
          )
          break
        case '8':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/boundaries/pipeConnectorLeft.png?raw=true')
            })
          )
          break
        case '.':
          pellets.push(
            new Pellet({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2
              }
            })
          )
          break
        case 'p':
          powerUps.push(
            new PowerUp({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2
              },
              imageSrc:'https://github.com/santieugelovers/kanyetaylor-war/blob/main/img/personajes/powerup.png?raw=true'
            })
          )
          break
      } 
    })
  })

function circleCollisedWithRectangle({ circle, rectangle }) {
    const padding = Boundary.width /2 - circle.radius - 2
    return(
        circle.position.y - circle.radius + circle.velocity.y <= 
            rectangle.position.y + rectangle.height + padding && 
        circle.position.x + circle.radius + circle.velocity.x - padding >= rectangle.position.
            x &&
        circle.position.y + circle.radius + circle.velocity.y - padding >= rectangle.position.
            y && 
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.
            x + rectangle.width + padding)
}

let animationId

function animate() {
    animationId = requestAnimationFrame(animate)
    //console.log(animationId)
    c.clearRect(0, 0, canvas.width, canvas.height)
    
    if (keys.w.pressed && lastKey === 'ArrowUp') {
        for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
            if 
                (circleCollisedWithRectangle({
                        circle: {...player, velocity: {
                            x:0,
                            y:-3
                        }},
                        rectangle: boundary
                    })
                ) {
                    player.velocity.y = 0
                    break
                } else {
                    player.velocity.y = -3
                }
        }

    }else if (keys.a.pressed && lastKey === 'ArrowLeft') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
                if 
                    (circleCollisedWithRectangle({
                            circle: {...player, velocity: {
                                x:-3,
                                y:0
                            }},
                            rectangle: boundary
                        })
                    ) {
                        player.velocity.x = 0
                        break
                    } else {
                        player.velocity.x = -3
                    }
            }

    }else if (keys.s.pressed && lastKey === 'ArrowDown') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
                if 
                    (circleCollisedWithRectangle({
                            circle: {...player, velocity: {
                                x:0,
                                y:3
                            }},
                            rectangle: boundary
                        })
                    ) {
                        player.velocity.y = 0
                        break
                    } else {
                        player.velocity.y = 3
                    }
            }

    }else if (keys.d.pressed && lastKey === 'ArrowRight') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
                if 
                    (circleCollisedWithRectangle({
                            circle: {...player, velocity: {
                                x:3,
                                y:0
                            }},
                            rectangle: boundary
                        })
                    ) {
                        player.velocity.x = 0
                        break
                    } else {
                        player.velocity.x = 3
                    }
            }

    }

    
    //colision entre fantasma y jugador
    for (let i = ghosts.length - 1; 0 <= i; i--) {
       const ghost = ghosts[i]
    //fantasma toca al jugador
      if (
        Math.hypot(
          ghost.position.x - player.position.x, 
          ghost.position.y - player.position.y
          ) < 
          ghost.radius + player.radius 
          ) {
            if (ghost.scared) {
              ghosts.splice(i, 1)
              score += 200
            } else {

              loseAnimation()
            //reset despues de perder

            document.addEventListener('keydown', function(event) {
              if (event.key === ' ') {
                  location.reload();
              }
            });
            //console.log('perdiste')
            }
          }
      }

    //GANAR GANAR 

    if (pellets.length === 0) {
      winText.style.display = 'flex'
      cancelAnimationFrame(animationId)
    }

    //powerups

    for (let i = powerUps.length - 1; 0 <= i; i--) {
      const powerUp = powerUps [i]
      powerUp.draw()

    if (
        Math.hypot(
            powerUp.position.x - player.position.x, 
            powerUp.position.y - player.position.y
        ) < 
        powerUp.radius + player.radius
        ) {
          powerUps.splice(i, 1)

        //kanyes asustados
        ghosts.forEach((ghost) => {
          
            ghost.scared = true
            player.powerState = true
            powerAudio.play()
                
            setTimeout(() => {
              ghost.scared = false
              player.powerState = false
            }, 8000)
          })
      }
      
    }

    //bolitas

    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i]

        pellet.draw()

        if (
            Math.hypot(
                pellet.position.x - player.position.x, 
                pellet.position.y - player.position.y
            ) < 
            pellet.radius + player.radius
            ) {
                playWaka();
                pellets.splice(i, 1)
                score += 10
                scoreEl.innerHTML = score
            }
    }
    
  
  
    boundaries.forEach((boundary) => {
        boundary.draw()

        if (
            circleCollisedWithRectangle({
                circle: player,
                rectangle: boundary
            })
        ) {
            //console.log('estoy chocanndo')
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })

    player.update()

    ghosts.forEach(ghost => {
      ghost.update()
    


      const collisions = []
    
      boundaries.forEach(boundary => {
        if (
          circleCollisedWithRectangle({
            circle: {...ghost, velocity: { x: ghost.speed, y: 0 }},
            rectangle: boundary
          })
        ) {
          collisions.push('right')
        }
    
        if (
          circleCollisedWithRectangle({
            circle: {...ghost, velocity: { x: -ghost.speed, y: 0 }},
            rectangle: boundary
          })
        ) {
          collisions.push('left')
        }
    
        if (
          circleCollisedWithRectangle({
            circle: {...ghost, velocity: { x: 0, y: -ghost.speed }},
            rectangle: boundary
          })
        ) {
          collisions.push('up')
        }
    
        if (
          circleCollisedWithRectangle({
            circle: {...ghost, velocity: { x: 0, y: ghost.speed }},
            rectangle: boundary
          })
        ) {
          collisions.push('down')
        }
      })
    
      if (collisions.length > ghost.prevCollisions.length) {
        ghost.prevCollisions = collisions
      }
    
      if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
    
        if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
        else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
        else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
        else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

        //console.log(collisions)
        //console.log(ghost.prevCollisions)


        const pathways = ghost.prevCollisions.filter(collision => {
            return !collisions.includes(collision)
          })
          //console.log({ pathways })

          const direction = pathways [Math.floor(Math.random() * pathways.length)]

          //console.log({direction})
    
        switch (direction) {
          case 'down':
            ghost.velocity.y = ghost.speed
            ghost.velocity.x = 0
            break
    
          case 'up':
            ghost.velocity.y = -ghost.speed
            ghost.velocity.x = 0
            break
    
          case 'right':
            ghost.velocity.y = 0
            ghost.velocity.x = ghost.speed
            break
    
          case 'left':
            ghost.velocity.y = 0
            ghost.velocity.x = -ghost.speed
            break
        }
    
        ghost.prevCollisions = []
      }
    })

    
}

animate()

window.addEventListener('keydown', ({key}) => {
    
    switch(key) {
        case 'ArrowUp':
            keys.w.pressed = true
            lastKey = 'ArrowUp'
            event.preventDefault()
            break
        case 'ArrowLeft':
            keys.a.pressed = true
            lastKey = 'ArrowLeft'
            event.preventDefault()
            break
        case 'ArrowDown':
            keys.s.pressed = true
            lastKey = 'ArrowDown'
            event.preventDefault()
            break
        case 'ArrowRight':
            keys.d.pressed = true
            lastKey = 'ArrowRight'
            event.preventDefault()
            break
    }

    //console.log(player.velocity)
})

window.addEventListener('keyup', ({key}) => {
    
    switch(key) {
        case 'ArrowUp':
            keys.w.pressed = false
            break
        case 'ArrowLeft':
            keys.a.pressed = false
            break
        case 'ArrowDown':
            keys.s.pressed = false
            break
        case 'ArrowRight':
            keys.d.pressed = false
            break
    }

    //console.log(player.velocity)
})


// i love u 4 ever
