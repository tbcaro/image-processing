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
      self.imageDataWrapper = new ImageDataWrapper(
        self.getImageDataFromCanvas(), {
        rowWidth: canvas.width
      });
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

    console.log('prev image loaded');
  };

  self.nextImage = function() {
    console.log('loading next image...');

    // TBC : Add to image cursor, unless max.
    // If max, go to beginning of array
    self.imageCursorIndex === Object.keys(imgNames).length - 1 ? self.imageCursorIndex = 0 : self.imageCursorIndex++;
    self.drawImage(self.imageCursorIndex);

    console.log('next image loaded');
  };

  self.greyscale = function() {
    console.log('greyscaling image...');

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
      greyscale();
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

function ImageDataWrapper(imgData, options) {
  var self = this;

  self.data = imgData || [];
  self.rowWidth = options.rowWidth || 500;

  self.getPixelGrid = function() {
    var rows = [];
    var cols = [];

    for (var i = 0; i < self.data.length; i+=4) {
      // TBC : If i is first index in row, add to rows and start new row
      if (i % (self.rowWidth * 4) === 0) {
        rows.push(cols);
        cols = [];
      }
      var pixel = { };

      pixel.r = self.data[i];
      pixel.g = self.data[i+1];
      pixel.b = self.data[i+2];
      pixel.a = self.data[i+3];

      cols.push(pixel);
    }

    return rows;
  };

  self.getPixel = function(row, col) {
    var rowOffset = self.rowWidth * row * 4;
    var colOffset = col * 4;
    var adjustedIndex = rowOffset + colOffset;

    return {
      row: row,
      col: col,
      r: self.data[adjustedIndex],
      g: self.data[adjustedIndex + 1],
      b: self.data[adjustedIndex + 2],
      a: self.data[adjustedIndex + 3]
    }
  };

  self.setPixel = function(pixel) {
    var rowOffset = self.rowWidth * pixel.row * 4;
    var colOffset = pixel.col * 4;
    var adjustedIndex = rowOffset + colOffset;

    self.data[adjustedIndex] = pixel.r;
    self.data[adjustedIndex + 1] = pixel.g;
    self.data[adjustedIndex + 2] = pixel.b;
    self.data[adjustedIndex + 3] = pixel.a;
  };

  // TBC : Deep copy an element
  self.clone = function() {
    // TBC : Call constructor of original object to create a new copy
    var copy = self.constructor();

    // TBC : Map all properties and values of original to copy
    for (var key in self) {
        if (self.hasOwnProperty(key)) copy[key] = self[key];
    }
    return copy;
  }

  return self;
}
