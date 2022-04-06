# Coin collector with Kaboom

In this tutorial, we're going to a create coin collector game to learn how game scenes work in Kaboom. In our game, our character will advance through to different levels by collecting all coins at each level.

![scenes](scenes.png)

You can find the code for this tutorial at this [link](https://replit.com/@ritza/scenes) or in the embedded code at the end of this tutorial.

## Getting started

Let's begin by initializing a kaboom context. Add the following code to your project:

```javascript

kaboom({
  background:[215,155,25]
})

```

This code will create a context with a dark yellow background. Let's also add the sprites and sounds we will use for this tutorial, add the following code below the `kaboom()` function:

```javascript
loadSprite("bean", "/sprites/bean.png")
loadSprite("coin", "/sprites/coin.png")
loadSprite("spike", "/sprites/spike.png")
loadSprite("grass", "/sprites/grass.png")
loadSprite("ghosty", "/sprites/ghosty.png")
loadSprite("portal", "/sprites/portal.png")
loadSound("score", "/sounds/score.mp3")
loadSound("portal", "/sounds/portal.mp3")
```

## Setting up the main scene

A scene in Kaboom is a setting for a specific situation or condition. For instance, the "game" scene is the setup of the game displayed while we're still playing, if we lose the game we can cage the setup to a "lose" scene to display our score or that we lost.

Before we create the "game" scene, let's create a few constants for our game. Add the following code below the sprite imports:

```javascript
const SPEED = 480

const LEVELS = [
	[
		"@  ^ $$ >",
		"=========",
	],
	[
		"@   $   >",
		"=   =   =",
	],
]

```

The `SPEED` variable holds the speed of our player sprite and the list `LEVELS` holds a map for different levels through which the player can advance once all the coins in one level are collected. The symbols in the list represent the game objects to be added at different positions on the map.


Now we're going to implement the "game" scene. Using the `scene()` function we can create a scene and specify the name of the scene in the first parameter of the function, we can also pass in variables or arrays in the second parameter (as a list), that we will use inside the scene. 

The rest of the code in this section will be implemented inside the `scene()` function. Add the following code below the `LEVELS` list:


```javascript
scene("game", ({ levelIdx, score }) => {

	gravity(2400)
```

For the first line in the code above, we create a scene called "game". The variable `levelIdx` represents the current level of the game, which will be declared later on in the code,`score` is the score counter.

With the `gravity()` function, we've created the gravity effect in the game to which any object with a `body()` component will respond.

Earlier we created a map of different levels with symbols representing different sprites. Let's assign the loaded sprites to the different symbols on the map

```javascript  
	const level = addLevel(LEVELS[levelIdx || 0], {
		width: 64,
		height: 64,
		pos: vec2(100, 200),
		"@": () => [
			sprite("bean"),
			area(),
			body(),
			origin("bot"),
			"player",
		],
		"=": () => [
			sprite("grass"),
			area(),
			solid(),
			origin("bot"),
		],
		"$": () => [
			sprite("coin"),
			area(),
			origin("bot"),
			"coin",
		],
		"^": () => [
			sprite("spike"),
			area(),
			origin("bot"),
			"danger",
		],
		">": () => [
			sprite("portal"),
			area(),
			origin("bot"),
			"portal",
		],
	})
```

Using the `sprite()` function, we specify which sprite the symbols are assigned. The `area()` creates a collider from the sprite shape and lets us detect collisions, and `origin()` gives the sprites a point of origin when the game starts.

Let's create an object for our player sprite, add the following code below the `level` array:


```javascript
	const player = get("player")[0]
```

In the code above, we get the sprite with the tag "player", which is the first sprite in the array, and assign it to the variable `player`.

To give our player movement, let's use the `onKeyPress()` functions to use keyboard keys for movement. Add the following below the `player` variable:

```javascript
	onKeyPress("space", () => {
		if (player.isGrounded()) {
			player.jump()
		}
	})

	onKeyDown("left", () => {
		player.move(-SPEED, 0)
	})

	onKeyDown("right", () => {
		player.move(SPEED, 0)
	})
```

In the code above, we use the "space" key to make our player jump. The `isGrounded()` checks if our player is standing on an object or platform before making them jump. The "left" and "right" arrow keys create a horizontal movement for the player.


There are a few collision events we need to implement. The first collision is for when the player collides with, that is "to collect", a coin. When this happens, we have to make the score increment and display it on the game screen, we'll also add the "score" sound to know when the score increments. Add this implemenation below the `onKeyDown()` function:

```javascript
	player.onCollide("coin", (coin) => {
		destroy(coin)
		play("score")
		score++
		scoreLabel.text = score
	})
```

The `destroy()` function above will remove the coin from the game screen once the player collects it.

We've added spikes in the game to create a little challenge for our player. If the player lands or touches the spikes they will die. Let's add this implementation with the following code:

```javascript
	player.onCollide("danger", () => {
		player.pos = level.getPos(0, 0)
		go("lose")
	})

```

The tag for the "spike" sprite in the code above, is "danger". Once the player collides with the spikes, we will use the `go()` function to switch to the "lose" scene which we are yet to implement.

The player can also fall off a platform due to the gravity in the game. If the player does fall, it will be game over. Let's add this functionality with the `onUpdate()` function to keep checking the player's `y` position to see if they have fallen off:

```javascript
	player.onUpdate(() => {
		if (player.pos.y >= 480) {
			go("lose")
		}
	})
```

The last collision event is for when the player reaches the "portal" sprite, in which case they will advance to the next level. Add the following code below the `onUpdate()` function:

```javascript
	player.onCollide("portal", () => {
		play("portal")
		if (levelIdx < LEVELS.length - 1) {

			go("game", {
				levelIdx: levelIdx + 1,
				score: score,
			})
		} else {

			go("win", { score: score, })
		}
	})
```

In the code above, the line `if (levelIdx < LEVELS.length - 1)` will check which level the player is in and if there are move levels, it will let the player advance, or else it will switch to the "win" scene to show that the player has won the game.

The following function will add the score as a text on screen. Add the code below to the previous `onCollide()` function:

```javascript
	const scoreLabel = add([
		text(score),
		pos(12)
	])

})

```

## Winning or Losing

When the player wins the game, the scene will switch from the "game" to the "win" scene, in which case the number of coins collected will be displayed. Add the following code for the "win" scene, make sure it's outside the last bracket of the "game" scene:

```javascript
scene("win", ({ score }) => {

	add([
		text(`You grabbed ${score} coins!!!`, {
			width: width(),
		}),
		pos(12),
	])

	onKeyPress(start)

})

```

Similarly, when a player loses, the scene will switch to that of the "lose" scene, where the text "You Lose" will be displayed. Add the following code below the "win" scene:

```javascript
scene("lose", () => {

	add([
		text("You Lose"),
		pos(12),
	])
	onKeyPress(start)

})
```

Both the "win" and "lose" scenes use the "onKeyPress(start)" function to switch the initial display before the game starts if they press on any key.
The `start()` function is what switches the display from these scenes to the initial "game" scene.

Let's add the implementation of the `start()` function below the "lose" scene.

```javascript
function start() {
	go("game", {
		levelIdx: 0,
		score: 0,
	})
}

start()
```

The function above will also reset the score and level in the game so that the player can restart.

### Challenges to try:

* Add a celebration scene where the player dances using animations and a celebrity sound, for each time the player reaches the portal before switching to the winning scene or the next level.

* Add more levels to the game with an increased number of spikes.

Try the embedded repl below:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/scenes?embed=true"></iframe>
