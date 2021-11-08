// Kaboom as pure rendering lib (no component / game obj etc.)

kaboom({ scale: 4, })
loadSprite("bean", "/sprites/bean.png")

const a1 = add([
	sprite("bean"),
	pos(120),
	rotate(123),
	origin("center"),
	area(),
	"test",
	{
		update() {
			this.angle += dt() * 16
		}
	}
])

const a2 = add([
	rect(40, 20),
	pos(120),
	rotate(0),
	origin("center"),
	area(),
	"test",
	{
		update() {
// 			this.angle += dt() * 16
			this.pos = mousePos()
		}
	}
])

onUpdate(() => {
	if (a1.isColliding(a2)) {
		debug.log(time())
	}
})

// camPos(120, 120)
