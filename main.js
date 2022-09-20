var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Events = Matter.Events,
    Bounds = Matter.Bounds,
    Vector = Matter.Vector,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies;

// create engine
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 850,
        showAngleIndicator: false,
        wireframes: false,
        background: '#789',
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
var offset = 10,
    options = { 
        isStatic: true,
        render: { fillStyle: '#00000033' }
    };

world.bodies = [];

// these static walls will not be rendered in this sprites example, see options
Composite.add(world, [
    Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, options),
    Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, options),
    Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, options),
    Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, options)
]);

// creat background
const scale = 1;
// const scale = 0.4;
// const scale = 40;
Composite.add(world, [
    Bodies.rectangle(0, 0, 100, 100, {
        isStatic: true,
        alwaysInView: true,
        label: 'bg',
        render: {
            zIndex: -10,
            sprite: {
                texture: './img/unnamed.jpg',
                // texture: './img/poster.svg',
                xScale: scale,
                yScale: scale,
            }
        },
    }),
]);


Events.on(render, "beforeRender", () => {
    moveCamera();
});

// have the "camera" follow the player with myId
function moveCamera() {
    // identify body with myId
    const me = stack.bodies[0];
    // console.log(me);
    if (!me) return;

    // compute render.postion i.e. center of viewport
    render.position = {
        x: (render.bounds.min.x + render.bounds.max.x) / 2,
        y: (render.bounds.min.y + render.bounds.max.y) / 2
    };

    // compute vector from render.position to player.position
    const delta = Vector.sub(me.position, render.position);

    if (Vector.magnitude(delta) < 1) return; // don't bother

    // on this update, only move camera 10% of the way
    Bounds.translate(render.bounds, Vector.mult(delta, 0.1));
}


var stack = Composites.stack(20, 20, 10, 4, 0, 0, function(x, y) {
    if (Common.random() > 0.35) {
        // const scale = 0.43;
        const scale = 1;
        return Bodies.rectangle(x, y, 64, 64, {
            render: {
                strokeStyle: '#ffffff',
                sprite: {
                    texture: './img/box.png',
                    xScale: scale,
                    yScale: scale,
                }
            }
        });
    } else {
        // const scale = 0.6;
        const scale = 1;
        return Bodies.circle(x, y, 46, {
            density: 0.0005,
            frictionAir: 0.06,
            restitution: 0.3,
            friction: 0.01,
            render: {
                sprite: {
                    texture: './img/ball.png',
                    xScale: scale,
                    yScale: scale,
                }
            }
        });
    }
});



Composite.add(world, stack);

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});
