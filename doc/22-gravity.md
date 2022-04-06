# Creating Gravity Effect with Kaboom

In this tutorial, we're going to learn how to create the gravity effect for game objects. You can find the code we use at this [link](https://replit.com/@ritza/gravity) or in the embedded code at the end of this tutorial.

# Getting started with the code

The first thing we want to do is load the `kaboom()` library and initialize a Kaboom context. 

```
import kaboom from "kaboom";

kaboom();
```

Next, we're going to load the assets we'll be using during the game. In this case, our player sprite, Bean.

```
loadSprite("bean", "/sprites/bean.png")
```

## The gravity function

`gravity()` allows us to pull the character towards the bottom of the game screen. When we give characters the `body()` component, we're giving them a "physical body" with the ability to react to gravity in the game. 

```
const player = add([
	sprite("bean"),
	pos(center()),
	area(),
	body(),
])
```

We can alter the acceleration of the gravitational pull by passing the number of pixels we want our character to move per second into `gravity()`, for example 

```
gravity(30)
```

where 30 is the number of pixels a character would accelerate per second, towards the source of gravity. The higher this value is, the faster a character would move.

Another fun example would be to simulate the force of gravity which is 9.82m/s<sup>2</sup>. 

```
gravity(9.82**2)
```

Keep in mind, converting the actual value of the force of gravity to pixels would be a fairly large number and 9.82 would be passed as pixels and our characters would move entirely too slow. Thus, adding the exponent 2 will create a fairly acceptable acceleration rate.

Next, we want to add a platform for the player to land on to simulate the "ground". The `solid()` component prevents other solid components from passing through.

```
add([
	rect(width(), 48),
	outline(4),
	area(),
	pos(0, height() - 48),
	solid(),
])
```

`.onGround()` is provided by `body()`. It registers an event that runs whenever player hits the ground. We simply want to output a message via the log.

```
player.onGround(() => {
	debug.log("ouch")
})
```

We can get the player to jump by pressing the 'space' key once it has landed on the ground. `isGrounded()` and `jump()` are provided by `body()`. Check out https://kaboomjs.com#BodyComp for everything `body()` provides.

```
onKeyPress("space", () => {
	if (player.isGrounded()) {
		player.jump()
	}
})
```

# Things to try

Check out https://kaboomjs.com/ for more information on Kaboom. 

* You can try to reverse the gravity in the game and make your player gravitate upwards.

* You can take a look at the repl below:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/gravity?embed=true"></iframe>
