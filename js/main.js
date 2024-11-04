const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    audio: {
        disableWebAudio: true,
        noAudio: false,
        AudioContext: false
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let fps = 0;
let lastTime = 0;

function preload() {
    this.load.image('pista', 'assets/pista.png');
    this.load.spritesheet('galinha', 'assets/galinha.png', { frameWidth: 12, frameHeight: 8 });
    this.load.spritesheet('carro', 'assets/car.png', { frameWidth: 16, frameHeight: 10 });
}

function create() {
    this.time = this.game.time;

    // Adiciona a imagem de fundo da pista e ajusta a escala
    let pista = this.add.image(400, 300, 'pista');
    pista.setDisplaySize(800, 600); // Ajusta o tamanho da pista para preencher a tela

    // Adiciona o jogador 1
    this.player1 = this.physics.add.sprite(205, 587, 'galinha');
    this.player1.setCollideWorldBounds(true);
    this.player1.scale = 3; // Ajuste a escala conforme necessário


    // Adiciona o jogador 2
    this.player2 = this.physics.add.sprite(542, 587, 'galinha');
    this.player2.setCollideWorldBounds(true);
    this.player2.scale = 3; // Ajuste a escala conforme necessário

    // Controle do jogador
    this.cursors = this.input.keyboard.createCursorKeys();

    // Controle do jogador 2 (WASD)
    this.keys = this.input.keyboard.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Cria uma array com 10 cores para cada carro
    this.colors = [
        0x9c2020, 0xb4e490, 0x646410, 0xe08888, 0x1c209c,
        0x985c28, 0x6874d0, 0xb03c3c, 0x84b468, 0xd0d050
    ]

    // Adiciona carros
    this.cars = this.physics.add.group({
        key: 'carro',
        repeat: 9,
        setXY: { x: 100, y: 90, stepX: 150, stepY: 50 },
    });

    // Ajusta a velocidade e a sensibilidade dos carros
    this.cars.children.iterate(function (car, index) {
        car.setVelocityX(Phaser.Math.Between(100, 300)); // Ajuste a velocidade aleatória dos carros
        car.setBounce(1); // Ajuste a sensibilidade dos carros
        car.scale = 2.3;
        car.setCollideWorldBounds(true);
        car.setTint(this.colors[index]); // Atribui uma cor única para cada carro
    }, this);

    // Colisão entre jogador e carros
    this.physics.add.collider(this.player1, this.cars, hitCar, null, this);
    this.physics.add.collider(this.player2, this.cars, hitCar, null, this);
}

function update(time) {
    if (!this.cursors) {
        return;
    }
    
    fps = 1000 / (time - lastTime);
    lastTime = time;
    // console.log(`FPS: ${fps}`);

    if (fps < 30 || fps > 60) {
        return;
    }
    
    // Controle do jogador 1
    if (this.cursors.left.isDown) {
        this.player1.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
        this.player1.setVelocityX(160);
    } else {
        this.player1.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
        this.player1.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
        this.player1.setVelocityY(160);
    } else {
        this.player1.setVelocityY(0);
    }

    // Controle do jogador 2 (adicionar teclas separadas, por exemplo, WASD)

    if (this.keys.w.isDown) {
        this.player2.setVelocityY(-160);
    } else if (this.keys.s.isDown) {
        this.player2.setVelocityY(160);
    } else {
        this.player2.setVelocityY(0);
    }

    if (this.keys.a.isDown) {
        this.player2.setVelocityX(-160);
    } else if (this.keys.d.isDown) {
        this.player2.setVelocityX(160);
    } else {
        this.player2.setVelocityX(0);
    }
}

function hitCar(player, car) {
    this.physics.pause();
    player.setTint(0xff0000);
    this.gameOver = true;
}

// Para chamar a função update, você pode usar a seguinte lógica
function loop(time) {
    update(time);
    requestAnimationFrame(loop);
}

// Inicie o loop
loop();
