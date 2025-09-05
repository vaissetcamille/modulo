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

///
