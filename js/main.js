const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('pista', 'assets/pista.png');
    this.load.spritesheet('galinha', 'assets/galinha.png', { frameWidth: 12, frameHeight: 8 });
}

function create() {
    // Adiciona a imagem de fundo da pista e ajusta a escala
    let pista = this.add.image(400, 300, 'pista');
    pista.setDisplaySize(800, 600); // Ajusta o tamanho da pista para preencher a tela

    // Adiciona o jogador 1
    this.player1 = this.physics.add.sprite(205, 587, 'galinha', 1);
    this.player1.setCollideWorldBounds(true);
    this.player1.scale = 3; // Ajuste a escala conforme necessário


    // Adiciona o jogador 2
    this.player2 = this.physics.add.sprite(542, 587, 'galinha', 1);
    this.player2.setCollideWorldBounds(true);
    this.player2.scale = 3; // Ajuste a escala conforme necessário

    // Controle do jogador
    this.cursors = this.input.keyboard.createCursorKeys();

    // Adiciona carros
    this.cars = this.physics.add.group({
        key: 'galinha',
        repeat: 5,
        setXY: { x: 100, y: 100, stepX: 100 },
    });

    this.cars.children.iterate(function (car) {
        car.setVelocityX(Phaser.Math.Between(100, 300));
        car.setBounce(1);
        car.setCollideWorldBounds(true);
    });

    // Colisão entre jogador e carros
    this.physics.add.collider(this.player1, this.cars, hitCar, null, this);
    this.physics.add.collider(this.player2, this.cars, hitCar, null, this);
}

function update() {
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
    // Exemplo básico:
    // if (wasd.left.isDown) { ... }
}

function hitCar(player, car) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    this.gameOver = true;
}
