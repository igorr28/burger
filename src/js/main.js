"use strict";

document.addEventListener("DOMContentLoaded", function () {

    //показать модальное меню
    const hamburger = document.querySelector('.hamburger__link');
    hamburger.addEventListener('click', function (e) {
        e.preventDefault();
        const menuModal = document.querySelector('.menu-modal');
        const menu = document.querySelector('.menu');
        document.body.style.overflow = 'hidden';
        menuModal.style.display = 'flex';
        menu.style.display = 'block';
    })

    //скрыть модальное меню    
    function closeMenuModal() {
        const menuModal = document.querySelector('.menu-modal');
        menuModal.style.display = '';
        document.body.style.overflow = '';
    }

    //скрыть модальное меню при клике на крестик
    const cross = document.querySelector('.menu-modal__cross');
    cross.addEventListener('click', closeMenuModal)


    //скрыть модальное меню при клике на ссылки
    const menuLink = document.querySelectorAll('.menu-modal .menu__link');
    console.log(menuLink);
    for (let i = 0; i < menuLink.length; i++) {
        menuLink[i].addEventListener('click', closeMenuModal);
        document.body.style.overflow = '';
    }

    //вертикальный аккордеон
    const accordionLink = document.querySelectorAll('.team .accordion__item');
    console.log(accordionLink);

    for (let i = 0; i < accordionLink.length; i++) {
        accordionLink[i].addEventListener('click', function (e) {
            e.preventDefault();

            //получить высоту контента аккордеона
            let accordionContent = this.children[1];
            accordionContent.style.height = accordionContent.scrollHeight + 'px';

            if (this.classList.contains('accordion__item--active')) {
                this.classList.remove('accordion__item--active');
                accordionContent.style.height = '';
            } else {
                for (let i = 0; i < accordionLink.length; i++) {
                    accordionLink[i].classList.remove('accordion__item--active');
                    accordionLink[i].children[1].style.height = '';
                }
                this.classList.add('accordion__item--active');
                accordionContent.style.height = accordionContent.scrollHeight + 'px';
            }
        })
    }

    //горизонтальный аккордеон
    const accordionLinkHorizontal = document.querySelectorAll('.menu-section .accordion__item');

    for (let i = 0; i < accordionLinkHorizontal.length; i++) {
        accordionLinkHorizontal[i].addEventListener('click', function (e) {
            e.preventDefault();
            //console.log(this);
            let accordionContentHorizontal = this.children[1];
            if (this.classList.contains('accordion__item--active')) {
                this.classList.remove('accordion__item--active');
                accordionContentHorizontal.style.width = '';
            } else {
                for (let i = 0; i < accordionLinkHorizontal.length; i++) {
                    accordionLinkHorizontal[i].classList.remove('accordion__item--active');
                    accordionLinkHorizontal[i].children[1].style.width = '';
                }
                this.classList.add('accordion__item--active');
                this.children[1].style.width = getWidthAccordion();
            }
        })
    }
    //получить ширину контента аккордеона, чтобы он раскрылся до края окна
    function getWidthAccordion() {
        let menuSection = document.querySelector('.menu-section');
        let accordionLinks = document.querySelectorAll('.menu-section .accordion__link');
        let widthAccordionLinks = 0;
        for (let i = 0; i < accordionLinks.length; i++) {
            widthAccordionLinks += accordionLinks[i].offsetWidth;
        }
        let widthAccordionContent = menuSection.offsetWidth - widthAccordionLinks + 'px';
        return widthAccordionContent;
    }

    //Slider

    const left = document.querySelector("#left");
    const right = document.querySelector("#right");
    const items = document.querySelector("#items");

    let count = items.children.length;
    let step = items.parentElement.offsetWidth;
    console.log('step', step);
    let minRight = 0;
    let maxRight = step * (count - 1);
    let currentRight = 0;

    for (let i = 0; i < items.children.length; i++) {
        items.children[i].style.width = step + 'px';
    }

    window.onresize = function () {
        items.style.width = items.parentElement.offsetWidth;
        step = items.parentElement.offsetWidth;
        maxRight = step * (count - 1);
        for (let i = 0; i < items.children.length; i++) {
            items.children[i].style.width = step + 'px';
            console.log('resize', items.children[i]);
        }
    }

    items.style.right = currentRight;

    right.addEventListener("click", function (e) {
        e.preventDefault();
        if (currentRight < maxRight) {
            currentRight += step;
            items.style.right = currentRight + "px";
        } else {
            currentRight = 0;
            items.style.right = currentRight + "px";
        }

    });

    left.addEventListener("click", function (e) {
        e.preventDefault();
        if (currentRight > minRight) {
            currentRight -= step;
            items.style.right = currentRight + "px";
        } else {
            currentRight = maxRight;
            items.style.right = currentRight + "px";
        }
    });

    //Форма заказа

    const submit = document.querySelector('.form__btn');
    const form = document.querySelector('.form');

    //    submit.addEventListener('click', function (e) {
    //        e.preventDefault();
    //        const xhr = new XMLHttpRequest();
    //        xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail');
    //        let formData = new FormData(form);
    //        console.log(xhr);
    //        formData.append('to', 'igorr28@yandex.ru');
    //        xhr.send(formData);
    //        console.log(xhr);
    //        xhr.onload = function (e) {
    //            if (xhr.status == 200) {
    //                
    //                out.value = JSON.parse(xhr.responseText).message;
    //            } else {
    //                out.value = "Error " + xhr.status;
    //            }
    //        };
    //    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let formData = new FormData(form);
        formData.append('to', 'igorr28@yandex.ru');

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail');
        //xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail/fail');
        xhr.send(formData);
        console.log(xhr);
        xhr.onload = function (e) {
            if (xhr.status == 200) {
                const overlayOrder = document.querySelector("#templateOrder");
                const successOverlay = createOverlay(overlayOrder.innerHTML);
                document.body.appendChild(successOverlay);
                const overlayBody = document.querySelector(".overlay-order__body");
                overlayBody.innerHTML = JSON.parse(xhr.responseText).message;
                document.body.style.overflow = 'hidden';
            } else {
                const overlayOrder = document.querySelector("#templateOrder");
                const successOverlay = createOverlay(overlayOrder.innerHTML);
                document.body.appendChild(successOverlay);
                const overlayBody = document.querySelector(".overlay-order__body");
                overlayBody.innerHTML = 'Произошла ошибка';
                document.body.style.overflow = 'hidden';
            }
        };
    });



    //Overlay
    const btnComments = document.querySelectorAll(".comments__btn");
    const btnComments480 = document.querySelectorAll(".comments__btn--480");
    const overlayComments = document.querySelector("#templateComments");
    const successOverlay = createOverlay(overlayComments.innerHTML);

    for (let i = 0; i < btnComments.length; i++) {
        btnComments[i].addEventListener('click', function () {
            document.body.appendChild(successOverlay);
            document.body.style.overflow = 'hidden';
            const overlayBody = document.querySelector(".overlay-comments__body");
            const overlayTitle = document.querySelector(".overlay-comments__title");
            overlayTitle.innerHTML = this.previousElementSibling.previousElementSibling.innerHTML;
            overlayBody.innerHTML = this.previousElementSibling.innerHTML;
        })
    }

    for (let i = 0; i < btnComments480.length; i++) {
        btnComments480[i].addEventListener('click', function () {
            document.body.appendChild(successOverlay);
            document.body.style.overflow = 'hidden';
            const overlayBody = document.querySelector(".overlay-comments__body");
            const overlayTitle = document.querySelector(".overlay-comments__title");
            overlayTitle.innerHTML = this.parentElement.children[0].innerHTML;
            overlayBody.innerHTML = this.parentElement.children[1].innerHTML;
        })
    }

    function createOverlay(content) {
        const overlayElement = document.createElement("div");
        overlayElement.classList.add("overlay");

        const template = document.querySelector("#overlayTemplate");
        overlayElement.innerHTML = template.innerHTML;

        const contentElement = overlayElement.querySelector(".overlay__container");
        console.log(contentElement);
        contentElement.innerHTML = content;

        const closeElement = overlayElement.querySelector(".overlay__close");
        closeElement.addEventListener("click", function (e) {
            e.preventDefault();
            document.body.style.overflow = '';
            document.body.removeChild(overlayElement);
        });
        return overlayElement;
    }

    //яндекс-карта

    ymaps.ready(init);



    function init() {
        var myMap = new ymaps.Map("map", {
            center: [47.20890821, 39.70983960],
            zoom: 12,
            controls: ['zoomControl'],
            behaviors: ['drag']
        });

        var myPlacemark = new ymaps.Placemark([47.20030218, 39.69735016], {
            hintContent: 'г. Ростов-на-Дону, 1-я Луговая, 8'
        }, {

            iconLayout: 'default#image',
            iconImageHref: './img/map/mapmarker.svg',
            iconImageSize: [46, 57],
            iconImageOffset: [-23, -57]
        });

        var myPlacemark2 = new ymaps.Placemark([47.21734337, 39.70017929], {
            hintContent: 'г. Ростов-на-Дону, 1-я Луговая, 7'
        }, {
            iconLayout: 'default#image',
            iconImageHref: './img/map/mapmarker.svg',
            iconImageSize: [46, 57],
            iconImageOffset: [-5, -38]
        });

        var myPlacemark3 = new ymaps.Placemark([47.21489378, 39.77152821], {
            hintContent: 'г. Ростов-на-Дону, 1-я Луговая, 7'
        }, {
            iconLayout: 'default#image',
            iconImageHref: './img/map/mapmarker.svg',
            iconImageSize: [46, 57],
            iconImageOffset: [-5, -38]
        });

        var myPlacemark4 = new ymaps.Placemark([47.24890822, 39.74629175], {
            hintContent: 'г. Ростов-на-Дону, 1-я Луговая, 7'
        }, {
            iconLayout: 'default#image',
            iconImageHref: './img/map/mapmarker.svg',
            iconImageSize: [46, 57],
            iconImageOffset: [0, 0]
        });

        myMap.geoObjects
            .add(myPlacemark)
            .add(myPlacemark2)
            .add(myPlacemark3)
            .add(myPlacemark4);

    }

    // one-page-scroll

    $(".main").onepage_scroll({
        sectionContainer: "section", // sectionContainer accepts any kind of selector in case you don't want to use section
        easing: "ease", // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",
        // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
        animationTime: 1000, // AnimationTime let you define how long each section takes to animate
        pagination: true, // You can either show or hide the pagination. Toggle true for show, false for hide.
        updateURL: false, // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
        beforeMove: function (index) {}, // This option accepts a callback function. The function will be called before the page moves.
        afterMove: function (index) {}, // This option accepts a callback function. The function will be called after the page moves.
        loop: false, // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
        keyboard: true, // You can activate the keyboard controls
        responsiveFallback: false, // You can fallback to normal page scroll by defining the width of the browser in which
        // you want the responsive fallback to be triggered. For example, set this to 600 and whenever
        // the browser's width is less than 600, the fallback will kick in.
        direction: "vertical" // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".  
    });

    // html5 api

    let video = document.querySelector('video');
    let playBtn = document.querySelector('.player__start-btn');
    let pauseBtn = document.querySelector('.player__pause-btn');
    let playBtnOver = document.querySelector('.player__vid-over');
    let currentInput = document.querySelector('.player__playback-track');
    let volumeRange = document.querySelector('.player__volume-track');
    let volumeMute = document.querySelector('.player__volume-btn');


    //currentInput.value = 0;
    let videoEnded = false;
    let videoPaused = false;


    video.addEventListener('canplaythrough', function () {
        video.volume = volumeRange.value;
        currentInput.value = 0;
    });

    //обработка окончания видео
    video.addEventListener('ended', function () {
        videoEnded = true;
        currentInput.value = 0;
        playBtn.style.display = '';
        playBtnOver.style.display = '';
        pauseBtn.style.display = '';
    });

    video.addEventListener('pause', function () {
        videoPaused = true;
    });

    // проиграть видео
    function playVid(e) {
        e.preventDefault();
        video.play();
        playBtn.style.display = 'none';
        playBtnOver.style.display = 'none';
        pauseBtn.style.display = 'flex';
        getCurrentRange();
        videoPaused = false;
    }

    playBtn.addEventListener('click', playVid);
    playBtnOver.addEventListener('click', playVid);

    // пауза
    pauseBtn.addEventListener('click', function (e) {
        e.preventDefault();
        video.pause();
        playBtn.style.display = '';
        playBtnOver.style.display = '';
        pauseBtn.style.display = '';
    });

    // регулировака громкости
    volumeRange.addEventListener('input', function () {
        video.volume = volumeRange.value;
    });

    //текущая позиция видео
    function getCurrentRange() {
        let timerId = setInterval(function () {
            if (!videoPaused && !videoEnded) {
                currentInput.value = (video.currentTime / video.duration) * 100;
            } else {
                clearInterval(timerId);
            }
        }, 1000);
    }


})
