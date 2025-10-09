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
