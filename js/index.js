function toHex(n) {
  const hex = n.toString();
  return hex.length === 2 ? hex : `0{hex}`;
}

function hsvToHex(h, s, v) {
    let r, g, b;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return `#{toHex(255*r)}{toHex(255*g)}{toHex(255*b)}`;
};

class CanvasCursor {
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
      this.coors = [x - 0.0001, y - 0.0001]
      this._draw(x, y)
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
    console.log(context);
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

class ColorPicker {
  constructor(el, color) {
    this.el = el;
    this.slider = el.querySelector('.hue');
    this.sliderPicker = this.slider.querySelector('.slider-picker');
    this.pickerArea = el.querySelector('.picking-area');
    this.picker = this.pickerArea.querySelector('.picker');
    this.color = color;
    this._addListeners();
    // this._updateSliders();
  }

  _addListeners() {
    this._addPickerListener();
    this._addSliderListener();
  }

  _addSliderListener() {
    const mousemove = (event) => {
      const rect = this.slider.getBoundingClientRect();
      const y = Math.max(Math.min(event.clientY - rect.top - 3, 198), 0);
      this.sliderPicker.style.top = `${y}px`;
    };
    this.slider.addEventListener('mousedown', (event) => {
      const rect = this.slider.getBoundingClientRect();
      const y = event.clientY - rect.top - 3;
      this.sliderPicker.style.top = `${y}px`;
      this.slider.addEventListener('mousemove', mousemove, false);
      window.addEventListener('mouseup', () => {
        this.slider.removeEventListener('mousemove', mousemove, false);
      }, false);
    }, false);
  }

  _addPickerListener() {
    const mousemove = (event) => {
      const rect = this.pickerArea.getBoundingClientRect();
      const x = Math.max(Math.min(event.clientX - rect.left - 8, 194), -6);
      const y = Math.max(Math.min(event.clientY - rect.top - 6, 194), -6);
      this.picker.style.left = `${x}px`;
      this.picker.style.top = `${y}px`;
    };
    this.pickerArea.addEventListener('mousedown', (event) => {
      const rect = this.pickerArea.getBoundingClientRect();
      const x = Math.max(Math.min(event.clientX - rect.left - 8, 194), -6);
      const y = Math.max(Math.min(event.clientY - rect.top - 6, 194), -6);
      this.picker.style.left = `${x}px`;
      this.picker.style.top = `${y}px`;
      this.pickerArea.addEventListener('mousemove', mousemove, false);
      window.addEventListener('mouseup', () => {
        this.pickerArea.removeEventListener('mousemove', mousemove, false);
      }, false);
    }, false);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvasDiv = document.getElementById('canvas-div');
  const canvas = document.createElement('canvas');
  canvas.height = 300;
  canvas.width = 300;
  canvasDiv.appendChild(canvas);
  const color = '#000000';
  new CanvasCursor(canvas, color, 20);

  const pickerEl = document.getElementById('color-picker');
  new ColorPicker(pickerEl, '#000000');
});
