$(document).ready(function() {
  var app = new App();
});

/*
  TBC : The App object will be responsible for managing the application.
*/
function App() {
  var self = this;

  self.elements = { };
  self.images = [];
  self.imageCursorIndex = 0;
  self.imageDataWrapper = { };

  var imgNames = [
    'balls.jpg',
    'woods.jpg',
    'flag.jpg',
    'autumn.jpg',
    'berries.jpg'
  ];
  var context = { };
  var canvas = { };

  self.initialize = function() {
    self.elements.canvas = $('#canvas');
    self.elements.btnGreyscale = $('#btn-greyscale');
    self.elements.btnLighten = $('#btn-lighten');
    self.elements.btnDarken = $('#btn-darken');
    self.elements.btnPixelate = $('#btn-pixelate');
    self.elements.btnPrevImage = $('#btn-previmg');
    self.elements.btnNextImage = $('#btn-nextimg');
    self.elements.btnResetImage = $('#btn-reset');

    canvas = self.elements.canvas[0]; // TBC : Grab vanilla canvas reference from jquery wrapper
    context = canvas.getContext('2d');

    bindEventHandlers();
    self.loadImages(function(){
      self.drawImage(self.imageCursorIndex);
      self.imageDataWrapper = new ImageDataWrapper(self.getImageDataFromCanvas());
    });
  };

  self.prevImage = function() {
    // TBC : Subtract image cursor, unless 0.
    // If 0, go to max end of array
    self.imageCursorIndex === 0 ? self.imageCursorIndex = Object.keys(imgNames).length - 1 : self.imageCursorIndex--;
    self.resetImage();
  };

  self.nextImage = function() {
    // TBC : Add to image cursor, unless max.
    // If max, go to beginning of array
    self.imageCursorIndex === Object.keys(imgNames).length - 1 ? self.imageCursorIndex = 0 : self.imageCursorIndex++;
    self.resetImage();
  };

  self.resetImage = function() {
    self.drawImage(self.imageCursorIndex);
    self.imageDataWrapper = new ImageDataWrapper(self.getImageDataFromCanvas());
  };

  self.greyscale = function() {
    var imageDataCopy = new ImageDataWrapper(self.imageDataWrapper.imgData);
    self.imageDataWrapper.eachPixel(function(pixel) {
      var avg = (pixel.r + pixel.g + pixel.b) / 3;
      pixel.r = avg;
      pixel.g = avg;
      pixel.b = avg;
      imageDataCopy.setPixel(pixel);
    });

    self.drawImageData(imageDataCopy.imgData);
  };

  self.lighten = function() {
    var imageDataCopy = new ImageDataWrapper(self.imageDataWrapper.imgData);
    self.imageDataWrapper.eachPixel(function(pixel) {
      pixel.r += 10;
      pixel.g += 10;
      pixel.b += 10;
      imageDataCopy.setPixel(pixel);
    });

    self.drawImageData(imageDataCopy.imgData);
  };

  self.darken = function() {
    var imageDataCopy = new ImageDataWrapper(self.imageDataWrapper.imgData);
    self.imageDataWrapper.eachPixel(function(pixel) {
      pixel.r -= 10;
      pixel.g -= 10;
      pixel.b -= 10;
      imageDataCopy.setPixel(pixel);
    });

    self.drawImageData(imageDataCopy.imgData);
  };

  self.pixelate = function() {

  };

  self.loadImages = function(callback) {
    self.images = [];

    var totalImages = Object.keys(imgNames).length;
    var loadedImages = 0;
    var path = 'img/';

    imgNames.forEach(function(filename) {
      var img = new Image();
      img.src = path + filename;
      img.addEventListener('load', function() {
        loadedImages++;
        if (loadedImages === totalImages) {
          callback();
        }
      });

      self.images.push(img);
    });
  };

  self.drawImage = function(index) {
    var img = self.images[index];
    context.drawImage(img, 0, 0);
  };

  self.drawImageData = function(imageData) {
     context.putImageData(imageData, 0, 0);
     self.imageDataWrapper = new ImageDataWrapper(self.getImageDataFromCanvas());
  };

  self.getImageDataFromCanvas = function() {
    return context.getImageData(0, 0, canvas.width, canvas.height);
  };

  var bindEventHandlers = function() {
    self.elements.btnGreyscale.on('click', function() { self.greyscale(); });
    self.elements.btnLighten.on('click', function() { self.lighten(); });
    self.elements.btnDarken.on('click', function() { self.darken(); });
    self.elements.btnPixelate.on('click', function() { self.pixelate(); });
    self.elements.btnPrevImage.on('click', function() { self.prevImage(); });
    self.elements.btnNextImage.on('click', function() { self.nextImage(); });
    self.elements.btnResetImage.on('click', function() { self.resetImage(); });
  };

  self.initialize();
  return self;
}

function ImageDataWrapper(imgData) {
  var self = this;

  self.imgData = imgData || { };

  self.getPixel = function(row, col) {
    var idx = adjustIndex(row, col);

    return {
      row: row,
      col: col,
      r: self.imgData.data[idx],
      g: self.imgData.data[idx + 1],
      b: self.imgData.data[idx + 2],
      a: self.imgData.data[idx + 3]
    }
  };

  self.setPixel = function(pixel) {
    var idx = adjustIndex(pixel.row, pixel.col);

    self.imgData.data[idx] = pixel.r;
    self.imgData.data[idx + 1] = pixel.g;
    self.imgData.data[idx + 2] = pixel.b;
    self.imgData.data[idx + 3] = pixel.a;
  };

  self.eachPixel = function(callback) {
    var rowIndex = 0;
    var colIndex = 0;
    for (var i = 0; i < self.imgData.data.length; i+=4) {
      // TBC : If i is first index in row, reset column counter and bump row counter
      if (i != 0 && i % (self.imgData.width * 4) === 0) {
        rowIndex++;
        colIndex = 0;
      }
      var pixel = { };

      pixel.row = rowIndex;
      pixel.col = colIndex;
      pixel.r = self.imgData.data[i];
      pixel.g = self.imgData.data[i+1];
      pixel.b = self.imgData.data[i+2];
      pixel.a = self.imgData.data[i+3];

      colIndex++;
      callback(pixel);
    }
  };

  var adjustIndex = function(row, col) {
    var rowOffset = self.imgData.width * row * 4;
    var colOffset = col * 4;

    return rowOffset + colOffset;
  };

  return self;
}
