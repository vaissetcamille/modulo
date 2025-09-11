/// TIMELINE-V1
const container = document.querySelector('.timeline-v1 .items');
if (container) {
    let current = container.scrollLeft;
    let target = container.scrollLeft;
    let isRunning = false;

    const speed = 3; // facteur de vitesse
    const ease = 0.1; // easing

    function raf() {
        current += (target - current) * ease;
        container.scrollLeft = current;

        if (Math.abs(target - current) > 0.5) {
            requestAnimationFrame(raf);
        } else {
            isRunning = false;
        }
    }

    container.addEventListener('wheel', (e) => {
        e.preventDefault(); // empêche le scroll vertical classique

        // synchronisation avant chaque scroll
        current = container.scrollLeft;
        target = container.scrollLeft + e.deltaY * speed;

        if (!isRunning) {
            isRunning = true;
            requestAnimationFrame(raf);
        }
    }, { passive: false });
}


/// BTN-V5
document.querySelectorAll('.button').forEach(btn => {
    const cs = getComputedStyle(btn);

    // Vérifie si le mixin est appliqué
    if (!cs.getPropertyValue('--btn-v5').trim() || btn.dataset.v5) return;
    btn.dataset.v5 = '1';

    // Récupère le texte + préserve les éléments (<i>, <span>…)
    const textParts = [], preserved = [];
    btn.childNodes.forEach(n => {
        if (n.nodeType === 3) {
            const t = n.textContent.trim();
            if (t) textParts.push(t);
        } else if (n.nodeType === 1) {
            preserved.push(n);
        }
    });

    const text = textParts.join(' ');
    if (!text) return;

    // Reconstruit le contenu
    btn.textContent = '';
    preserved.forEach(el => btn.appendChild(el));
    btn.insertAdjacentHTML('beforeend',
        `<div class="text">${text}</div><div class="marquee">${text}</div>`
    );

    // Injecte le spacing dynamique
    const spacing = cs.getPropertyValue('--btn-v5-spacing').trim() || '10rem';
    btn.querySelector('.marquee').style.cssText =
        `--spacing:${spacing};--start:0;--end:${spacing}`;
});


/// BTN-V6
document.querySelectorAll('.button').forEach(btn => {
    const cs = getComputedStyle(btn);

    // Vérifie si le mixin est appliqué
    if (!cs.getPropertyValue('--font-size').trim() || btn.dataset.v6) return;
    btn.dataset.v6 = '1';

    const text = btn.textContent.trim();
    if (!text) return;

    // Découpe chaque caractère en <span>, préserve les espaces
    const spans = text.split('').map(ch =>
        ch === ' ' ? '<span>&nbsp;</span>' : `<span>${ch}</span>`
    ).join('');

    // Reconstruit le bouton
    btn.innerHTML = `<div>${spans}</div>`;
});


/// CONTACT PRIVACY
$('span.privacy').click(function (e) {
    e.preventDefault();
    $(this).closest('form').find('#privacy').slideToggle();
});


/// SPINNING CIRCLE
$(function() {
    $(".spinning .circle").each(function() {
        const $circle = $(this);
        const radius = $circle.width() / 2;
        const $inner = $circle.children(".inner");
        const $textElement = $inner.find(".ed-element h4");

        // ⚡ On ajoute un espace insécable si pas déjà présent
        let text = $textElement.text().trim();
        if (!text.endsWith("\u00A0")) {
            text += "\u00A0"; // équivalent de &nbsp;
        }

        const characters = text.split("");
        const deltaAngle = 360 / characters.length;
        let currentAngle = -90;

        // On supprime uniquement les spans (pas le h4)
        $inner.find("span").remove();

        characters.forEach(function(char, index) {
            const $span = $("<span>").text(char);
            const xPos = radius * (1 + Math.cos((currentAngle * Math.PI) / 180));
            const yPos = radius * (1 + Math.sin((currentAngle * Math.PI) / 180));
            const rotate = `rotate(${(index * deltaAngle)}deg)`;
            $span.css("transform", `translate(${xPos}px, ${yPos}px) ${rotate}`);
            $inner.append($span);
            currentAngle += deltaAngle;
        });
    });
});


