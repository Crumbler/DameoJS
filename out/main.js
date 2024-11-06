// src/scripts/helpers/blobHelper.ts
var BlobHelper = class {
  static generateBackgroundBlob(bounds, drawAction) {
    const canvas = document.createElement("canvas");
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    const context = canvas.getContext("2d", {
      alpha: false
    });
    if (context === null) {
      throw new Error("Failed to get 2d context");
    }
    drawAction(context);
    const promise = new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        canvas.remove();
        if (blob === null) {
          reject("Failed to create blob");
          return;
        }
        resolve(blob);
      });
    });
    return promise;
  }
  static async drawToBlobUrl(size, drawAction) {
    const imageBlob = await this.generateBackgroundBlob(size, drawAction);
    return URL.createObjectURL(imageBlob);
  }
};

// src/scripts/math/Vector2.ts
var Vector2 = class _Vector2 extends Array {
  constructor(x = 0, y = 0) {
    super();
    this[0] = x;
    this[1] = y;
  }
  static fromScalar(x) {
    return new _Vector2(x, x);
  }
  get x() {
    return this[0];
  }
  set x(value) {
    this[0] = value;
  }
  get y() {
    return this[1];
  }
  set y(value) {
    this[1] = value;
  }
  get width() {
    return this.x;
  }
  set width(value) {
    this.x = value;
  }
  get height() {
    return this.y;
  }
  set height(value) {
    this.y = value;
  }
  clone() {
    return this.slice();
  }
  mul(x) {
    this.x *= x;
    this.y *= x;
    return this;
  }
  div(x) {
    this.x /= x;
    this.y /= x;
    return this;
  }
};

// src/scripts/interface/interfaceColors.ts
var InterfaceColors = class {
};
InterfaceColors.BackgroundColor = "#362918";
InterfaceColors.RhombusColorA = "#ab9349";
InterfaceColors.RhombusColorB = "#ca9334";

// src/scripts/interface/pageIcon.ts
var _PageIcon = class _PageIcon {
  static calculateBounds() {
    return Vector2.fromScalar(_PageIcon.RhombusSize * 2);
  }
  static drawRhombus(context, size, color) {
    context.beginPath();
    context.fillStyle = color;
    context.moveTo(size / 2, 0);
    context.lineTo(0, size / 2);
    context.lineTo(size / 2, size);
    context.lineTo(size, size / 2);
    context.closePath();
    context.fill();
  }
  static drawPattern(context) {
    const size = context.canvas.width;
    context.fillStyle = InterfaceColors.BackgroundColor;
    context.fillRect(0, 0, size, size);
    const rhombusSize = size / 2;
    _PageIcon.drawRhombus(context, rhombusSize, InterfaceColors.RhombusColorA);
    context.save();
    context.translate(rhombusSize, 0);
    _PageIcon.drawRhombus(context, rhombusSize, InterfaceColors.RhombusColorB);
    context.restore();
    context.save();
    context.translate(rhombusSize, rhombusSize);
    _PageIcon.drawRhombus(context, rhombusSize, InterfaceColors.RhombusColorA);
    context.restore();
    context.save();
    context.translate(0, rhombusSize);
    _PageIcon.drawRhombus(context, rhombusSize, InterfaceColors.RhombusColorB);
    context.restore();
  }
  static async generateAndSet() {
    const bounds = _PageIcon.calculateBounds();
    const imageUrl = await BlobHelper.drawToBlobUrl(
      bounds,
      _PageIcon.drawPattern
    );
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = imageUrl;
    document.head.appendChild(link);
  }
};
_PageIcon.RhombusSize = 16;
var PageIcon = _PageIcon;

// src/scripts/interface/pageBackground.ts
var _PageBackground = class _PageBackground {
  static calculateBounds() {
    const baseWidth = _PageBackground.RhombusWidth * 2;
    const height = Math.round(Math.tan(Math.PI / 3) * baseWidth);
    return new Vector2(baseWidth, height).mul(2);
  }
  static drawRhombus(context, size, color) {
    context.beginPath();
    context.fillStyle = color;
    context.moveTo(size.width / 2, 0);
    context.lineTo(0, size.height / 2);
    context.lineTo(size.width / 2, size.height);
    context.lineTo(size.width, size.height / 2);
    context.closePath();
    context.fill();
  }
  static drawPattern(context) {
    const width = context.canvas.width;
    const height = context.canvas.height;
    context.fillStyle = InterfaceColors.BackgroundColor;
    context.fillRect(0, 0, width, height);
    const rhombusSize = new Vector2(width, height).div(2);
    _PageBackground.drawRhombus(
      context,
      rhombusSize,
      InterfaceColors.RhombusColorA
    );
    context.save();
    context.translate(width / 2, 0);
    _PageBackground.drawRhombus(
      context,
      rhombusSize,
      InterfaceColors.RhombusColorB
    );
    context.restore();
    context.save();
    context.translate(width / 2, height / 2);
    _PageBackground.drawRhombus(
      context,
      rhombusSize,
      InterfaceColors.RhombusColorA
    );
    context.restore();
    context.save();
    context.translate(0, height / 2);
    _PageBackground.drawRhombus(
      context,
      rhombusSize,
      InterfaceColors.RhombusColorB
    );
    context.restore();
  }
  static async generateAndSet() {
    const bounds = _PageBackground.calculateBounds();
    const imageUrl = await BlobHelper.drawToBlobUrl(
      bounds,
      _PageBackground.drawPattern
    );
    document.body.style.backgroundImage = `url(${imageUrl})`;
  }
};
_PageBackground.RhombusWidth = 50;
var PageBackground = _PageBackground;

// src/scripts/main.ts
function onLoad() {
  PageBackground.generateAndSet();
  PageIcon.generateAndSet();
}
onLoad();
//# sourceMappingURL=main.js.map