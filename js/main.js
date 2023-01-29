let sections = document.querySelectorAll('.page');

function landing_next(cur, next) {
    let cur_elm = sections[cur];
    let next_elm = sections[next];

    cur_elm.classList.add('animate__animated animate__slideOutUp');
    next_elm.classList.add('animate__animated animate__slideInUp');
}