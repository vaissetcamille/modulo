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
