(function () {
  "use strict";
  fetch("assets/credits.json").then(function (r) { return r.json(); }).then(function (credits) {
    var list = document.querySelector("[data-credits]");
    if (!list) return;
    var html = Object.keys(credits).map(function (id) {
      var c = credits[id];
      var creator = c.creator_url
        ? '<a href="' + c.creator_url + '" target="_blank" rel="noopener">' + c.creator + "</a>"
        : c.creator;
      return "<li><strong>" + c.title + "</strong> by " + creator + " (" + c.source + ") &middot; " +
        '<a href="' + c.license_url + '" target="_blank" rel="noopener">' + c.license.toUpperCase() + " " + (c.license_version || "") + "</a> &middot; " +
        '<a href="' + c.foreign_landing_url + '" target="_blank" rel="noopener">View original ↗</a></li>';
    }).join("");
    list.innerHTML = html;
  }).catch(function () {});
})();
