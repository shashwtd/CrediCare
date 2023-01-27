hide_loader = (__callback=null) => {
    var loader = document.getElementById('loader-screen');
    loader.style.opacity = 0;
    setTimeout(() => {
        loader.style.display = 'none';
        if (__callback != null) __callback();
    }, 500);
}

show_loader = (__callback=null) => {
    var loader = document.getElementById('loader-screen');
    loader.style.display = 'flex';
    setTimeout(() => {
        loader.style.opacity = 1;
        if (__callback != null) __callback();
    }, 500);
}


window.onload = () => {
    hide_loader();
}