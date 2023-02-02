const theme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark';
const lottieElms = $('.lottie-elm');
const lottieInstances = {};
var isNavAnimating = false;

lottieElms.each(function () {
    const lottieElm = $(this);
    const lottieName = lottieElm.data('lottieName');
    var lottiePath = `/res/lottie/${lottieName}_${theme}.json`;

    if (lottieName.endsWith('_')) {
        lottiePath = `/res/lottie/${lottieName}.json`;
    }

    $.getJSON(lottiePath)
        .done(function (lottieData) {
            const lottieInstance = lottie.loadAnimation({
                container: lottieElm[0],
                renderer: 'svg',
                // loop if attribute is set to true
                loop: false,
                autoplay: false,
                animationData: lottieData,
                speed: 4
            });
            lottieInstances[lottieName] = lottieInstance;
        })
        .fail(function (error) {
            console.error(error);
        });
});

// When menu button is clicked
var menuToggled = true;
var menuBtn = $("#menu-btn");
menuBtn.click(function () {
    if (isNavAnimating) return;
    isNavAnimating = true;
    const menuBtnAnim = lottieInstances['hamburger'];
    if (menuToggled) {
        isNavAnimating = true;
        menuBtnAnim.playSegments([0, 39], true);
        menuToggled = false;

        $(".menu").css("display", "flex");
        gsap.to(".menu", {
            duration: 0.5,
            opacity: "1",
            ease: "power4.out",
            onComplete: function () {
                $(".menu").addClass("menu-open");
                isNavAnimating = false;
                gsap.to(".menu-container", {
                    opacity: 1, duration: 0.5, onComplete: function () {
                    }
                });
                gsap.to('.menu-separator', {
                    duration: 0.5,
                    transform: "scaleX(1)",
                    ease: "power4.out",
                });
            },
        });

        gsap.to(".nav .landing-text", {
            duration: 0.5,
            transform: "translate(40px, 40px)",
            ease: "power4.out",
            onStart: function () {
                $(".nav .landing-text").addClass("no-bg");
            }
        });
        gsap.to('.nav .options', {
            duration: 0.5,
            transform: "translate(-60px, 40px)",
            ease: "power4.out",
            onStart: function () {
                $(".nav .options").addClass("no-bg");
            }
        });


    } else {
        menuToggled = true;

        gsap.to('.menu-separator', {
            duration: 0.5,
            transform: "scaleX(0)",
            ease: "power4.out",
            onComplete: function () {
                gsap.to('.nav .options', {
                    duration: 0.5,
                    transform: "translate(0, 0)",
                    ease: "power4.out",
                    onComplete: function () {
                        $(".nav .options").removeClass("no-bg");
                    },
                });

                gsap.to(".nav .landing-text", {
                    duration: 0.5,
                    transform: "translate(0px, 0px)",
                    ease: "power4.out",
                    onComplete: function () {
                        $(".menu").removeClass("menu-open");
                        $(".nav .landing-text").removeClass("no-bg");
                    },
                });

                gsap.to(".menu-container", { opacity: 0, duration: 0.5 });
                gsap.to(".menu", {
                    delay: 0.5,
                    opacity: 0,
                    ease: "power4.out",
                    onComplete: function () {
                        $(".menu").css("display", "none");
                        isNavAnimating = false;
                    },
                });
                menuBtnAnim.playSegments([39, 78], true);
            }
        });
    }
});


// parallax effect
var landing_img = document.getElementById("landing-img");
var trust_title = document.getElementById("trust-title");


$(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll > 50 && scroll <= 200 ) {
        $("#navbar").css("--nav-opacity", scroll/150);
    } else if (scroll > 200) {
        $("#navbar").css("--nav-opacity", 1);
    } else if (scroll <= 100) {
        $("#navbar").css("--nav-opacity", 0);
    }

    // zoom parallax
    landing_img.style.transform = "scale(" + (1 + scroll / 1000) + ")";
});




// Event listeners
$("#learnMore").click(function () {
    $('html, body').animate({
        scrollTop: $("#trust").offset().top
    }, 500);
});