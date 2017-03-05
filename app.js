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
    console.log('app initializing...');

    self.elements.canvas = $('#canvas');
    self.elements.btnGreyscale = $('#btn-greyscale');
    self.elements.btnLighten = $('#btn-lighten');
    self.elements.btnDarken = $('#btn-darken');
    self.elements.btnPrevImage = $('#btn-previmg');
    self.elements.btnNextImage = $('#btn-nextimg');
    disableElements();

    canvas = self.elements.canvas[0]; // TBC : Grab vanilla canvas reference from jquery wrapper
    context = canvas.getContext('2d');

    bindEventHandlers();
    loadImages(function(){
      self.drawImage(self.imageCursorIndex);
      self.imageDataWrapper = new ImageDataWrapper(self.getImageDataFromCanvas());
      enableElements();
      console.log('app initialized');
    });
  };

  self.prevImage = function() {
    console.log('loading prev image...');

    // TBC : Subtract image cursor, unless 0.
    // If 0, go to max end of array
    self.imageCursorIndex === 0 ? self.imageCursorIndex = Object.keys(imgNames).length - 1 : self.imageCursorIndex--;
    self.drawImage(self.imageCursorIndex);
    self.imageDataWrapper = new ImageDataWrapper(self.getImageDataFromCanvas());

    console.log('prev image loaded');
  };

  self.nextImage = function() {
    console.log('loading next image...');

    // TBC : Add to image cursor, unless max.
    // If max, go to beginning of array
    self.imageCursorIndex === Object.keys(imgNames).length - 1 ? self.imageCursorIndex = 0 : self.imageCursorIndex++;
    self.drawImage(self.imageCursorIndex);
    self.imageDataWrapper = new ImageDataWrapper(self.getImageDataFromCanvas());

    console.log('next image loaded');
  };

  self.greyscale = function() {
    console.log('greyscaling image...');

    var imageDataCopy = new ImageDataWrapper(self.imageDataWrapper.imgData);
    self.imageDataWrapper.eachPixel(function(pixel) {
      var avg = (pixel.r + pixel.g + pixel.b) / 3;
      pixel.r = avg;
      pixel.g = avg;
      pixel.b = avg;
      imageDataCopy.setPixel(pixel);
    });

    self.drawImageData(imageDataCopy.imgData);
    self.imageDataWrapper = new ImageDataWrapper(self.getImageDataFromCanvas());

    console.log('image greyscaled');
  };

  self.lighten = function() {
    console.log('lightening image...');

    console.log('image lightened');
  };

  self.darken = function() {
    console.log('darkening image...');

    console.log('image darkened');
  };

  self.drawImage = function(index) {
    var img = self.images[index];
    context.drawImage(img, 0, 0);
  };

  self.drawImageData = function(imageData) {
     context.putImageData(imageData, 0, 0);
  };

  self.getImageDataFromCanvas = function() {
    return context.getImageData(0, 0, canvas.width, canvas.height);
  };

  var bindEventHandlers = function() {
    self.elements.btnGreyscale.on('click', function() {
      console.log('btnGreyscale clicked');
      self.greyscale();
    });
    self.elements.btnLighten.on('click', function() {
      console.log('btnLighten clicked');
      lighten();
    });
    self.elements.btnDarken.on('click', function() {
      console.log('btnDarken clicked');
      darken();
    });
    self.elements.btnPrevImage.on('click', function() {
      console.log('btnPrevImage clicked');
      self.prevImage();
    });
    self.elements.btnNextImage.on('click', function() {
      console.log('btnNextImage clicked');
      self.nextImage();
    });
  };

  var loadImages = function(callback) {
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

  var enableElements = function() {
    for (var key in self.elements) {
      var elem = self.elements[key];
      elem.prop('disabled', false);
    }
  };

  var disableElements = function() {
    for (var key in self.elements) {
      var elem = self.elements[key];
      elem.prop('disabled', true);
    }
  };

  self.initialize();
  return self;
}

function ImageDataWrapper(imgData) {
  var self = this;

  self.imgData = imgData || { };

  // self.getPixelGrid = function() {
  //   var rows = [];
  //   var cols = [];
  //
  //   var rowIndex = 0;
  //   var colIndex = 0;
  //   for (var i = 0; i < self.imgData.data.length; i+=4) {
  //     // TBC : If i is first index in row, add to rows and start new row
  //     if (i % (self.imgData.width * 4) === 0) {
  //       rowIndex++;
  //       rows[rowIndex] = cols;
  //       colIndex = 0;
  //       cols = [];
  //     }
  //     var pixel = { };
  //
  //     pixel.row = rowIndex;
  //     pixel.col = colIndex;
  //     pixel.r = self.imgData.data[i];
  //     pixel.g = self.imgData.data[i+1];
  //     pixel.b = self.imgData.data[i+2];
  //     pixel.a = self.imgData.data[i+3];
  //
  //     cols[colIndex] = pixel;
  //     colIndex++;
  //   }
  //
  //   return rows;
  // };

  self.getPixel = function(row, col) {
    var rowOffset = self.imgData.width * row * 4;
    var colOffset = col * 4;
    var adjustedIndex = rowOffset + colOffset;

    return {
      row: row,
      col: col,
      r: self.imgData.data[adjustedIndex],
      g: self.imgData.data[adjustedIndex + 1],
      b: self.imgData.data[adjustedIndex + 2],
      a: self.imgData.data[adjustedIndex + 3]
    }
  };

  self.setPixel = function(pixel) {
    var rowOffset = self.imgData.width * pixel.row * 4;
    var colOffset = pixel.col * 4;
    var adjustedIndex = rowOffset + colOffset;

    self.imgData.data[adjustedIndex] = pixel.r;
    self.imgData.data[adjustedIndex + 1] = pixel.g;
    self.imgData.data[adjustedIndex + 2] = pixel.b;
    self.imgData.data[adjustedIndex + 3] = pixel.a;
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

  return self;
}
