// NOTE: 左ボール中心座標(75, 250)
// NOTE: 右ボール中心座標(245, 250)

const timeStep = 25;
const frameRate = 10;

window.addEventListener('load', () => {
  const field = document.getElementById('js-field');
  const ballManager = new BallManager();
  const siteswapPattern = [5, 3, 1];
  let frameCounter = 0, hand = 0, patternIndex = 0;

  setInterval(() => {
    if(frameCounter % frameRate === 0) {
      const thrownPattern = siteswapPattern[patternIndex];

      if(thrownPattern !== 0) {
        const ball = ballManager.next((hand % 2 === 0) ? 'right' : 'left', field);

        ball.thrown((hand % 2 === 0) ? 'left' : 'right', thrownPattern);
        ballManager.set(ball, 10 * thrownPattern);
      }

      hand = 1 - hand;
      patternIndex = (patternIndex + 1) % siteswapPattern.length;
    }

    ballManager.update();
    ++frameCounter;
  }, timeStep);
});

class Ball {
  constructor(pos, to, color) {
    const ball = document.createElement('div');

    this.y = 250;

    if(pos === 'right') {
      this.x = 75;
    } else if(pos === 'left') {
      this.x = 245;
    } else {
      // TODO: エラーハンドリング
    }

    this.hold = false;

    this.vx = 0;
    this.vy = 0;

    ball.classList.add('p-ball');
    ball.style.top = `${this.y}px`;
    ball.style.left = `${this.x}px`;
    ball.style.backgroundColor = color;

    to.appendChild(ball);

    this.target = ball;
  }

  setVelocity(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  }

  thrown(dir, n) {
    let baseX = 0;

    if(dir === 'right') {
      baseX = -17;
    } else if(dir === 'left') {
      baseX = 17;
    } else {
      // TODO: エラーハンドリング
    }

    this.hold = false;

    if(n === 1) {
      this.setVelocity(baseX, 4.5);
    } else if(n === 2) {
      this.hold = true;
      this.setVelocity(0, 0);
    } else if(n % 2 === 0) {
      this.setVelocity(0, 5 * n - 0.5);
    } else {
      this.setVelocity(baseX / n, 5 * n - 0.5);
    }
  }

  update() {
    const g = 1;

    if(this.hold) {
      return;
    }

    this.x += this.vx;
    this.y -= this.vy;

    this.vy -= g;

    this.updatePosition(this.x, this.y);
  }

  updatePosition(x, y) {
    this.target.style.top = `${y}px`;
    this.target.style.left = `${x}px`;
  }
}

class BallManager {
  constructor() {
    this.queue = [];
    this.colorIndex = 0;
  }

  next(pos, to, color) {
    const queueTop = this.queue[0];
    const colors = ['#4286f4', '#ffb7b2', '#fdffb7', '#d1ffb2', '#ffffff'];

    if(queueTop != null && queueTop.count === 0) {
      return this.queue.shift().ball;
    } else {
      const ball = new Ball(pos, to, colors[this.colorIndex]);

      this.colorIndex = (this.colorIndex + 1) % colors.length;

      return ball;
    }
  }

  update() {
    this.queue.forEach(x => {
      --x.count;
      x.ball.update();
    });

    this.queue = this.queue.sort((p, q) => p.count - q.count);
  }

  set(ball, count) {
    this.queue.push({ball, count});

    this.queue = this.queue.sort((p, q) => p.count - q.count);
  }
}
