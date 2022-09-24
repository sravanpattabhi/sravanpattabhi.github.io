    let header = document.querySelector('header');
    let menu = document.querySelector('#menu-icon');
    let navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        header.classList.toggle('shadow', window.scrollY > 0);
    });

    menu.onclick = () => {
        navbar.classList.toggle('active');
    }
    window.onscroll = () => {
        navbar.classList.remove('active');
    }

    const circle = document.getElementById('circle-svg');
    circle.onclick = () => {
        if (circle.animationsPaused()) {
            circle.unpauseAnimations();
        }
        else {
            circle.pauseAnimations();
        }
    };

    const rect = document.getElementById('rectangle-svg');
    rect.onclick = () => {
        if (rect.animationsPaused()) {
            rect.unpauseAnimations();
        }
        else {
            rect.pauseAnimations();
        }
    };

    const polygon = document.getElementById('polygon-svg');
    polygon.onclick = () => {
        if (polygon.animationsPaused()) {
            polygon.unpauseAnimations();
        }
        else {
            polygon.pauseAnimations();
        }
    };
