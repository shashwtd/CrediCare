
const cursor = document.querySelector('.cursor');
const cursor_dot = document.querySelector('.cursor-dot');
const cursorGrowElements = document.querySelectorAll('.cursor-grow');
const cursorHideElements = document.querySelectorAll('.cursor-hide');

let cursorX = 0;
let cursorY = 0;
let posX = 0;
let posY = 0;
let followSpeed = .12;

if ('ontouchstart' in window) {
    cursor_dot.style.display = 'none';
    cursor.style.display = 'none';
}

window.addEventListener('mousemove', function (e) {
    posX = e.clientX;
    posY = e.clientY;
});

function interpolate__(start, end, amount) {
    return (1 - amount) * start + amount * end
}

function loop() {
    cursorX = interpolate__(cursorX, posX, followSpeed);
    cursorY = interpolate__(cursorY, posY, followSpeed);
    cursor.style.top = cursorY + 'px';
    cursor.style.left = cursorX + 'px';
    cursor_dot.style.top = cursorY + 'px';
    cursor_dot.style.left = cursorX + 'px';
    requestAnimationFrame(loop);
}

function disappear_cursor() {
    gsap.to(cursor, { opacity: 0, duration: 0.2 });
    gsap.to(cursor_dot, { opacity: 0, duration: 0.2 });
}

function show_cursor() {
    gsap.to(cursor, { opacity: 1, duration: 0.1 });
    gsap.to(cursor_dot, { opacity: 1, duration: 0.2 });
}

loop();

let startY;
let endY;
let clicked = false;

function mousedown(e) {
    gsap.to(cursor, { scale: 1.8, duration: 0.1 });

    clicked = true;
    startY = e.clientY || e.touches[0].clientY || e.targetTouches[0].clientY;
}
function mouseup(e) {
    gsap.to(cursor, { scale: 1, duration: 0.2 });

    endY = e.clientY || endY;
    if (clicked && startY && Math.abs(startY - endY) >= 40) {
        go(!Math.min(0, startY - endY) ? 1 : -1);
        clicked = false;
        startY = null;
        endY = null;
    }
}
window.addEventListener('mousedown', mousedown, false);
window.addEventListener('touchstart', mousedown, false);
window.addEventListener('touchmove', function (e) {
    if (clicked) {
        endY = e.touches[0].clientY || e.targetTouches[0].clientY;
    }
}, false);
window.addEventListener('touchend', mouseup, false);
window.addEventListener('mouseup', mouseup, false);

document.onmouseleave = disappear_cursor;
document.onmouseenter = show_cursor;

cursorGrowElements.forEach(el => {
    el.addEventListener('mouseover', () => {
        // Instant change 
        gsap.to(cursor, { opacity: 0, duration: 0.2 });
        gsap.to(cursor_dot, { scale: 20, duration: 0.2 });
    });
    el.addEventListener('mouseout', () => {
        gsap.to(cursor, { opacity: 1, duration: 0});
        gsap.to(cursor_dot, { scale: 1, duration: 0.2 });
    });
});

cursorHideElements.forEach(el => {
    el.addEventListener('mouseover', () => {
        // Instant change 
        gsap.to(cursor, { opacity: 0, duration: 0 });
        gsap.to(cursor_dot, { opacity: 0, duration: 0.2 });
    });
    el.addEventListener('mouseout', () => {
        gsap.to(cursor, { opacity: 1, duration: 0 });
        gsap.to(cursor_dot, { opacity: 1, duration: 0.2 });
    });
});