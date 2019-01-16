import React, { Component } from "react";

class App extends Component {
  state = {
    // 五角星
    pentagram: {
      A: {
        x: 100,
        y: 100
      },
      B: {
        x: 200,
        y: 30
      },
      C: {
        x: 300,
        y: 100
      },
      D: {
        x: 260,
        y: 220
      },
      E: {
        x: 140,
        y: 320
      }
    },
    targetPoint: null,
  };

  componentDidMount() {
    const c = this.refs.canvas;
    this.drawStar();
    c.addEventListener("mousemove", e => {
      this.handleMouseMove(e);
    });
    c.addEventListener("mousedown", e => {
      this.handleMouseDown(e);
    });
    c.addEventListener("mouseup", e => {
      this.handleMouseUp(e);
    });
  }

  handleMouseMove(e) {
    e.preventDefault();
    const { clientX, clientY, offsetX, offsetY } = e;

    const { pentagram, targetPoint } = this.state;

    if (targetPoint) {
      this.setState({
        pentagram: {
          ...pentagram,
          [targetPoint]: {
            x: offsetX,
            y: offsetY,
          }
        }
      });
    }
    this.drawStar();
  }

  handleMouseDown(e) {
    e.preventDefault();

    const { clientX, clientY, offsetX, offsetY } = e;
    const { pentagram } = this.state;

    // get the mouse position
    const x = offsetX;
    const y = offsetY;

    const targetPoints = Object.keys(pentagram);

    targetPoints.forEach(key => {
      const p = pentagram[key];
      if (Math.hypot(p.x - x, p.y - y) < 10) {
        this.setState({
          targetPoint: key,
        });
      }
    });
  }

  handleMouseUp(e) {
    this.setState({
      targetPoint: null,
    });
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext("2d");
    ctx.fillRect(0, 0, 100, 100);
  }

  clear() {
    const { canvas } = this.refs;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * 绘制五角星，圆
   */
  drawStar() {
    const {
      pentagram: { A, B, C, D, E }
    } = this.state;

    this.clear();

    // 绘制五角星的五条边
    this.drawLine(A, C);
    this.drawLine(C, E);
    this.drawLine(E, B);
    this.drawLine(B, D);
    this.drawLine(D, A);

    // 求出五角星的两临边的交点
    const F = this.getLineIntersec(A, C, B, E);
    const G = this.getLineIntersec(B, D, C, F);
    const H = this.getLineIntersec(C, E, B, D);
    const I = this.getLineIntersec(A, D, C, E);
    const J = this.getLineIntersec(A, D, B, E);

    // 求五角星五个角的外接圆
    const O1 = this.getCenterCoor(B, F, G);
    const O2 = this.getCenterCoor(C, G, H);
    const O3 = this.getCenterCoor(D, H, I);
    const O4 = this.getCenterCoor(E, I, J);
    const O5 = this.getCenterCoor(A, J, F);

    this.drawCircle(O1);
    this.drawCircle(O2);
    this.drawCircle(O3);
    this.drawCircle(O4);
    this.drawCircle(O5);

    const [p0] = this.calcIntersec(O1, O2);
    const [p1] = this.calcIntersec(O2, O3);
    const [p2] = this.calcIntersec(O3, O4);
    const [p3] = this.calcIntersec(O4, O5);
    const [p4] = this.calcIntersec(O5, O1);
    // [...points0, ...points1, ...points2, ...points3, ...points4].forEach(p => {
    //   this.drawPoint(p);
    // });
    this.drawPoint(p0);
    this.drawPoint(p1);
    this.drawPoint(p2);
    this.drawPoint(p3);
    this.drawPoint(p4);

    const O = this.getCenterCoor(p1, p2, p3);
    this.drawCircle(O, "red");

    this.drawPoint(A, "red");
    this.drawPoint(B, "red");
    this.drawPoint(C, "red");
    this.drawPoint(D, "red");
    this.drawPoint(E, "red");
  }

  /**
   * 画点
   * @param {Object} p
   */
  drawPoint(p, color = "Blue") {
    const ctx = this.refs.canvas.getContext("2d");
    const { x, y } = p;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x - 5, y - 5, 10, 10);
    ctx.stroke();
  }

  /**
   * 画直线
   * @param {*} start
   * @param {*} end
   */
  drawLine(start, end) {
    const ctx = this.refs.canvas.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
  getLineIntersec(A, B, C, D) {
    const { x: x1, y: y1 } = A;
    const { x: x2, y: y2 } = B;
    const { x: x3, y: y3 } = C;
    const { x: x4, y: y4 } = D;
    const a = y1 - y2;
    const b = x2 - x1;
    const e = a * x1 + b * y1;
    const c = y3 - y4;
    const d = x4 - x3;
    const f = c * x3 + d * y3;
    const x0 = (e * d - b * f) / (a * d - b * c);
    const y0 = (a * f - e * c) / (a * d - b * c);
    return {
      x: x0,
      y: y0
    };
  }
  getCenterCoor(A, B, C) {
    const { x: x1, y: y1 } = A;
    const { x: x2, y: y2 } = B;
    const { x: x3, y: y3 } = C;
    const a = x1 - x2;
    const b = y1 - y2;
    const c = x1 - x3;
    const d = y1 - y3;
    const e =
      (Math.pow(x1, 2) -
        Math.pow(x2, 2) -
        (Math.pow(y2, 2) - Math.pow(y1, 2))) /
      2;
    const f =
      (Math.pow(x1, 2) -
        Math.pow(x3, 2) -
        (Math.pow(y3, 2) - Math.pow(y1, 2))) /
      2;
    const x0 = 0 - (d * e - b * f) / (b * c - a * d);
    const y0 = 0 - (a * f - c * e) / (b * c - a * d);
    const r = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    return {
      x: x0,
      y: y0,
      r
    };
  }

  /**
   * 画圆
   * @param {*} o
   */
  drawCircle(o, color = "green") {
    const ctx = this.refs.canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, 2 * Math.PI);
    ctx.stroke();
  }

  /**
   * 求两圆交点
   * @param {Object} O1
   * @param {Object} O2
   */
  calcIntersec(O1, O2) {
    const { x: x1, y: y1, r: d1 } = O1;
    const { x: x2, y: y2, r: d2 } = O2;
    if (d1 < 0 || d2 < 0) return;
    const a = d2;
    const b = d1;
    const c = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    const d = (b * b + c * c - a * a) / (2 * c);
    const h = Math.sqrt(b * b - d * d);

    const x3 = (x2 - x1) * d / c + (y2 - y1) * h / c + x1;
    const y3 = (y2 - y1) * d / c - (x2 - x1) * h / c + y1;
    const x4 = (x2 - x1) * d / c - (y2 - y1) * h / c + x1;
    const y4 = (y2 - y1) * d / c + (x2 - x1) * h / c + y1;
    return [
      {
        x: x3,
        y: y3
      },
      {
        x: x4,
        y: y4
      }
    ];
  }

  render() {
    return <canvas ref="canvas" width={500} height={500} />;
  }
}

export default App;
