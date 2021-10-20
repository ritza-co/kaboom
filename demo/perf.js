kaboom();

const t1 = performance.now();

for (let i = 0; i < 100000; i++) {
	vec2(10, 20);
}

const t2 = performance.now();

add([
	text(t2 - t1),
]);
