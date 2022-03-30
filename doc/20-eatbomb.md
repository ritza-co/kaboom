# Consuming Sprites with Kaboom

In this tutorial, we're going to create a mini-game, "eatbomb" to learn how we can consume other sprites in a game.

In the game, the player has to dodge all incoming sprites and consume only bomb sprites to gain points, or else they lose.

![eat-bombs](eatbombs.png)

You can find the code for this tutorial at the following [link](https://replit.com/@Ritza/eatbomb).

## Getting Started 

Let's start by importing the following code into our project to initiate a kaboom context:

```javascript
kaboom({
background : [25,25,26]
})
```
The code above will create a dark grey background for our context. 

Let's also import the Srpites and Sounds we will use in the tutorial. Add the following code below `Kaboom()`:

```javascript
loadSprite("bean", "/sprites/bean.png")
loadSprite("bomb", "/sprites/bomb.png")
loadSound("hit", "/sounds/hit.mp3")
loadSound("wooosh", "/sounds/wooosh.mp3")

const fruits = [
	"apple",
	"pineapple",
	"grape",
	"watermelon",
]

for (const fruit of fruits) {
	loadSprite(fruit, `sprites/${fruit}.png`)
}
```
The list `fruits` we created will contain several sprites with similar behavior so we placed them in a list to avoid repeating code.

## Starting scene

In this section, we'll implement the scene that will be displayed when we start the game.

```javascript
scene("start", () => {
	play("wooosh")
	add([
		text("Eat All"),
		pos(center().sub(0, 100)),
		scale(2),
		origin("center"),
	])

	add([
		sprite("bomb"),
		pos(center().add(0, 100)),
		scale(2),
		origin("center"),
	])

	wait(1.5, () => go("game"))

})
```
In the code above, we use the "wooosh" sound to show that the game has started. We also add the text "EAT ALL" along with the "bomb" sprites at the center of the screen, to show players which sprites to consume in the game.

Using the `wait()` function, we let the program wait 1.5 seconds while displaying this start scene before it goes to the game scene and lets us start playing.

## Main Game Scene

Games usually run in a loop where each iteration of the loop, all components are updated to show any changes to their state.

The code in this section will all be written inside the main scene of the game.
Let's add a few constants for the movement of the sprites in the game, add the following code below the `for  loop()`:

```javascript
scene("game", () => {

	const SPEED_MIN = 120
	const SPEED_MAX = 540
```
In the code above, the `scene()` function is the one where most of the code for the main game loop will be placed.

Now add the following code below the speed variables to create an object that will hold the sprite of our player:

```javascript

	const player = add([
		sprite("bean"),
		pos(40, 20),
		area({ scale: 0.5 }),
		origin("center"),
	])
```
The `scale()` function in the code above increases the size of the sprite. `pos()` and `origin()` allows us to set the player's starting position when the game starts.

Let's add a function `scoreLabel()` below the player object to count the score.

```javascript
	let score = 0

	const scoreLabel = add([
		text(score, 32),
		pos(12, 12),
	])
```
To make our player move according to the the mouse position on the game screen, add the following code below `scoreLabel()`:

```javascript
	player.onUpdate(() => {
		player.pos = mousePos()
	})
```
Now that we've implemented our player's movement. Let's add food to the game screen. We have to make sure our player can only eat the "bomb" sprites and if they eat any other sprite they lose the game.

Add the following code below the previous `onUpdate()` function:

```javascript

	player.onCollide("bomb", (bomb) => {
		addKaboom(player.pos)
		score += 1
		destroy(bomb)
		scoreLabel.text = score
		burp()
		shake(12)
	})
 
player.onCollide("fruit", (fruit) => {
		go("lose", score)
		play("hit")
	})

```
In the code above, we implemented what happens when the player collides with the "bomb" sprites. `addKaboom()` function will add the kaboom icon when the player eats a bomb. The `score` variable will increment the score each time player eats a bomb. `destroy()` will remove the sprite from the game screen as the player would have eaten it. `burp()` will make create the burp sound and `shake()` will shake the player sprite which is a cool effect to add.

Using the `go()`, we've implemented that if the player eats other fruits, the "main" scene will end and the "lose" scene will begin to show that the player has lost the game. We're yet to implement the "lose" scene.

Add the following code below the `onCollide()` to keep adding fruit and bomb sprites that keep moving towards the left edge of the screen:
```javascript

  	onUpdate("bomb", (bomb) => {
		if (bomb.pos.x <= 0) {
			go("lose", score)
			play("hit")
			addKaboom(bomb.pos)
		}
	})
  
	onUpdate("food", (food) => {
		food.move(-food.speed, 0)
		if (food.pos.x < -120) {
			destroy(food)
		}
	})

```
In the code above, we update the game such that when fruit sprites reach the edge of the game screen they are destroyed but if the bomb sprite reaches the edge, the player loses the game.

Let's create a loop function to spawn fruit sprites for as long as the "main" scene is still active.

```javascript
loop(0.3, () => {

		const x = width() + 24
		const y = rand(0, height())
		const speed = rand(SPEED_MIN, SPEED_MAX)
		const isBomb = chance(0.5)
		const spriteName = isBomb ? "bomb" : choose(fruits)

		add([
			sprite(spriteName),
			pos(x, y),
			area({ scale: 0.5 }),
			origin("center"),
			"food",
			isBomb ? "bomb" : "fruit",
			{ speed: speed }
		])

	})

})
```

Inside the `loop()` function, we create constants `x` and `y` to spawn new fruits at random `y`/ horizontal positions on the right edge of the screen. The speed the fruits move at will be a random value between the min and max speed variables we created towards the beginning of the tutorial.

The `spriteName` variable will check whether the current sprite is a "bomb" or "fruit" sprite.

## Losing Scene

This scene will be active only when a player collides with the fruit sprites or one of the "bomb" sprites reaches the left edge of the game screen. The code in this section will all be placed inside the "lose" scene function.

Once the player loses, the player sprite along with the score will be displayed on the screen, ad the following code below the closing bracket of the "main" scene to show this implementation:

```javascript
scene("lose", (score) => {

	add([
		sprite("bean"),
		pos(width() / 2, height() / 2 - 108),
		scale(3),
		origin("center"),
	])

	
	add([
		text(score),
		pos(width() / 2, height() / 2 + 108),
		scale(3),
		origin("center"),
	])
```
In the code above, we've implemented that the player and the score be displayed in the center of the game screen.

Once the player has lost, we need to go back to the starting scene where they can press the any key or the "space" button to restart the game. Add the following code:

```javascript
	onKeyPress("space", () => go("start"))
	onClick(() => go("start"))

})
```
Outside the "lose" scene function, add the following code:

```javascript
go("start")

```
This will display the "start" scene displayed before the game starts.

### Things to try:

* Create a mock Pacman game where enemy sprites chase you until you consume food, at which point you have few seconds to consume those enemy sprites.

Try out the embedded repl below:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/eatbomb?embed=true"></iframe>
