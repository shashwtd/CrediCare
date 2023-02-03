const light_cursor = document.getElementById("cursor");
const amount = 20;
const sineDots = Math.floor(amount * 0.3);
const width = 26;
const idleTimeout = 150;
let lastFrame = 0;
let dots = [];
let timeoutID;
let idle = false;

const cursor = document.querySelector('.cursor');
const cursor_dot = document.querySelector('.cursor-dot');
let grown = false;
var cursorScale = 16;

let startY;
let endY;
let clicked = false;

let dark_cursor = false || Math.random() < 0.5;
let pos = { x: 0, y: 0 };
const cursorGrowElements = document.querySelectorAll('.cursor-grow');
const cursorHideElements = document.querySelectorAll('.cursor-hide');



class Dot {
    constructor(index = 0) {
        this.index = index;
        this.anglespeed = 0.05;
        this.x = 0;
        this.y = 0;
        this.scale = 1 - 0.05 * index;
        this.range = width / 2 - width / 2 * this.scale + 2;
        this.limit = width * 0.75 * this.scale;
        this.element = document.createElement("span");
        TweenMax.set(this.element, { scale: this.scale });
        light_cursor.appendChild(this.element);
    }

    lock() {
        this.lockX = this.x;
        this.lockY = this.y;
        this.angleX = Math.PI * 2 * Math.random();
        this.angleY = Math.PI * 2 * Math.random();
    }

    draw(delta) {
        if (!idle || this.index <= sineDots) {
            TweenMax.set(this.element, { x: this.x, y: this.y });
        } else {
            this.angleX += this.anglespeed;
            this.angleY += this.anglespeed;
            this.y = this.lockY + Math.sin(this.angleY) * this.range;
            this.x = this.lockX + Math.sin(this.angleX) * this.range;
            TweenMax.set(this.element, { x: this.x, y: this.y });
        }
    }
}

function startIdleTimer() {
    timeoutID = setTimeout(goInactive, idleTimeout);
    idle = false;
}

function resetIdleTimer() {
    clearTimeout(timeoutID);
    startIdleTimer();
}

function goInactive() {
    idle = true;
    for (let dot of dots) {
        dot.lock();
    }
}





const render = timestamp => {
    const delta = timestamp - lastFrame;
    positionCursor(delta);
    lastFrame = timestamp;
    requestAnimationFrame(render);
};

const positionCursor = delta => {
    let x = pos.x;
    let y = pos.y;
    dots.forEach((dot, index, dots) => {
        let nextDot = dots[index + 1] || dots[0];
        dot.x = x;
        dot.y = y;
        dot.draw(delta);
        if (!idle || index <= sineDots) {
            const dx = (nextDot.x - dot.x) * 0.35;
            const dy = (nextDot.y - dot.y) * 0.35;
            x += dx;
            y += dy;
        }
    });
};


function loop() {
    if (!dark_cursor) { return; }
    cursor.style.top = pos.y + 'px';
    cursor.style.left = pos.x + 'px';
    cursor_dot.style.top = pos.y + 'px';
    cursor_dot.style.left = pos.x + 'px';
    requestAnimationFrame(loop);
}

cursorGrowElements.forEach(el => {
    if (!dark_cursor) { return; }
    el.addEventListener('mouseenter', () => {
        grown = true;
        gsap.to(cursor, { opacity: 0, duration: 0.2 });
        gsap.to(cursor_dot, { scale: cursorScale, duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
        grown = false;
        gsap.to(cursor, { opacity: 1, duration: 0 });
        gsap.to(cursor_dot, { scale: 1, duration: 0.2 });
    });
});

cursorHideElements.forEach(el => {
    if (!dark_cursor) {
        if(el.classList.contains('cdox')) {
            return;
        }
        el.addEventListener('mouseenter', () => {
            gsap.to(light_cursor, { opacity: 0, duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(light_cursor, { opacity: 1, duration: 0.2 });
        });
        return;
    }

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

const disableDarkCursor = () => {
    if (!dark_cursor) {
        cursor.style.display = 'none';
        cursor_dot.style.display = 'none';
        light_cursor.style.display = 'block';

        document.getElementById("main").style.cursor = 'initial';
    }
}

const enableDarkCursor = () => {
    if(dark_cursor) {
        cursor.style.display = 'block';
        cursor_dot.style.display = 'block';

        light_cursor.style.display = 'none';
    }
}



// =================START========================

window.onload = () => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener('touchend', mouseup, false);
    window.addEventListener('mouseup', mouseup, false);
    window.addEventListener('mousedown', mousedown, false);
    window.addEventListener('touchstart', mousedown, false);
    window.addEventListener('touchmove', function (e) {
        if (!dark_cursor) { return onTouchMove(); }
        if (clicked) { endY = e.touches[0].clientY || e.targetTouches[0].clientY; }
    }, false);

    buildDots();
    render();
    loop();

    if (!dark_cursor) {disableDarkCursor();}
    else {enableDarkCursor();}

    document.onmouseenter = show_cursor;
    document.onmouseleave = disappear_cursor;
}

const onMouseMove = event => {
    if (!dark_cursor) {
        pos.x = event.clientX - width / 2;
        pos.y = event.clientY - width / 2;
        resetIdleTimer();
        return;
    }
    pos.x = event.clientX;
    pos.y = event.clientY;
};

const onTouchMove = () => {
    if (!dark_cursor) {
        pos.x = event.touches[0].clientX - width / 2;
        pos.y = event.touches[0].clientY - width / 2;
        resetIdleTimer();
        return;
    }
    pos.x = event.touches[0].clientX;
    pos.y = event.touches[0].clientY;
};


function mouseup(e) {
    if (!grown) {
        gsap.to(cursor, { scale: 1, duration: 0.1 });
    } else {
        gsap.to(cursor, { opacity: 0, duration: 0.2 });
        gsap.to(cursor_dot, { scale: 12, duration: 0.2 });
    }

    endY = e.clientY || endY;
    if (clicked && startY && Math.abs(startY - endY) >= 40) {
        go(!Math.min(0, startY - endY) ? 1 : -1);
        clicked = false;
        startY = null;
        endY = null;
    }
}

function mousedown(e) {
    if (!grown) {
        gsap.to(cursor, { scale: 1.8, duration: 0.1 });
    } else {
        gsap.to(cursor, { opacity: 0, duration: 0.2 });
        gsap.to(cursor_dot, { scale: cursorScale*1.4, duration: 0.1 });
    }

    clicked = true;
    startY = e.clientY || e.touches[0].clientY || e.targetTouches[0].clientY;
}

function buildDots() {
    for (let i = 0; i < amount; i++) {
        let dot = new Dot(i);
        dots.push(dot);
    }
}

function disappear_cursor() {
    if (!dark_cursor) {
        return gsap.to(light_cursor, { opacity: 0, duration: 0.2 });
    }
    gsap.to(cursor, { opacity: 0, duration: 0.2 });
    gsap.to(cursor_dot, { opacity: 0, duration: 0.2 });
}

function show_cursor() {
    if (!dark_cursor) {
        return gsap.to(light_cursor, { opacity: 1, duration: 0.2 });
    }
    gsap.to(cursor, { opacity: 1, duration: 0.1 });
    gsap.to(cursor_dot, { opacity: 1, duration: 0.2 });
}