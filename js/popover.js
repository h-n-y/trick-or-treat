(function() {

var POPOVER_COLORS = {
  blueGray: "rgb(71, 70, 81)",
  gray: "rgb(186, 186, 186)",
  orange: "rgb(255, 184, 6)",
  green: "rgb(171, 252, 170)"
};

var PopoverManager = function() {
  var ctx = null;
};
PopoverManager.prototype.showGameStartPopover = function() {
  this._addCanvasToDOMWithID("game-start-popover");
  this.costumeData = {};
  // Set canvas dimensions
  this.ctx.canvas.width = 720;
  this.ctx.canvas.height = 600;
  var horizontalCenter = this.ctx.canvas.width / 2;

  this.ctx.font = "32pt Amatic SC";
  this.ctx.textAlign = "center";
  // Add dark blue-gray background
  this.ctx.fillStyle = POPOVER_COLORS.blueGray;
  this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  this.ctx.fillStyle = POPOVER_COLORS.gray;
  this.ctx.fillText("This is Jack:", horizontalCenter, 80);

  this.ctx.fillText("Help Jack find the", horizontalCenter, 300);
  this.ctx.fillStyle = POPOVER_COLORS.orange;
  this.ctx.fillText("CANDYCORN", horizontalCenter, 350);
  this.ctx.fillStyle = POPOVER_COLORS.gray;
  this.ctx.fillText("he dropped while", horizontalCenter, 390);
  this.ctx.fillText("trick-or-treating!", horizontalCenter, 430);

  this.ctx.font = "24pt Amatic SC";
  this.ctx.fillText("[ space ] to continue", horizontalCenter, 560);

  // Add orange text
  this.ctx.fillStyle = POPOVER_COLORS.orange;
  this.ctx.font = "32pt Amatic SC";
  this.ctx.fillText("Jack", horizontalCenter + 36, 80);
  this.ctx.font = "24pt Amatic SC";
  this.ctx.fillText("space", horizontalCenter - 54, 560);

  // Add image of Jack
  this.ctx.drawImage(Resources.get('images/jack.png'), horizontalCenter - 51, 60);
};
PopoverManager.prototype.presentGameFinishPopover = function() {
  this._addCanvasToDOMWithID("game-end-popover");
  this._setFireworks();

  this._renderEndOfGamePopover();
};
PopoverManager.prototype._renderEndOfGamePopover = function() {
  // Clear canvas
  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  // Set canvas dimensions
  this.ctx.canvas.width = 1280;//720;
  this.ctx.canvas.height = 700;//600;
  var horizontalCenter = this.ctx.canvas.width / 2;
  var verticalCenter = this.ctx.canvas.height / 2;

  // add background
  this.ctx.fillStyle = POPOVER_COLORS.blueGray;
  this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  // Print 'Happy Halloween'
  this.ctx.font = "48pt Amatic SC";
  this.ctx.textAlign = "center";
  this.ctx.fillStyle = POPOVER_COLORS.orange;
  this.ctx.fillText("Happy Halloween", horizontalCenter, verticalCenter);

  // Render fireworks
  this._renderFireworks();
};
PopoverManager.prototype._setFireworks = function() {
  var canvas, colors;
  canvas = this.ctx.canvas;
  colors = ["white", POPOVER_COLORS.orange, POPOVER_COLORS.green]
  colors = ["rgba(255, 255, 255, %alpha%)", "rgba(255, 184, 6, %alpha%)", "rgba(171, 252, 170, %alpha%)"];

  this.fireworks = {
    particle1: {
      // line width: 0 --> large
      // alpha: large --> 0
      radius: 50,
      lineWidth: 0,
      alpha: 1,
      center: {
        x: 0,
        y: 0
      },
      color: "rgba(255, 184, 6, %alpha%)",
      update: function(dt) {
        var speed, ds;
        speed = 4;
        ds = speed * dt;
        this.lineWidth += 100 * ds;
        this.alpha -= ds;

        // Restart animation at a new random location
        if ( this.alpha < 0 ) {
          this.alpha = 1;
          this.lineWidth = 0;
          this.center.x = randomIntegerInRange(0, canvas.width);
          this.center.y = randomIntegerInRange(0, canvas.height);
          this.color = colors[randomIntegerInRange(0, colors.length - 1)];
        }
      }
    },
    particle2: {
      // alpha: large --> 0
      // radius: 0 --> large
      radius: 0,
      lineWidth: 10,
      alpha: 1,
      center: {
        x: 0,
        y: 0
      },
      color: "rgba(255, 184, 6, %alpha%)",
      update: function(dt) {
        var speed, ds;
        speed = 5;
        ds = speed * dt;
        this.alpha -= ds;
        this.radius += 18 * ds;

        // Restart animation at a new random location
        if ( this.alpha < 0 ) {
          this.alpha = 1;
          this.radius = 0;
          this.center.x = randomIntegerInRange(0, canvas.width);
          this.center.y = randomIntegerInRange(0, canvas.height);
          this.color = colors[randomIntegerInRange(0, colors.length - 1)];
        }
      }
    },
    particle3: {
      // line width: large --> 0
      // radius: 0 --> large
      radius: 0,
      lineWidth: 20,
      alpha: 1,
      center: {
        x: 0,
        y: 0
      },
      color: "rgba(255, 184, 6, %alpha%)",
      update: function(dt) {
        var speed, ds;
        speed = 20;
        ds = speed * dt;
        this.lineWidth -= 3 * ds;
        this.radius += 10 * ds;

        // Restart animation at a new random location
        if ( this.lineWidth < 0 ) {
          this.lineWidth = 15;
          this.radius = 0;
          this.center.x = randomIntegerInRange(0, canvas.width);
          this.center.y = randomIntegerInRange(0, canvas.height);
          this.color = colors[randomIntegerInRange(0, colors.length - 1)];
        }
      }
    }
  };
};
PopoverManager.prototype._addCanvasToDOMWithID = function(id) {
  // Create new canvas
  var popover = document.createElement('canvas');
  popover.id = id;
  // Add canvas to DOM
  document.getElementById("container").appendChild(popover);
  this.ctx = popover.getContext('2d');

  // If canvas is displaying a costume popover, set its width and
  // height to match the game board canvas dimensions
  if ( id === "costume-popover" ) {
    popover.width  = window.ctx.canvas.width;
    popover.height = window.ctx.canvas.height;
  }
};
// PopoverManager.prototype._removeCanvasFromDOM = function() {
//   var canvas = document.getElementById("popover");
//   document.body.removeChild(canvas);
// };
PopoverManager.prototype.presentLaserManPopover = function() {
  this._addCanvasToDOMWithID("costume-popover");
  this._setCostumeDataForCostume(COSTUME_TYPE.laserman);
};
PopoverManager.prototype.presentDwarfPopover = function() {
  this._addCanvasToDOMWithID("costume-popover");
  this._setCostumeDataForCostume(COSTUME_TYPE.dwarf);
};
PopoverManager.prototype.presentGhostPopover = function() {
  this._addCanvasToDOMWithID("costume-popover");
  this._setCostumeDataForCostume(COSTUME_TYPE.ghost);
};
PopoverManager.prototype.removePopover = function() {
  if ( this.ctx === null ) return;

  // Remove canvas here
  var canvasContainer = document.getElementById("container");
  canvasContainer.removeChild(this.ctx.canvas);
  this.ctx = null;
};
PopoverManager.prototype.update = function(dt) {
  if ( this._isDisplayingCostumePopover() ) {
    this.costumeData.update();
  } else if ( this._isDisplayingEndOfGamePopover() ) {
    this._updateFireworks(dt);
  }
};
PopoverManager.prototype._updateFireworks = function(dt) {
  for ( var particle in this.fireworks ) {
    if ( this.fireworks.hasOwnProperty(particle) ) {
      this.fireworks[particle].update(dt);
    }
  }
  //this.fireworks.particle1.update(dt);
  // this.fireworks.particle2.update(dt);
  // this.fireworks.particle3.update(dt);
}
PopoverManager.prototype.render = function() {
  if ( this._isDisplayingCostumePopover() ) {
    this._renderCostumePopover();
  } else if ( this._isDisplayingEndOfGamePopover() ) {
    //this._renderFireworks();
    this._renderEndOfGamePopover();
  }
};
PopoverManager.prototype._renderFireworks = function() {

  var particle;

  for ( var key in this.fireworks ) {
    if ( this.fireworks.hasOwnProperty(key) ) {
      particle = this.fireworks[key];
      this.ctx.strokeStyle = particle.color.replace("%alpha%", particle.alpha);
      this.ctx.lineWidth = particle.lineWidth;
      this.ctx.beginPath();
      this.ctx.arc(particle.center.x, particle.center.y, particle.radius, 0, 2 * Math.PI, true);
      this.ctx.stroke();
    }
  }
};
PopoverManager.prototype._renderCostumePopover = function() {
  // Prevent window from scrolling down when this popover is added to the DOM
  window.scrollTo(0, 0);
  this.ctx.canvas.style.top = (-window.ctx.canvas.height).toString() + "px";

  var horizontalCenter, canvasHeight;
  horizontalCenter = this.ctx.canvas.width / 2;
  canvasHeight = this.ctx.canvas.height;

  // Clear canvas
  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  // Set initial styles
  this.ctx.fillStyle = "rgba(71, 70, 81, 0.9)";
  this.ctx.textAlign = "center"
  this.ctx.font = "32pt Amatic SC";

  // Add background
  this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  this.ctx.fillStyle = POPOVER_COLORS.orange;
  this.ctx.fillText(this.costumeData.costume, horizontalCenter, 0.1 * canvasHeight);
  this.ctx.fillStyle = "white";
  this.ctx.fillText(this.costumeData.caption, horizontalCenter, 0.7 * canvasHeight);


  this.ctx.font = "24pt Amatic SC";
  this.ctx.fillStyle = POPOVER_COLORS.gray;
  this.ctx.fillText("COSTUME", horizontalCenter, 0.2 * canvasHeight);
  this.ctx.fillText("[ space ] to continue", horizontalCenter, 0.9 * canvasHeight);
  this.ctx.fillStyle = "orange";
  this.ctx.fillText("space", horizontalCenter - 54, 0.9 * canvasHeight);



  // Draw image
  this.costumeData.originalImageYLocation = 0.25 * canvasHeight;
  //this.costumeData.imageLocation.y = this.costumeData.originalImageYLocation;
  this.ctx.drawImage(Resources.get(this.costumeData.spriteURL), horizontalCenter - 51, this.costumeData.imageLocation.y);
};
PopoverManager.prototype._isDisplayingCostumePopover = function() {
  return this.ctx !== null && this.ctx.canvas.id === "costume-popover";
  //return this.costumeData !== null || this.costumeData !== undefined;
};
PopoverManager.prototype._isDisplayingEndOfGamePopover = function() {
  return this.ctx !== null && this.ctx.canvas.id === "game-end-popover";
};
PopoverManager.prototype._setCostumeDataForCostume = function(costume) {
  switch ( costume ) {
    case COSTUME_TYPE.dwarf:
    this.costumeData = {
      costume: "DWARF",
      spriteURL: 'images/dwarf-red.png',
      caption: "Rocks were meant for smashing.",
    };
    break;

    case COSTUME_TYPE.laserman:
    this.costumeData = {
      costume: "LASERMAN",
      spriteURL: 'images/glasses-blue.png',
      caption: "Lasers shmasers.",
    };
    break;

    case COSTUME_TYPE.ghost:
    this.costumeData = {
      costume: "GHOST",
      spriteURL: 'images/ghost-costume.png',
      caption: "100% Believeable.",
    };
    break;
  }

  var update = function(dt) {
    var dy, maxDY, frequencyControl;

    // Use a sin function to oscillate dy from [-maxDY, maxDY]
    // maxDY and frequencyControl were chosen subjectively
    //maxDY = 0.1;
    maxDY = 8;
    frequencyControl = 800;
    dy = maxDY * Math.sin(Date.now() / frequencyControl);
    this.imageLocation.y = this.originalImageYLocation + dy;
  };

  this.costumeData.update = update;
  this.costumeData.imageLocation = {
    x: this.ctx.canvas.width / 2 - 51,
    y: 60
  }
  this.costumeData.originalImageYLocation = 60;
};

// Make an instance of PopoverManager globally available
window.PopoverManager = new PopoverManager();

}());
