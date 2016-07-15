$(function() {
  var margin = 30;
  var n = 9;
  var between = 2;

  var canvas = $("#hex-board");
  var boxHeight = (canvas.height() - 2*margin)/(0.75*n+0.25);
  var boxWidth = (canvas.width() - 2*margin)/(1.5*n-0.5);
  var widthBaseSize = boxWidth*2/Math.sqrt(3);
  if (boxHeight > widthBaseSize) {
    var size = widthBaseSize;
    boxHeight = size;
  } else {
    var size = boxHeight;
    boxWidth = size*Math.sqrt(3)/2;
  }
  
  var drawBorder = function(a,b,off,color) {
    var center = {
      x: margin+(a+0.5+b*0.5)*boxWidth + off.x,
      y: margin+(0.75*b+0.5)*boxHeight + off.y
    };
    var color = 
    canvas.drawPolygon({
      layer: true,
      x: center.x, y: center.y,
      radius: (size+1)/2,
      sides: 6,
      rotate: 30,
      fillStyle: color
    });
  }
  var drawField = function(a,b) {
    var center = {
      x: margin+(a+0.5+b*0.5)*boxWidth,
      y: margin+(0.75*b+0.5)*boxHeight
    };
    canvas.drawPolygon({
      layer: true,
      x: center.x, y: center.y,
      radius: (size-between)/2,
      sides: 6,
      rotate: 30,
      fillStyle: '#bbb',
      click: function(layer) {
        $(this).setLayer(layer, { fillStyle: '#f00' }).drawLayers();
      }
    });
  };
  
  for (i = 0; i < n; i++) {
    drawBorder(i, -1, {x: 0, y: -5}, '#f66');
    drawBorder(i, n, {x: 0, y: 5}, '#f66');
    drawBorder(-1, i, {x: -4, y: 2}, '#66f');
    drawBorder(n, i, {x: 4, y: -2}, '#66f');
  }
  for (i = 0; i < n; i++) {
    for (j = 0; j < n; j++) {
      drawField(i,j);
    }
  }
});
