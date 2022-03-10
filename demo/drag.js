// Drag & drop interaction

kaboom()

loadSprite("bean", "/sprites/bean.png")

// Keep track of the current draggin item
let curDraggin = null

// A custom component for handling drag & drop behavior
function drag() {

	// The displacement between object pos and mouse pos
	let offset = vec2(0)

	return {
		// Name of the component
		id: "drag",
		// This component requires the "pos" and "area" component to work
		require: [ "pos", "area" ],
		pick() {
			// Set the current global dragged object to this
			curDraggin = this
			offset = mousePos().sub(this.pos)
			// Remove the object and re-add it, so it'll be drawn on top
			readd(this)
		},
		// "update" is a lifecycle method gets called every frame the obj is in scene
		update() {
			if (curDraggin === this) {
				setCursor("move")
				this.pos = mousePos().sub(offset)
			}
		},
	}

}

// Reset cursor to default at frame start for easier cursor management
onUpdate(() => setCursor("default"))

// Add dragable objects
for (let i = 0; i < 48; i++) {
	add([
		sprite("bean"),
		pos(rand(width()), rand(height())),
		area({ cursor: "pointer" }),
		scale(5),
		origin("center"),
		// using our custom component here
		drag(),
		i !== 0 ? color(255, 255, 255) : color(255, 0, 255),
		"bean",
	])
}

// Check if someone is picked
onMousePress(() => {
	if (curDraggin) {
		return
	}
	// Loop all "bean"s in reverse, so we pick the topmost one
	for (const obj of get("bean").reverse()) {
		// If mouse is pressed and mouse position is inside, we pick
		if (obj.isHovering()) {
			obj.pick()
			break
		}
	}
})

// Drop whatever is dragged on mouse release
onMouseRelease(() => {
	curDraggin = null
})
