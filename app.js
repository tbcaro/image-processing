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
    'autumn.jpg',
    'balls.jpg',
    'berries.jpg',
    'flag.jpg',
    'woods.jpg'
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

    canvas = self.elements.canvas[0]; // TBC : Grab vanilla canvas reference from jquery wrapper
    context = canvas.getContext('2d');

    bindEventHandlers();
    loadImages(function(){
      self.drawImage(self.imageCursorIndex);
    });
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
      prevImage();
    });
    self.elements.btnNextImage.on('click', function() {
      console.log('btnNextImage clicked');
      nextImage();
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

  var prevImage = function() {
    console.log('loading prev image...');

    console.log('prev image loaded');
  };

  var nextImage = function() {
    console.log('loading next image...');

    console.log('next image loaded');
  };

  var greyscale = function() {
    console.log('greyscaling image...');

    console.log('image greyscaled');
  };

  var lighten = function() {
    console.log('lightening image...');

    console.log('image lightened');
  };

  var darken = function() {
    console.log('darkening image...');

    console.log('image darkened');
  };

  self.initialize();
  return self;
}

function ImgDataWrapper(imgData) {
  var self = this;

  self.data = imgData || [];

  return self;
}
