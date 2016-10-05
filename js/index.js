function toHex(n) {
  const hex = parseInt(n).toString(16);
  return hex.length === 2 ? hex : `0${hex}`;
}

function hueToRgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}

function hslToHex(h, s, l){
    let r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hueToRgb(p, q, h + 1/3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1/3);
    }

    return `#${toHex(255*r)}${toHex(255*g)}${toHex(255*b)}`;
}

class CanvasCursor {
  constructor(canvas, display, color='#FFFFFF', size=20) {
    this.canvas = canvas;
    this.display = display;
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
    const x = event.clientX - rect.left + document.documentElement.scrollLeft;
    const y = event.clientY - rect.top + document.documentElement.scrollTop;
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

  updateDisplay() {
    this.display.style.backgroundColor = this.color;
    this.display.style.height = `${this.size}px`;
    this.display.style.width = `${this.size}px`;
  }
};

class ColorPicker {
  constructor(areaEl, sliderEl, cursor) {
    this.pickerX = 100;
    this.pickerY = 100;
    this.sliderY = 100;
    this.cursor = cursor;
    this.slider = sliderEl;
    this.sliderPicker = this.slider.querySelector('#hue-slider');
    this.pickerArea = areaEl;
    this.picker = this.pickerArea.querySelector('#color-area-picker');
    this._addListeners();
    this._updateSlidersAndColor();
  }

  _updateSlidersAndColor() {
    this.sliderPicker.style.top = `${this.sliderY}px`;

    this.picker.style.left = `${this.pickerX}px`;
    this.picker.style.top = `${this.pickerY}px`;

    this.pickerArea.style.backgroundColor = hslToHex(this.sliderY/198, 1, 0.5);

    this.cursor.color = hslToHex(this.sliderY/198, (this.pickerX + 6)/200, 1 - (this.pickerY + 6)/200);
    this.cursor.updateDisplay();
  }

  _addListeners() {
    this._addPickerListener();
    this._addSliderListener();
  }

  _addSliderListener() {
    const mousemove = (event) => {
      const rect = this.slider.getBoundingClientRect();
      this.sliderY = Math.max(Math.min(event.clientY - rect.top - 3, 198), 0);
      this._updateSlidersAndColor();
    };
    this.slider.addEventListener('mousedown', (event) => {
      const rect = this.slider.getBoundingClientRect();
      this.sliderY = Math.max(Math.min(event.clientY - rect.top - 3, 198), 0);
      this._updateSlidersAndColor();
      this.slider.addEventListener('mousemove', mousemove, false);
      window.addEventListener('mouseup', () => {
        this.slider.removeEventListener('mousemove', mousemove, false);
      }, false);
    }, false);
  }

  _addPickerListener() {
    const mousemove = (event) => {
      const rect = this.pickerArea.getBoundingClientRect();
      this.pickerX = Math.max(Math.min(event.clientX - rect.left - 8, 194), -6);
      this.pickerY = Math.max(Math.min(event.clientY - rect.top - 6, 194), -6);
      this._updateSlidersAndColor();
    };
    this.pickerArea.addEventListener('mousedown', (event) => {
      const rect = this.pickerArea.getBoundingClientRect();
      this.pickerX = Math.max(Math.min(event.clientX - rect.left - 8, 194), -6);
      this.pickerY = Math.max(Math.min(event.clientY - rect.top - 6, 194), -6);
      this._updateSlidersAndColor();
      this.pickerArea.addEventListener('mousemove', mousemove, false);
      window.addEventListener('mouseup', () => {
        this.pickerArea.removeEventListener('mousemove', mousemove, false);
      }, false);
    }, false);
  }
}

class SizePicker {
  constructor(el, cursor) {
    this.el = el;
    this.cursor = cursor;
    this.el.value = this.cursor.size;
    this._addInputListener();
  }

  _addInputListener() {
    this.el.addEventListener('input', () => {
      this.cursor.size = this.el.value;
      this.cursor.updateDisplay();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvasDiv = document.getElementById('canvas-div');
  const canvas = document.createElement('canvas');
  canvas.height = 500;
  canvas.width = 1000;
  canvasDiv.appendChild(canvas);
  const color = '#000000';
  const displayDiv = document.querySelector('#cursor-display > div');
  const cursor = new CanvasCursor(canvas, displayDiv, color, 20);

  const areaEl = document.getElementById('color-area');
  const sliderEl = document.getElementById('hue-picker');
  new ColorPicker(areaEl, sliderEl, cursor);
  const sizeSlider = document.querySelector('#size-picker input');
  new SizePicker(sizeSlider, cursor);
});