/// ACTIVITY SPINNING TEXT
$(function() {
    $(".activity-spinning-text").each(function() {
        const $card = $(this);
        const $spinning = $card.find(".spinning");

        $card.on("mousemove", function(e) {
            const rect = $card[0].getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // plus sensible
            const moveX = (x - rect.width / 2) / 6;
            const moveY = (y - rect.height / 2) / 6;

            // ⚡️ pas de scale ici, juste déplacement
            $spinning.css("transform", `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(0.9)`);
        });

        $card.on("mouseleave", function() {
            // reset au centre avec le scale visible
            $spinning.css("transform", "translate(-50%, -50%) scale(0.9)");
        });
    });
});


/// ACTIVITY FLOAT IMAGE
$(function () {
    const $floating = $(".activity-float-image .floating-image");

    let targetX = 0, targetY = 0;     // position cible (souris)
    let currentX = 0, currentY = 0;   // position affichée (flottante)
    const speed = 0.12;               // vitesse du rattrapage (0.05 = très lent, 0.3 = rapide)

    function animate() {
        // interpolation pour effet fluide
        currentX += (targetX - currentX) * speed;
        currentY += (targetY - currentY) * speed;

        $floating.css({
            top: currentY + "px",
            left: currentX + "px"
        });

        requestAnimationFrame(animate);
    }
    animate();

    $(".activity-float-image .card").on("mouseenter", function () {
        // Récupération du background-image
        let bgImage = $(this).find(".background .ed-image .background-image-holder").css("background-image");

        if (bgImage && bgImage !== "none") {
            // Nettoyer l'URL extraite de css('background-image')
            let imgSrc = bgImage.replace(/^url\(["']?(.+?)["']?\)$/, "$1");

            $floating.html(`<img src="${imgSrc}" alt="">`).stop(true, true).fadeIn(150);
        }
    });

    $(".activity-float-image .card").on("mouseleave", function () {
        $floating.stop(true, true).fadeOut(150);
    });

    $(".activity-float-image .card").on("mousemove", function (e) {
        const $img = $floating.find("img");
        const imgHeight = $img.height() || 0;

        // on définit la position cible
        targetX = e.clientX + 20;
        targetY = e.clientY - imgHeight / 2;
    });
});


/// PRICE FLOAT IMAGE
$(function () {
    const $floating = $(".price-float-image .floating-image");

    let targetX = 0, targetY = 0;     // position cible (souris)
    let currentX = 0, currentY = 0;   // position affichée (flottante)
    const speed = 0.12;               // vitesse du rattrapage (0.05 = très lent, 0.3 = rapide)

    function animate() {
        // interpolation pour effet fluide
        currentX += (targetX - currentX) * speed;
        currentY += (targetY - currentY) * speed;

        $floating.css({
            top: currentY + "px",
            left: currentX + "px"
        });

        requestAnimationFrame(animate);
    }
    animate();

    $(".price-float-image .card").on("mouseenter", function () {
        // Récupération du background-image
        let bgImage = $(this).find(".background .ed-image .background-image-holder").css("background-image");

        if (bgImage && bgImage !== "none") {
            // Nettoyer l'URL extraite de css('background-image')
            let imgSrc = bgImage.replace(/^url\(["']?(.+?)["']?\)$/, "$1");

            $floating.html(`<img src="${imgSrc}" alt="">`).stop(true, true).fadeIn(150);
        }
    });

    $(".price-float-image .card").on("mouseleave", function () {
        $floating.stop(true, true).fadeOut(150);
    });

    $(".price-float-image .card").on("mousemove", function (e) {
        const $img = $floating.find("img");
        const imgHeight = $img.height() || 0;

        // on définit la position cible
        targetX = e.clientX + 20;
        targetY = e.clientY - imgHeight / 2;
    });
});
