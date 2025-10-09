/// MODULO PRESENTATION
document.addEventListener("DOMContentLoaded", function() {

  var SCSS_URL   = "https://raw.githubusercontent.com/vaissetcamille/modulo/refs/heads/main/MODULO%20custom%20css.scss";
  var JS_URL     = "https://raw.githubusercontent.com/vaissetcamille/modulo/refs/heads/main/MODULO%20custom%20js.js";
  var PRESET_URL = "https://raw.githubusercontent.com/vaissetcamille/modulo/refs/heads/main/MODULO%20preset%20css.scss";

  function showCopied(text, message) {
    navigator.clipboard.writeText(text).then(() => {
      var overlay = document.createElement("div");
      overlay.className = "copied-overlay";
      overlay.textContent = message;
      document.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), 1200);
    });
  }

  // --- 🧠 Correction ici ---
  function copyScssBlock(selector) {
    fetch(SCSS_URL)
      .then(r => r.text())
      .then(scss => {
        var scssLower = scss.toLowerCase();
        var selectorLower = selector.toLowerCase();

        // Expression régulière pour trouver un commentaire /* .mot ... */
        // en ignorant tout ce qui est entre parenthèses.
        var regex = new RegExp(`/\\*\\s*` + selectorLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + `(?:\\s*\\([^)]*\\))?\\s*\\*/`, 'i');
        var match = scssLower.match(regex);
        if (!match) return;

        var startIndex = match.index;
        var nextCommentIndex = scssLower.indexOf("/*", startIndex + match[0].length);

        var block = nextCommentIndex === -1
          ? scss.substring(startIndex).trim()
          : scss.substring(startIndex, nextCommentIndex).trim();

        showCopied(block, "🎨 Copito CSS");
      });
  }
  // --- Fin de la correction ---

  function copyJsBlock(selector) {
    fetch(JS_URL)
      .then(r => r.text())
      .then(js => {
        var jsLower = js.toLowerCase();
        var selectorLower = selector.toLowerCase();
        var startIndex = jsLower.indexOf(selectorLower);
        if (startIndex === -1) return;
        var nextSep = jsLower.indexOf("///", startIndex + selectorLower.length);
        var block = nextSep === -1
          ? js.substring(startIndex).trim()
          : js.substring(startIndex, nextSep).trim();
        showCopied(block, "⚙️ Copito JS");
      });
  }

  function copyCssClass(selector) {
    fetch(PRESET_URL)
      .then(r => r.text())
      .then(css => {
        var cssLower = css.toLowerCase();
        var selectorLower = selector.toLowerCase();
        var startIndex = cssLower.indexOf(selectorLower);
        if (startIndex === -1) return;
        var i = startIndex;
        var open = 0, close = 0, foundStart = false;
        while (i < css.length) {
          if (css[i] === "{") { open++; foundStart = true; }
          else if (css[i] === "}") close++;
          if (foundStart && open > 0 && open === close) { i++; break; }
          i++;
        }
        var block = css.substring(startIndex, i).trim();
        showCopied(block, "🧩 Copito Preset");
      });
  }

  // Gestion des clics
  document.querySelectorAll(".label-container h2, .label-container h4, .label-container h5")
    .forEach(el => el.addEventListener("click", function() {
      var selector = el.textContent.trim();
      if (el.tagName.toLowerCase() === "h2") copyScssBlock(selector);
      if (el.tagName.toLowerCase() === "h4") copyJsBlock(selector);
      if (el.tagName.toLowerCase() === "h5") copyCssClass(selector);

      el.style.transform = "scale(0.8)";
      setTimeout(() => { el.style.transform = "scale(1)"; }, 150);
    }));

});
/// MODULO GALLERY PRESENTATION
$(function() {
    $('.ed-element.preset-filter-gallery-default.modulo-gallery').each(function() {
        var $instance = $(this),
            $images = $('.filter-gallery-container .ed-image', $instance),
            $imageContainer = $('.filter-gallery-container', $instance),
            $showAllBtn = $instance.find('.filter-gallery-trigger a[href="#default"]');

        // On force le bouton actif sur #default
        $instance.find('.filter-gallery-trigger a').removeClass('active');
        $showAllBtn.addClass('active');

        // On cache toutes les images sauf .filter-default
        $imageContainer.hide();
        $images.hide();
        $images.filter('.filter-default').show();
        $imageContainer.fadeIn(300);
    });
});



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



