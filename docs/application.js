// NOTE: 左ボール中心座標(75, 250)
// NOTE: 右ボール中心座標(245, 250)

window.addEventListener('load', () => {
  let field = document.getElementById('js-field');
  new Ball('right', field, '#fff');
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

    ball.classList.add('p-ball');
    ball.style.top = `${this.y}px`;
    ball.style.left = `${this.x}px`;
    ball.style.backgroundColor = color;

    to.appendChild(ball)

    this.target = ball;
  }
}
