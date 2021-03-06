/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

// The number of rows and columns on the board.
// These have been made global so the Player object can access
// them when handling user input.
 // var numRows, numCols;
 // numRows = 6;
 // numCols = 5;



var Engine = /*(*/function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 101 * BoardManager.boardDimensions().numCols;//505;
    canvas.height = 101 * BoardManager.boardDimensions().numRows;//606;
    canvas.id = "game-board";
    //doc.body.appendChild(canvas);
    doc.getElementById("container").appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        BoardManager.currentLevel = 1;
        PopoverManager.showGameStartPopover();
        //PopoverManager.presentGameFinishPopover();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateCanvasDimensions();
        updateEntities(dt);
        updateCollectibles(dt);
        updateAnimations(dt);
        updatePopover(dt);
        checkCollisions();
    }

    function updateCanvasDimensions() {
      ctx.canvas.width = 101 * BoardManager.currentLevelMap.numCols;
      ctx.canvas.height = 101 * BoardManager.currentLevelMap.numRows;
    }
    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        // Update enemies
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        // Update player
        if ( player ) {
            player.update();
        } else {
            console.log('Wait for player to initialize');
        }

        // Update laser obstacles
        BoardManager.laserObstacles().forEach(function(laser) {
          laser.update(dt);
        });
    }

    /*
     * Updates the costumes on the board.
     */
    function updateCollectibles(dt) {
      BoardManager.updateCostumes(dt);
    }

    // Updates any current finite animations such as rock-smashing
    // animations.
    function updateAnimations(dt) {
      AnimationQueue.update(dt);
    }

    /*
     * Condtionally updates any popovers on the screen.
     */
    function updatePopover(dt) {
      window.PopoverManager.update(dt);
    }

    /*
     * Checks for any collisions involving enemies
     */
    function checkCollisions() {
      BoardManager.checkEnemyCollisions();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        renderBoard();
        renderAnimations();
        renderEntities();
        renderPopover();
    }

    /*
     * Renders the board to the screen.
     */
    function renderBoard() {
      BoardManager.renderBoard();
    }

    // Renders any current finite animations ( like rock-smashing ) to
    // the canvas
    function renderAnimations() {
      AnimationQueue.render();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        if ( player ) {
            player.render();
        } else {
            console.log('Wait for player to initialize');
        }
    }

    /*
     * Renders a popover to the screen.
     */
    function renderPopover() {
      PopoverManager.render();
    }


    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([

        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',

        'images/jack.png',

        // OBSTACLES
        // Rocks
        'images/rock-red.png',
        'images/rock-blue.png',
        'images/rock-yellow.png',
        'images/Rock.png',
        'images/pumpkin.png',
        'images/skull.png',
        // Lasers
        'images/laser-left.png',
        'images/laser-right.png',
        // Spider Web
        'images/web.png',

        // COSTUMES
        // LaserMan
        'images/glasses-red.png',
        'images/glasses-blue.png',
        'images/glasses-yellow.png',
        // Dwarf
        'images/dwarf-red.png',
        'images/dwarf-blue.png',
        'images/dwarf-yellow.png',
        // Ghost
        'images/ghost-costume.png',

        // ENEMIES
        'images/ghost-left.png',
        'images/ghost-left-attacking.png',
        'images/ghost-right.png',
        'images/ghost-right-attacking.png',
        'images/spider.png',
        'images/zombie.png',

        // Level finish
        'images/Selector.png',

        'images/candy-corn.png',
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
}/*)(this)*/;