/// MENU V2
/* JS for preset "Menu V2" */
(function() {
	$(function() {
		$('.menu-wrapper').each(function() {
			initMenu($(this))
		});
	});

	// Make :active pseudo classes work on iOS
	document.addEventListener("touchstart", function() {}, false);

	const initMenu = function($menuWrapper) {
		const $body = $('body');
		const $menu = $('.ed-menu', $menuWrapper);
		const $menuLinks = $('a', $menu);
		const $menuTrigger = $('.menu-trigger', $menuWrapper);
		const $banner = $('.banner').first();

		const smoothScrollOffset = 20;

		// Set aria attributes
		$menuTrigger.attr({
				'aria-expanded': 'false',
				'aria-controls': $menu.attr('id'),
		});

		toggleClassOnClick($body.add($menu), $menuTrigger, null, 'open open-menu'); // Keep open on $menu for backward compatibility
		activateSmoothScroll($menuLinks.add($('.scroll a')), smoothScrollOffset);
		addClassOnVisibleLinkTargets($menuLinks, 'active', 2 / 3);
		handleSticky($menuWrapper, 'sticky', $banner);
	};

	/**
	 * Observe element's height changes and reload the initMenu() function
	 *
	 * @param {HTMLElement} elm Element to observe
	 * @param {function} callback to call when elmement's height changed
	 */
	const observeHeightChange = function(elm, callback) {
		if (!('ResizeObserver' in window) || elm == null) return;

		const ro = new ResizeObserver(callback);
		ro.observe(elm);
	}

	/**
	 * Toggles class on a target when a trigger is clicked
	 *
	 * @param {jQuery} $target The target to apply the CSS class to
	 * @param {jQuery} $trigger The Trigger
	 * @param {jQuery} $closeTrigger Optional close trigger
	 * @param {string} cssClass CSS Class to toggle on the target
	 */
	const toggleClassOnClick = function($target, $trigger, $closeTrigger, cssClass) {

		// Reset in case class "open" was saved accidentally
		$target.removeClass(cssClass);
		$trigger.removeClass(cssClass).attr('aria-expanded', 'false');

		// Click on trigger toggles class "open"
		$trigger.off('.toggle').on('click.toggle', function() {
			const isExpanded = $(this).attr('aria-expanded') === 'true';
			$(this).toggleClass(cssClass).attr('aria-expanded', !isExpanded);
			$target.toggleClass(cssClass);
		});

		// Close target when link inside is clicked
		$target.find('a').click(function() {
			$target.removeClass(cssClass);
			$trigger.removeClass(cssClass).attr('aria-expanded', 'false');
		});

		if (!$closeTrigger || !$closeTrigger.length) {
			return;
		}

		$closeTrigger.click(function() {
			$target.removeClass(cssClass);
			$trigger.removeClass(cssClass).attr('aria-expanded', 'false');
		});
	};

	/**
	 * Smooth scroll to link targets
	 *
	 * @param {jQuery} $scrollLinks The links
	 * @param {jQuery} scrollOffset Offset to subtract from the scroll target position (e.g. for fixed positioned elements like a menu)
	 */
	const activateSmoothScroll = function($scrollLinks, scrollOffset) {
		if (typeof scrollOffset === 'undefined') {
			scrollOffset = 0;
		}

		const determineTarget = function($trigger, hash) {
			if (hash == '#!next') {
				return $trigger.closest('.ed-element').next();
			}

			return $(hash);
		}

		$scrollLinks.click(function(e) {
			const $target = determineTarget($(this), this.hash);
			if (!$target.length) return;
			e.preventDefault();

			viewport.scrollTo($target, 'top', 500, 0);

		});
	};

	/**
	 * We are using the fill property on an element to pass user's choices from CSS to JavaScript
	 *
	 * @param {jQuery} $element
	 */
	const getStickyMode = function($element) {
		const fillValue = getComputedStyle($element[0]).fill;

		return fillValue === 'rgb(255, 0, 0)' ?
			'sticky_banner' :
			fillValue === 'rgb(0, 255, 0)' ?
			'sticky_menu' :
			fillValue === 'rgb(0, 0, 255)' ?
			'sticky_instant' :
			fillValue === 'rgb(255, 255, 255)' ?
			'sticky_reverse' :
			'sticky_none';
	};

	/**
	 * Adds a class to an element when not currently visible
	 *
	 * @param {jQuery} $element The element to handle stickyness for
	 * @param {string} cssClass The actual CSS class to be applied to the element when it's above a certain scroll position
	 * @param {jQuery} $banner A banner to reference the scroll position to
	 */
	const handleSticky = function($element, cssClass, $banner) {
		let triggerPos = 0,
			offset = 0;
		let menuWrapperHeight = $element.outerHeight();
		let mode;
		let prevScroll = 0;
		$element.removeClass(cssClass);

		const toggleSpacer = function(toggle) {
			document.body.style.setProperty('--spacer-height', toggle ? menuWrapperHeight + 'px' : '');
		};

		const handleScroll = function() {
			if (!$element.length || mode === 'sticky_none') return;
			//if (!$element.length || mode === 'sticky_none' || mode === 'sticky_instant') return;

			const isReverse = mode === 'sticky_reverse',
				curScroll = viewport.getScrollTop();

			if (triggerPos <= curScroll && (!isReverse || prevScroll > curScroll)) {
				$element.addClass(cssClass);
				toggleSpacer(true);
			} else {
				$element.removeClass(cssClass);
				toggleSpacer(false);
			}

			prevScroll = curScroll;
		};

		const updateOffset = function() {
			mode = getStickyMode($element);
			menuWrapperHeight = $element.outerHeight();
			if (!$element.hasClass(cssClass)) {
				offset = $element.offset().top;
			}
			if (mode === 'sticky_banner' && !$banner.length) {
				mode = 'sticky_menu';
			}
			if (mode === 'sticky_banner') {
				triggerPos = $banner.offset().top + ($banner.length ? $banner.outerHeight() : $element.outerHeight());
			}
			if (mode === 'sticky_menu' || mode === 'sticky_reverse') {
				triggerPos = offset + $element.outerHeight();
			}
			if (mode === 'sticky_instant') {
				triggerPos = offset;
			}

			handleScroll();
		}

		viewport.observe('resize', updateOffset);
		viewport.observe('animation.end', updateOffset);
		observeHeightChange($element[0], updateOffset);
		updateOffset();

		viewport.observe('scroll', handleScroll);
		handleScroll();
	};

	/**
	 * Adds a class to links whose target is currently inside the viewport
	 *
	 * @param {jQuery} $links Link(s) to be observed
	 * @param {string} cssClass CSS Class to be applied
	 * @param {float} sectionViewportRatio Ratio by which the target should be within the viewport
	 */
	const addClassOnVisibleLinkTargets = function($links, cssClass, sectionViewportRatio) {
		if (typeof sectionViewportRatio === 'undefined') {
			sectionViewportRatio = 1 / 2;
		}

		const menuTargets = [];
		const activeLink = $links.filter('.active');

		const links = $links.filter(function() {
			const $target = $(this.hash);
			if (!$target.length) {
				return false;
			}

			// Cache offset position to improve performance (update on resize)
			const updateOffset = function() {
				$target.data('offset', $target.offset().top);
			};

			viewport.observe('resize', updateOffset);
			viewport.observe('animation.end', updateOffset);
			updateOffset();

			menuTargets.push($target);
			return true;
		});

		// No hash links found, so don't handle it at all
		if (!links.length) {
			return;
		}

		const checkVisibility = function() {
			$links.removeClass('active');

			// Check section position reversely
			for (let i = menuTargets.length - 1; i >= 0; i--) {
				const desiredScrollPosition = menuTargets[i].data('offset') - viewport.getHeight() * (1 - sectionViewportRatio);
				if (viewport.getScrollTop() >= desiredScrollPosition && menuTargets[i][0].offsetParent !== null) {
					links.eq(i).addClass(cssClass);
					return;
				}
			}

			// Fallback to originally active item
			activeLink.addClass(cssClass);
		};

		viewport.observe('scroll', checkVisibility);
		checkVisibility();
	};
})();
/* End JS for preset "Menu V2" */

