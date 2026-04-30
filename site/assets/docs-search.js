(function () {
  var indexEl = document.getElementById("docs-search-index");
  var input = document.querySelector(".docs-search-input");
  var container = document.querySelector(".docs-search");
  var resultsList = document.getElementById("docs-search-results");

  if (!indexEl || !input || !container || !resultsList) return;

  var index;
  try {
    index = JSON.parse(indexEl.textContent);
  } catch (e) {
    console.warn("[docs-search] Failed to parse search index:", e);
    return;
  }

  var activeIndex = -1;
  var currentResults = [];

  function filterIndex(query) {
    var normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return index.filter(function (entry) {
      return (
        entry.title.toLowerCase().includes(normalized) ||
        entry.description.toLowerCase().includes(normalized)
      );
    });
  }

  function renderResults(results) {
    resultsList.innerHTML = "";
    currentResults = results;
    activeIndex = -1;

    results.forEach(function (entry, i) {
      var li = document.createElement("li");
      li.className = "docs-search-result";
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");
      li.id = "docs-search-result-" + i;

      var a = document.createElement("a");
      a.href = entry.url;

      var titleSpan = document.createElement("span");
      titleSpan.textContent = entry.title;

      var badge = document.createElement("span");
      badge.className = "docs-search-type";
      badge.textContent = entry.type;

      a.appendChild(titleSpan);
      a.appendChild(badge);
      li.appendChild(a);
      resultsList.appendChild(li);
    });
  }

  function renderEmptyState(query) {
    resultsList.innerHTML = "";
    currentResults = [];
    activeIndex = -1;

    var li = document.createElement("li");
    li.className = "docs-search-empty";
    li.setAttribute("role", "option");
    li.textContent = 'No results for "' + query + '"';
    resultsList.appendChild(li);
  }

  function show() {
    resultsList.hidden = false;
    container.setAttribute("aria-expanded", "true");
  }

  function hide() {
    resultsList.hidden = true;
    container.setAttribute("aria-expanded", "false");
    activeIndex = -1;
    var items = resultsList.querySelectorAll("[aria-selected]");
    items.forEach(function (item) {
      item.setAttribute("aria-selected", "false");
    });
    input.removeAttribute("aria-activedescendant");
  }

  function setActive(idx) {
    var items = resultsList.querySelectorAll(".docs-search-result");
    items.forEach(function (item, i) {
      item.setAttribute("aria-selected", i === idx ? "true" : "false");
    });
    if (items[idx]) {
      items[idx].scrollIntoView({ block: "nearest" });
      input.setAttribute("aria-activedescendant", items[idx].id);
    } else {
      input.removeAttribute("aria-activedescendant");
    }
    activeIndex = idx;
  }

  input.addEventListener("input", function () {
    var query = input.value;
    var results = filterIndex(query);

    if (!query.trim()) {
      hide();
      return;
    }

    if (results.length > 0) {
      renderResults(results);
    } else {
      renderEmptyState(query);
    }
    show();
  });

  input.addEventListener("keydown", function (e) {
    if (!currentResults.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      var next = Math.min(activeIndex + 1, currentResults.length - 1);
      setActive(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      var prev = Math.max(activeIndex - 1, 0);
      setActive(prev);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      var entry = currentResults[activeIndex];
      if (entry) window.location.href = entry.url;
    } else if (e.key === "Escape") {
      e.preventDefault();
      hide();
      input.focus();
    }
  });

  input.addEventListener("focusin", function () {
    if (input.value.trim() && currentResults.length > 0) {
      show();
    }
  });

  document.addEventListener("click", function (e) {
    if (!container.contains(e.target)) {
      hide();
    }
  });
})();
