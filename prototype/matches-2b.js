(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var params = new URLSearchParams(window.location.search);
  var capture = params.get("cap") === "1";
  if (capture) document.body.classList.add("cap");

  (function initDate() {
    var dateEl = document.getElementById("dateDisplay");
    var greetEl = document.getElementById("greetText");
    if (!dateEl || !greetEl) return;
    var dateParam = params.get("date");
    var displayDate;
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      var parts = dateParam.split("-");
      displayDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      displayDate = new Date();
    }
    try {
      dateEl.textContent = new Intl.DateTimeFormat(undefined, {
        weekday: "long", day: "numeric", month: "long"
      }).format(displayDate);
    } catch (error) {
      var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      dateEl.textContent = days[displayDate.getDay()] + ", " + displayDate.getDate() + " " + months[displayDate.getMonth()];
    }
    var timeParam = params.get("tod");
    var timeOfDay;
    if (timeParam && /^(morning|afternoon|evening)$/.test(timeParam)) {
      timeOfDay = timeParam;
    } else {
      var hour = new Date().getHours();
      timeOfDay = hour < 12 ? "morning" : (hour < 17 ? "afternoon" : "evening");
    }
    var greetings = { morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening" };
    greetEl.textContent = greetings[timeOfDay] + ", Arjun";
  })();

  /*
   * Prototype fixtures only.
   * Juspay mirrors the canonical project scenario. Zeta extends the existing Home 2A fixture
   * so the finite deck can demonstrate horizontal browsing and Saved behavior.
   */
  var jobs = [
    {
      id: "juspay",
      company: "Juspay",
      role: "Senior Backend Engineer",
      logo: "J",
      logoClass: "job-id__logo--juspay",
      source: "via Naukri",
      freshness: "2 days ago",
      preference: 89,
      rating: "4.0",
      reviews: "847 reviews",
      payTitle: "Est. ₹24-30L for this role",
      payMeta: "Above your ₹22L target · 27 reports",
      cultureTitle: "Ownership culture, strong stack",
      cultureMeta: "Pace can be demanding",
      fitTitle: "10 of 15 requirements evidenced",
      fitMeta: "Based on your current profile",
      detailHref: "job-detail-1b.html?from=matches"
    },
    {
      id: "zeta",
      company: "Zeta",
      role: "Senior Backend Engineer",
      logo: "Z",
      logoClass: "job-id__logo--zeta",
      source: "via AmbitionBox",
      freshness: "1 day ago",
      preference: 86,
      rating: "4.1",
      reviews: "1.4k reviews",
      payTitle: "Est. ₹26-32L for this role",
      payMeta: "Above your ₹22L target · prototype estimate",
      cultureTitle: "High ownership, focused teams",
      cultureMeta: "Execution pace can be intense",
      fitTitle: "9 of 14 requirements evidenced",
      fitMeta: "Based on your current profile",
      detailHref: ""
    }
  ];

  var saved = new Set();
  var savedParam = params.get("saved");
  if (savedParam) {
    savedParam.split(",").forEach(function (id) {
      if (jobs.some(function (job) { return job.id === id; })) saved.add(id);
    });
  }

  var state = {
    activeIndex: 0,
    activeId: params.get("card") || jobs[0].id,
    dragged: false,
    sheetOpen: params.get("sheet") === "saved" || params.get("tab") === "saved"
  };

  var deck = document.getElementById("match-deck");
  var deckWrap = document.querySelector(".deck-wrap");
  var counter = document.getElementById("deck-counter");
  var prevButton = document.getElementById("deck-prev");
  var nextButton = document.getElementById("deck-next");
  var savedSheetLayer = document.getElementById("saved-sheet-layer");
  var savedSheet = document.getElementById("saved-sheet");
  var savedSheetBody = document.getElementById("saved-sheet-body");
  var savedSheetSummary = document.getElementById("saved-sheet-summary");
  var assistantButton = document.getElementById("assistant-button");
  var assistantLabel = document.getElementById("assistant-label");
  var toast = document.getElementById("toast");
  var toastTimer = 0;
  var settleTimer = 0;
  var sheetReturnFocus = null;

  function icon(name) {
    if (name === "pay") {
      return '<svg class="ab-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M17 14h.01"/><circle cx="12" cy="12" r="2.5"/></svg>';
    }
    if (name === "culture") {
      return '<svg class="ab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>';
    }
    return '<svg class="ab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>';
  }

  function highlight(kind, label, title, meta) {
    return ''
      + '<li class="highlight highlight--' + kind + '">'
      +   '<span class="highlight__icon" aria-hidden="true">' + icon(kind) + '</span>'
      +   '<span class="highlight__content">'
      +     '<span class="highlight__label">' + label + '</span>'
      +     '<span class="highlight__title">' + title + '</span>'
      +     '<span class="highlight__meta">' + meta + '</span>'
      +   '</span>'
      + '</li>';
  }

  function saveIcon(isSaved) {
    return isSaved
      ? '<svg class="ab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z" fill="currentColor"/></svg>'
      : '<svg class="ab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z"/></svg>';
  }

  function cardTemplate(job) {
    var isSaved = saved.has(job.id);
    var detailAction = job.detailHref
      ? '<a class="card-action card-action--view" href="' + job.detailHref + '">View job<svg class="ab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></a>'
      : '<button type="button" class="card-action card-action--view" data-action="unavailable" data-company="' + job.company + '">View job<svg class="ab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button>';

    return ''
      + '<li class="deck-slide" data-slide-id="' + job.id + '">'
      +   '<article class="match-card" aria-labelledby="role-' + job.id + '">'
      +     '<div class="match-card__strip">'
      +       '<span class="match-card__source">' + job.source + ' · ' + job.freshness + '</span>'
      +       '<span class="match-card__score tnum">' + job.preference + '% Preference Match</span>'
      +     '</div>'
      +     '<div class="match-card__body">'
      +       '<div class="job-id">'
      +         '<span class="job-id__logo ' + job.logoClass + '" aria-hidden="true">' + job.logo + '</span>'
      +         '<span class="job-id__copy">'
      +           '<span class="job-id__companyline">'
      +             '<span class="job-id__company">' + job.company + '</span>'
      +             '<span class="job-id__rating" aria-label="AmbitionBox rating ' + job.rating + ' out of 5, based on ' + job.reviews + '">'
      +               '<span class="job-id__star"><svg class="ab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8-4.3-4.1 5.9-.9z"/></svg>' + job.rating + '</span>'
      +               '<span>' + job.reviews + '</span>'
      +             '</span>'
      +           '</span>'
      +           '<strong class="job-id__role" id="role-' + job.id + '">' + job.role + '</strong>'
      +         '</span>'
      +       '</div>'
      +       '<h3 class="highlights-title">Highlights</h3>'
      +       '<ul class="highlights">'
      +         highlight("pay", "Pay", job.payTitle, job.payMeta)
      +         highlight("culture", "Culture", job.cultureTitle, job.cultureMeta)
      +         highlight("fit", "Profile fit", job.fitTitle, job.fitMeta)
      +       '</ul>'
      +       '<div class="match-card__actions">'
      +         '<button type="button" class="card-action card-action--save" data-action="save" data-job-id="' + job.id + '" aria-pressed="' + isSaved + '">'
      +           saveIcon(isSaved) + '<span>' + (isSaved ? "Saved" : "Save") + '</span>'
      +         '</button>'
      +         detailAction
      +       '</div>'
      +     '</div>'
      +   '</article>'
      + '</li>';
  }

  function completeTemplate() {
    return ''
      + '<li class="deck-slide" data-slide-id="complete">'
      +   '<article class="complete-card" aria-labelledby="complete-title">'
      +     '<span class="complete-card__icon" aria-hidden="true">'
      +       '<svg class="ab-icon" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>'
      +     '</span>'
      +     '<h3 id="complete-title">You’re all caught up</h3>'
      +     '<p>We’ll let you know when there’s a new role that matches your profile and preferences.</p>'
      +     '<div class="complete-card__actions">'
      +       '<button type="button" class="complete-card__action complete-card__action--saved" data-action="open-saved">'
      +         '<svg class="ab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z"/></svg>'
      +         'View saved jobs <span class="complete-card__count tnum" id="complete-saved-count">' + saved.size + '</span>'
      +       '</button>'
      +       '<button type="button" class="complete-card__action" data-action="back-first">Review matches again</button>'
      +     '</div>'
      +   '</article>'
      + '</li>';
  }

  function render(preferredId) {
    deck.innerHTML = jobs.map(cardTemplate).join("") + completeTemplate();
    var slides = getSlides();
    var target = preferredId || state.activeId;
    var nextIndex = slides.findIndex(function (slide) { return slide.dataset.slideId === target; });
    state.activeIndex = nextIndex >= 0 ? nextIndex : 0;
    state.activeId = slides[state.activeIndex].dataset.slideId;
    updateActiveState(false);
    requestAnimationFrame(function () {
      goTo(state.activeIndex, false);
    });
    if (state.sheetOpen) requestAnimationFrame(openSavedSheet);
  }

  function getSlides() {
    return Array.prototype.slice.call(deck.querySelectorAll(".deck-slide"));
  }

  function activeJob() {
    return jobs.find(function (job) { return job.id === state.activeId; }) || null;
  }

  function updateAssistant(job) {
    if (job) {
      assistantLabel.textContent = "Ask about " + job.company;
      assistantButton.setAttribute("aria-label", "Ask the Career Assistant about " + job.company);
    } else if (state.activeId === "complete") {
      assistantLabel.textContent = "Refine your matches";
      assistantButton.setAttribute("aria-label", "Ask the Career Assistant to refine your matches");
    } else {
      assistantLabel.textContent = "Ask the Career Assistant";
      assistantButton.setAttribute("aria-label", "Ask the Career Assistant");
    }
  }

  function updateUrl() {
    if (capture) return;
    var next = new URLSearchParams(window.location.search);
    next.delete("tab");
    if (state.activeId) next.set("card", state.activeId);
    else next.delete("card");
    if (saved.size) next.set("saved", Array.from(saved).join(","));
    else next.delete("saved");
    if (state.sheetOpen) next.set("sheet", "saved");
    else next.delete("sheet");
    var query = next.toString();
    window.history.replaceState(null, "", window.location.pathname + (query ? "?" + query : ""));
  }

  function updateActiveState(writeUrl) {
    var slides = getSlides();
    if (!slides.length) return;
    state.activeIndex = Math.max(0, Math.min(state.activeIndex, slides.length - 1));
    state.activeId = slides[state.activeIndex].dataset.slideId;
    var isComplete = state.activeId === "complete";
    counter.textContent = isComplete ? "All reviewed" : (state.activeIndex + 1) + " of " + jobs.length;
    prevButton.disabled = state.activeIndex === 0;
    nextButton.disabled = state.activeIndex === slides.length - 1;
    deckWrap.dataset.canPrev = String(!prevButton.disabled);
    deckWrap.dataset.canNext = String(!nextButton.disabled);
    updateAssistant(activeJob());
    if (writeUrl !== false) updateUrl();
  }

  function goTo(index, smooth) {
    var slides = getSlides();
    if (!slides.length) return;
    var targetIndex = Math.max(0, Math.min(index, slides.length - 1));
    var slide = slides[targetIndex];
    var left = slide.offsetLeft - (deck.clientWidth - slide.offsetWidth) / 2;
    deck.scrollTo({
      left: Math.max(0, left),
      behavior: smooth && !reduceMotion && !capture ? "smooth" : "auto"
    });
    state.activeIndex = targetIndex;
    updateActiveState();
  }

  function settleToNearest() {
    var slides = getSlides();
    if (!slides.length) return;
    var center = deck.scrollLeft + deck.clientWidth / 2;
    var nearest = 0;
    var distance = Infinity;
    slides.forEach(function (slide, index) {
      var slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      var nextDistance = Math.abs(center - slideCenter);
      if (nextDistance < distance) {
        distance = nextDistance;
        nearest = index;
      }
    });
    if (nearest !== state.activeIndex) {
      state.activeIndex = nearest;
      updateActiveState();
    }
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(function () { toast.classList.add("is-visible"); });
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
      window.setTimeout(function () { toast.hidden = true; }, 200);
    }, 2200);
  }

  function savedRowTemplate(job) {
    var viewAction = job.detailHref
      ? '<a class="saved-row__action saved-row__action--view" href="' + job.detailHref + '">View job</a>'
      : '<button type="button" class="saved-row__action saved-row__action--view" data-action="unavailable" data-company="' + job.company + '">View job</button>';
    return ''
      + '<li class="saved-row" data-saved-id="' + job.id + '">'
      +   '<div class="saved-row__main">'
      +     '<span class="saved-row__logo ' + job.logoClass + '" aria-hidden="true">' + job.logo + '</span>'
      +     '<span class="saved-row__copy">'
      +       '<span class="saved-row__company">' + job.company + '</span>'
      +       '<span class="saved-row__role">' + job.role + '</span>'
      +       '<span class="saved-row__match tnum">' + job.preference + '% Preference Match</span>'
      +     '</span>'
      +   '</div>'
      +   '<div class="saved-row__actions">'
      +     '<button type="button" class="saved-row__action" data-action="remove-saved" data-job-id="' + job.id + '">Remove</button>'
      +     viewAction
      +   '</div>'
      + '</li>';
  }

  function updateSavedAccess() {
    var count = document.getElementById("complete-saved-count");
    if (count) count.textContent = String(saved.size);
    savedSheetSummary.textContent = saved.size + (saved.size === 1 ? " role saved" : " roles saved");
  }

  function renderSavedSheet() {
    var savedJobs = jobs.filter(function (job) { return saved.has(job.id); });
    updateSavedAccess();
    if (savedJobs.length) {
      savedSheetBody.innerHTML = '<ul class="saved-sheet__list">' + savedJobs.map(savedRowTemplate).join("") + '</ul>';
    } else {
      savedSheetBody.innerHTML = ''
        + '<div class="sheet-empty">'
        +   '<span class="sheet-empty__icon" aria-hidden="true">'
        +     '<svg class="ab-icon" viewBox="0 0 24 24"><path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z"/></svg>'
        +   '</span>'
        +   '<h3>No saved jobs yet</h3>'
        +   '<p>Save a role while browsing and it will appear here.</p>'
        + '</div>';
    }
  }

  function openSavedSheet() {
    if (!state.sheetOpen) sheetReturnFocus = document.activeElement;
    state.sheetOpen = true;
    renderSavedSheet();
    savedSheetLayer.hidden = false;
    document.body.classList.add("sheet-open");
    updateUrl();
    requestAnimationFrame(function () {
      var closeButton = savedSheet.querySelector(".saved-sheet__close");
      if (closeButton) closeButton.focus();
    });
  }

  function closeSavedSheet() {
    state.sheetOpen = false;
    savedSheetLayer.hidden = true;
    document.body.classList.remove("sheet-open");
    updateUrl();
    if (sheetReturnFocus && document.contains(sheetReturnFocus)) sheetReturnFocus.focus();
    sheetReturnFocus = null;
  }

  function toggleSave(jobId) {
    var wasSaved = saved.has(jobId);
    if (wasSaved) saved.delete(jobId);
    else saved.add(jobId);
    var button = deck.querySelector('[data-action="save"][data-job-id="' + jobId + '"]');
    if (button) {
      button.setAttribute("aria-pressed", String(!wasSaved));
      button.innerHTML = saveIcon(!wasSaved) + "<span>" + (!wasSaved ? "Saved" : "Save") + "</span>";
    }
    updateSavedAccess();
    if (state.sheetOpen) renderSavedSheet();
    updateUrl();
    var job = jobs.find(function (item) { return item.id === jobId; });
    showToast((wasSaved ? "Removed " : "Saved ") + job.company);
  }

  prevButton.addEventListener("click", function () { goTo(state.activeIndex - 1, true); });
  nextButton.addEventListener("click", function () { goTo(state.activeIndex + 1, true); });

  deck.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(state.activeIndex + 1, true);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(state.activeIndex - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(getSlides().length - 1, true);
    }
  });

  deck.addEventListener("scroll", function () {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settleToNearest, 90);
  }, { passive: true });

  var drag = { active: false, startX: 0, startLeft: 0 };
  deck.addEventListener("pointerdown", function (event) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if (event.target.closest("button,a")) return;
    drag.active = true;
    drag.startX = event.clientX;
    drag.startLeft = deck.scrollLeft;
    state.dragged = false;
    deck.classList.add("is-dragging");
    deck.setPointerCapture(event.pointerId);
  });
  deck.addEventListener("pointermove", function (event) {
    if (!drag.active) return;
    var delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 4) state.dragged = true;
    deck.scrollLeft = drag.startLeft - delta;
  });
  function stopDrag(event) {
    if (!drag.active) return;
    drag.active = false;
    deck.classList.remove("is-dragging");
    if (deck.hasPointerCapture(event.pointerId)) deck.releasePointerCapture(event.pointerId);
    settleToNearest();
    if (state.dragged) goTo(state.activeIndex, true);
    window.setTimeout(function () { state.dragged = false; }, 0);
  }
  deck.addEventListener("pointerup", stopDrag);
  deck.addEventListener("pointercancel", stopDrag);
  deck.addEventListener("click", function (event) {
    if (state.dragged) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    var saveButton = event.target.closest('[data-action="save"]');
    if (saveButton) {
      toggleSave(saveButton.dataset.jobId);
      return;
    }
    var unavailable = event.target.closest('[data-action="unavailable"]');
    if (unavailable) {
      showToast(unavailable.dataset.company + " Job Detail is not included in this checkpoint");
      return;
    }
    if (event.target.closest('[data-action="open-saved"]')) {
      openSavedSheet();
      return;
    }
    if (event.target.closest('[data-action="back-first"]')) goTo(0, true);
  });

  savedSheetLayer.addEventListener("click", function (event) {
    if (event.target.closest('[data-action="close-saved"]')) {
      closeSavedSheet();
      return;
    }
    var removeButton = event.target.closest('[data-action="remove-saved"]');
    if (removeButton) {
      toggleSave(removeButton.dataset.jobId);
      return;
    }
    var unavailable = event.target.closest('[data-action="unavailable"]');
    if (unavailable) showToast(unavailable.dataset.company + " Job Detail is not included in this checkpoint");
  });

  document.addEventListener("keydown", function (event) {
    if (!state.sheetOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeSavedSheet();
      return;
    }
    if (event.key !== "Tab") return;
    var focusable = Array.prototype.slice.call(savedSheet.querySelectorAll("button,a[href]"))
      .filter(function (element) { return !element.disabled && element.offsetParent !== null; });
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  assistantButton.addEventListener("click", function () {
    var job = activeJob();
    showToast(job ? "Career Assistant context set to " + job.company : "Career Assistant is ready to refine your matches");
  });

  document.querySelectorAll(".tab[aria-label$='preview'],.explore,.hd__btn").forEach(function (button) {
    button.addEventListener("click", function () { showToast("This destination is a preview in Checkpoint 2B"); });
  });

  window.addEventListener("resize", function () {
    goTo(state.activeIndex, false);
  });

  render(state.activeId);
})();
