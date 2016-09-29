const TWO_PI = 2*Math.PI;

export default class CanvasCursor {
  constructor(canvas, color='#FFFFFF', size=20) {
    this.canvas = canvas;
    this.color = color;
    this.size = size;
    this.coors = [];

    this._addCanvasListener();
  }

  _addCanvasListener() {
    const mousemove = (event) => {
      const coors = this._getCoors(event);
      this._draw(...coors);
    };
    this.canvas.addEventListener('mousedown', (event) => {
      const [x, y] = this._getCoors(event);
      this.coors = [x-0.0001, y-0.0001]
      this._draw(x - 0.0001, y - 0.0001)
      this.canvas.addEventListener('mousemove', mousemove, false);
      window.addEventListener('mouseup', () => {
        this.canvas.removeEventListener('mousemove', mousemove, false);
      }, false);
    }, false);
  }

  _getCoors(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left + document.body.scrollLeft + document.documentElement.scrollLeft;
    const y = event.clientY - rect.top + document.body.scrollTop + document.documentElement.scrollTop;
    return [x, y];
  }

  _draw(x, y) {
    const context = this.canvas.getContext("2d");
    context.strokeStyle = this.color;
    context.lineWidth = this.size;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(...this.coors);
    context.lineTo(x, y);
    context.stroke();
    this.coors = [x, y];
  }
};