/// FILTER GALLERY V3
/* JS for preset "FIlter Gallery V3" */
$(function() {

	var preview = false;
	var listener = function() {
		if (!preview && document.body.classList.contains('preview')) {
			preview = true;
		} else if (preview && !document.body.classList.contains('preview')) {
			$('.filter-instance .filter-gallery-container').fadeOut(300, function() {
				$('.filter-instance .filter-gallery-container .ed-image').show();
				$('.filter-instance .filter-gallery-container').fadeIn(300);
				$('.filter-instance .filter-gallery-trigger-container .filter-gallery-button').removeClass('active');
			});
			preview = false;
		}

		requestAnimationFrame(listener);
	};

	requestAnimationFrame(listener);

	var parseFilters = function(elm) {
		var regex = /filter-([a-z0-9]+)/gi,
			filters = [],
			matches;

		while (matches = regex.exec(elm.className)) {
			filters.push(matches[1]);
		}

		return filters;
	};

	var parseLinkFilters = function(elm, separator) {
		separator = separator || ';';
		if ("" === elm.hash) return [];
		return elm.hash.slice(1).split(separator);
	};

	$('.filter-instance').each(function() {

		var $instance = this,
			imageSelector = '.filter-gallery-container .ed-image',
			$images = $(imageSelector, $instance),
			$imageContainer = $('.filter-gallery-container', $instance),
			$trigger = $('.filter-gallery-button', $instance);

		$images.each(function() {
			var filters = parseFilters(this);
			$(this).attr('data-before', filters.join(' '));
		});

		$('.showall').addClass('active');

		if (document.body.classList.contains('edit')) {
            $('.showall').removeClass('active');
		}

		$trigger.click(function() {
			$trigger.removeClass('active');
			$(this).addClass('active');

			var filters = parseLinkFilters(this),
				$filtered = $images.filter(function() {
					return this.className.match(new RegExp('filter-(' + filters.join('|') + ')'));
				});

			if (filters.length === 1 && 'showall' === filters[0]) {
				$imageContainer.fadeOut(300, function() {
					$images.show();
					$imageContainer.fadeIn(300);
				});

				return;
			}

			$imageContainer.fadeOut(300, function() {
				$images.hide();
				$filtered.show();
				$imageContainer.fadeIn(300);
			});
		});
	});
});
/* End JS for preset "FIlter Gallery V3" */

/// HORIZONTAL FORM V3
/* JS for preset "Horizontal form V3" */
(function() {
	$(function() {
		if (!$('body').is('.edit')) {
			$('.horizontal-form').each(function() {
				$(this).click(function() {
					$('.ed-form-captcha', this).addClass('show');
					$('.ed-form-checkbox.privacy', this).addClass('show');
				});
			});
		}
	});
})();
/* End JS for preset "Horizontal form V3" */

/// IMAGE COMPARISON
/* JS for preset "Image Comparison" */
$(function() {
    var imageComparisonSliders = document.querySelectorAll('.image-comparison-container');
    imageComparisonSliders.forEach(function(slider) {
        var range = slider.querySelector('.range-slider input');
        var beforeContainer = slider.querySelector('.image-before-container');
        if (!range || !beforeContainer) {
            return;
        }
        var positionSlider = function(width) {
            beforeContainer.style.width = width + "%";
            beforeContainer.querySelector('.background').style.width = (100/width*100) + "%";
        };
        range.addEventListener('input', function(e) { positionSlider(e.target.value); });
        positionSlider(50);
    });
});
/* End JS for preset "Image Comparison" */
