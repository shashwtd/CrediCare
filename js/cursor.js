var cursor = document.getElementById("cursor");
var amount = 20;
var sineDots = Math.floor(amount * 0.3);
var width = 26;
var idleTimeout = 150;
let lastFrame = 0;
let dots = [];
let timeoutID;
let idle = false;

let grown = false;
var cursorScale = 16;

let startY;
let endY;
let clicked = false;

let pos = { x: 0, y: 0 };
var cursorGrowElements = document.querySelectorAll('.cursor-grow');
var cursorHideElements = document.querySelectorAll('.cursor-hide');

var isHidden = false;


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
        cursor.appendChild(this.element);
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





var render = timestamp => {
    var delta = timestamp - lastFrame;
    positionCursor(delta);
    lastFrame = timestamp;
    requestAnimationFrame(render);
};

var positionCursor = delta => {
    let x = pos.x;
    let y = pos.y;
    dots.forEach((dot, index, dots) => {
        let nextDot = dots[index + 1] || dots[0];
        dot.x = x;
        dot.y = y;
        dot.draw(delta);
        if (!idle || index <= sineDots) {
            var dx = (nextDot.x - dot.x) * 0.35;
            var dy = (nextDot.y - dot.y) * 0.35;
            x += dx;
            y += dy;
        }
    });
};

cursorHideElements.forEach(el => {
    if (el.classList.contains('cdox')) {
        return;
    }
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { opacity: 0, duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
    });
    return;
});

var enableCursor = () => {
    cursor.style.display = 'block';
}


// =================START========================


const start_cursor = () => {
    
    buildDots();
    render();
    enableCursor();

}

window.onload = () => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener('touchmove', function (e) {
        return onTouchMove();
    }, false);

    document.onmouseenter = show_cursor;
    document.onmouseleave = disappear_cursor;
}

var onMouseMove = event => {
    pos.x = event.clientX - width / 2;
    pos.y = event.clientY - width / 2;
    resetIdleTimer();
    return;
};

var onTouchMove = () => {
    pos.x = event.touches[0].clientX - width / 2;
    pos.y = event.touches[0].clientY - width / 2;
    resetIdleTimer();
    return;
};


function buildDots() {
    for (let i = 0; i < amount; i++) {
        let dot = new Dot(i);
        dots.push(dot);
    }
}

function disappear_cursor() {
    return gsap.to(cursor, { opacity: 0, duration: 0.2 });
}

function show_cursor() {
    return gsap.to(cursor, { opacity: 1, duration: 0.2 });
}

