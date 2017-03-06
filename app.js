$(document).ready(function() {
  var app = new App();
});

/*
  TBC : The App object will be responsible for managing the application.
*/
function App() {
  // TBC : Self object for public properties / methods
  var self = this;

  self.elements = { };
  self.images = [];
  self.imageCursorIndex = 0;
  self.imageDataWrapper = { };

  // TBC : List of image names
  var imgNames = [
    'balls.jpg',
    'woods.jpg',
    'flag.jpg',
    'autumn.jpg',
    'berries.jpg'
  ];
  var context = { };
  var canvas = { };

  // TBC : Formalize elements, grab context stuff, load images, and bind event handlers
  self.initialize = function() {
    self.elements.canvas = $('#canvas');
    self.elements.btnGreyscale = $('#btn-greyscale');
    self.elements.btnLighten = $('#btn-lighten');
    self.elements.btnDarken = $('#btn-darken');
    self.elements.btnPixelate = $('#btn-pixelate');
    self.elements.btnPrevImage = $('#btn-previmg');
    self.elements.btnNextImage = $('#btn-nextimg');
    self.elements.btnResetImage = $('#btn-reset');

    self.elements.txtPixelSize = $('#txt-pixelsize');

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

  // TBC : Greys the current image on the canvas and redraws to canvas
  self.greyscale = function() {
    var imageDataCopy = new ImageDataWrapper(self.imageDataWrapper.imgData);
    self.imageDataWrapper.eachPixel(function(pixel) {
      // TBC : Average pixel colors to grey
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
      // TBC : Bump pixel color to lighten
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
      // TBC : Subtract pixel color to darken
      pixel.r -= 10;
      pixel.g -= 10;
      pixel.b -= 10;
      imageDataCopy.setPixel(pixel);
    });

    self.drawImageData(imageDataCopy.imgData);
  };

  // TBC : Pixelate the current image on the canvas
  self.pixelate = function(size) {
    // TBC : Size is the pixelated block size
    var sz = size;
    // TBC : Offset to find the center pixel of sub grids
    var offset = Math.floor(sz / 2);

    var imageDataCopy = new ImageDataWrapper(self.imageDataWrapper.imgData);
    for (var i = 0; i < imageDataCopy.height(); i+=sz) {
      for (var j = 0; j < imageDataCopy.width(); j+=sz) {
        // TBC : Find the center pixel in the subgrid
        var centerPixel = imageDataCopy.getPixel(i + offset, j + offset);

        // TBC : Find all neighbors of center pixel and set their colors the same as the center
        for (var m = -offset; m <= offset; m++) {
          for (var n = -offset; n <= offset; n++) {
            var neighborPixel = imageDataCopy.getPixel(centerPixel.row + m, centerPixel.col + n);

            neighborPixel.r = centerPixel.r;
            neighborPixel.g = centerPixel.g;
            neighborPixel.b = centerPixel.b;

            imageDataCopy.setPixel(neighborPixel);
          }
        }
      }
    }

    self.drawImageData(imageDataCopy.imgData);
  };

  // TBC : Load images in /img folder that are also in imgNames array
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
        // TBC : When all images are loaded, execute callback
        if (loadedImages === totalImages) {
          callback();
        }
      });

      self.images.push(img);
    });
  };

  // TBC : Draw loaded image to canvas
  self.drawImage = function(index) {
    var img = self.images[index];
    context.drawImage(img, 0, 0);
  };

  // TBC : Draw image data to canvas
  self.drawImageData = function(imageData) {
     context.putImageData(imageData, 0, 0);
     self.imageDataWrapper = new ImageDataWrapper(self.getImageDataFromCanvas());
  };

  // TBC : Retrieve the image data from the canvas
  self.getImageDataFromCanvas = function() {
    return context.getImageData(0, 0, canvas.width, canvas.height);
  };

  // TBC : Bind events
  var bindEventHandlers = function() {
    self.elements.btnGreyscale.on('click', function() { self.greyscale(); });
    self.elements.btnLighten.on('click', function() { self.lighten(); });
    self.elements.btnDarken.on('click', function() { self.darken(); });
    self.elements.btnPixelate.on('click', function() {
      var pixelSize = parseInt(self.elements.txtPixelSize.val());
      self.pixelate(pixelSize);
    });
    self.elements.btnPrevImage.on('click', function() { self.prevImage(); });
    self.elements.btnNextImage.on('click', function() { self.nextImage(); });
    self.elements.btnResetImage.on('click', function() { self.resetImage(); });
  };

  self.initialize();
  return self;
}

/*
  TBC : The ImageDataWrapper object will be add abstraction to the imageData interface

  - This allows getting/setting pixels as opposed to specific pixel data points
  - This provides abstraction in a 2 dimensional row/column perspective as opposed to the underlying 1 dimensional construct
  - Provides a utility for iterating through each pixel
*/
function ImageDataWrapper(imgData) {
  var self = this;

  self.imgData = imgData || { };

  // TBC : Get data points at row/col in pixel format
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

  // TBC : Set data points of pixel
  self.setPixel = function(pixel) {
    var idx = adjustIndex(pixel.row, pixel.col);

    self.imgData.data[idx] = pixel.r;
    self.imgData.data[idx + 1] = pixel.g;
    self.imgData.data[idx + 2] = pixel.b;
    self.imgData.data[idx + 3] = pixel.a;
  };

  // TBC : Utility that will iterate through each pixel and execute callback for pixel
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

  // TBC : Get width
  self.width = function() {
    return self.imgData.width;
  };

  // TBC : Get height
  self.height = function() {
    return self.imgData.height;
  };

  // TBC : Return the underlying index for a specified row/col combination
  var adjustIndex = function(row, col) {
    var rowOffset = self.imgData.width * row * 4;
    var colOffset = col * 4;

    return rowOffset + colOffset;
  };

  return self;
}
