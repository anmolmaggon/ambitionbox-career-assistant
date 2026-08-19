/* ============================================================================
   AmbitionBox Career Assistant — Home 2A behaviour (v2 refinement)
   Deterministic, query-driven review states + in-card reply review +
   the compact-and-promote transition + "For today" quote reveal.
   No debug chrome. Preview-only destinations.
   States:  ?state=opening | review | transition | reranked | loading
   Quote :  &quote=concealed | revealed        Capture: &cap=1 (freeze animation)
   Date  :  &date=YYYY-MM-DD                   Time:    &tod=morning|afternoon|evening
   ============================================================================ */
(function () {
  'use strict';

  var params  = new URLSearchParams(location.search);
  var state   = params.get('state')  || 'opening';
  var qOver   = params.get('quote');            // 'concealed' | 'revealed' | null
  var flat    = params.get('flat');             // full-length capture mode
  var capture = params.get('cap') === '1' || !!flat;
  var reduce  = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (capture) document.body.classList.add('cap');
  if (flat) {
    document.body.classList.add('flat');
    window.addEventListener('load', function () {
      requestAnimationFrame(function () {
        document.title = 'H=' + Math.ceil(document.documentElement.scrollHeight);
      });
    });
  }
  document.body.setAttribute('data-state', state);

  var heroSlot = document.getElementById('hero-slot');
  var secSlot  = document.getElementById('secondary-slot');
  var main     = document.getElementById('hub');

  /* ========================================================================
     Dynamic date + time-aware greeting
     ======================================================================== */
  (function initDate() {
    var dateEl  = document.getElementById('dateDisplay');
    var greetEl = document.getElementById('greetText');
    if (!dateEl || !greetEl) return;

    // Determine the display date — fixture override or today
    var dateParam = params.get('date');
    var displayDate;
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      // Parse as local date (not UTC) by using component constructor
      var parts = dateParam.split('-');
      displayDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      displayDate = new Date();
    }

    // Format: "Thursday, 30 July" in user's locale with fallback
    try {
      var fmt = new Intl.DateTimeFormat(undefined, {
        weekday: 'long', day: 'numeric', month: 'long', timeZone: dateParam ? undefined : undefined
      });
      dateEl.textContent = fmt.format(displayDate);
    } catch (e) {
      // Fallback for environments without Intl
      var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      dateEl.textContent = days[displayDate.getDay()] + ', ' + displayDate.getDate() + ' ' + months[displayDate.getMonth()];
    }

    // Time-aware greeting — deterministic override via ?tod=morning|afternoon|evening
    var todParam = params.get('tod');
    var tod;
    if (todParam && /^(morning|afternoon|evening)$/.test(todParam)) {
      tod = todParam;
    } else {
      var hour = new Date().getHours();
      if (hour < 12) tod = 'morning';
      else if (hour < 17) tod = 'afternoon';
      else tod = 'evening';
    }
    var greetings = { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' };
    greetEl.textContent = greetings[tod] + ', Arjun';
  })();

  /* ========================================================================
     Opening composition (snapshot for transition)
     ======================================================================== */
  var openingHero = heroSlot.innerHTML;
  var openingSec  = secSlot.innerHTML;

  var SPARK = '<span class="spark spark--sm" aria-hidden="true"><svg viewBox="0 0 24 24">'
            + '<path d="m12 6 1.7 2.8L16.5 10.5l-2.8 1.7L12 15l-1.7-2.8L7.5 10.5l2.8-1.7z" fill="currentColor" stroke="none"/></svg></span>';

  /* ---- reranked composition templates ------------------------------------- */
  function juspayHero() {
    return ''
      + '<article class="oppo oppo--hero" data-oppo="juspay">'
      +   '<div class="oppo__panel" data-panel="opening">'
      +   '<p class="oppo__eyebrow">' + SPARK + 'READY TO APPLY</p>'
      +   '<h2 class="oppo__title">Prepare your Juspay application</h2>'
      +   '<p class="oppo__body">Your tailored r&eacute;sum&eacute; has been reviewed and is ready.</p>'
      +   '<div class="oppo__times" role="group" aria-label="This opportunity">'
      +     '<span class="oppo__slot"><svg class="ab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>R&eacute;sum&eacute; reviewed</span>'
      +     '<span class="oppo__slot tnum"><span class="spark spark--sm" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 6 1.7 2.8L16.5 10.5l-2.8 1.7L12 15l-1.7-2.8L7.5 10.5l2.8-1.7z" fill="currentColor" stroke="none"/></svg></span>89% Preference Match</span>'
      +   '</div>'
      +   '<a class="oppo__cta" href="job-detail-1b.html">'
      +     '<span class="oppo__cta-label">Continue with Juspay</span>'
      +     '<svg class="ab-icon oppo__cta-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>'
      +   '</a>'
      +   '<p class="oppo__note">Senior Backend Engineer &middot; Bengaluru &middot; Hybrid</p>'
      +   '</div>'
      + '</article>';
  }
  function phonepeCompact() {
    return ''
      + '<button type="button" class="oppo oppo--compact" data-oppo="phonepe" '
      +    'aria-label="PhonePe — technical screen scheduling. Reply sent, waiting on the recruiter.">'
      +   '<span class="oppo__logo oppo__logo--phonepe" aria-hidden="true">P</span>'
      +   '<span class="oppo__body-wrap">'
      +     '<span class="oppo__company">PhonePe</span>'
      +     '<span class="oppo__role">Technical screen scheduling</span>'
      +     '<span class="oppo__status oppo__status--waiting">'
      +       '<svg class="ab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>'
      +       'Reply sent &middot; Waiting</span>'
      +   '</span>'
      +   '<svg class="ab-icon oppo__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>'
      + '</button>';
  }

  function renderOpening() { heroSlot.innerHTML = openingHero; secSlot.innerHTML = openingSec; wireHeroActions(); }
  function renderReranked() { heroSlot.innerHTML = juspayHero(); secSlot.innerHTML = phonepeCompact(); }

  /* ---- in-card panel switching -------------------------------------------- */
  function showPanel(panelName) {
    var panels = heroSlot.querySelectorAll('[data-panel]');
    for (var i = 0; i < panels.length; i++) {
      if (panels[i].getAttribute('data-panel') === panelName) {
        panels[i].removeAttribute('hidden');
      } else {
        panels[i].setAttribute('hidden', '');
      }
    }
  }

  function wireHeroActions() {
    var hero = heroSlot.querySelector('[data-oppo="phonepe"]');
    if (!hero) return;

    // "Review reply" button
    var enterReview = hero.querySelector('[data-action="enter-review"]');
    if (enterReview) {
      enterReview.addEventListener('click', function (e) {
        e.preventDefault();
        showPanel('review');
      });
    }

    // "Back" button
    var backBtn = hero.querySelector('[data-action="back-to-opening"]');
    if (backBtn) {
      backBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showPanel('opening');
      });
    }

    // "Approve and send reply" button
    var approveBtn = hero.querySelector('[data-action="approve-send"]');
    if (approveBtn) {
      approveBtn.addEventListener('click', function (e) {
        e.preventDefault();
        // Show sent confirmation
        showPanel('sent');
        // After a brief hold, run the compact-and-promote transition
        var hold = reduce ? 500 : 1200;
        setTimeout(function () {
          if (reduce) { crossfadeSwap(); return; }
          runRerankedFlip();
        }, hold);
      });
    }

    // Time slot toggling in review panel
    var slots = hero.querySelectorAll('.review__slot');
    for (var i = 0; i < slots.length; i++) {
      slots[i].addEventListener('click', (function (clickedSlot) {
        return function () {
          for (var j = 0; j < slots.length; j++) {
            slots[j].classList.remove('review__slot--selected');
            slots[j].setAttribute('aria-checked', 'false');
          }
          clickedSlot.classList.add('review__slot--selected');
          clickedSlot.setAttribute('aria-checked', 'true');
        };
      })(slots[i]));
    }
  }

  /* ---- the compact-and-promote FLIP (from sent→reranked) ------------------ */
  function runRerankedFlip() {
    // Measure current sent-confirmation hero position
    var sentEl  = heroSlot.firstElementChild;
    var juspayEl = secSlot.firstElementChild;
    var aFirst = sentEl ? sentEl.getBoundingClientRect() : null;
    var bFirst = juspayEl ? juspayEl.getBoundingClientRect() : null;

    renderReranked();
    var newJuspay  = heroSlot.firstElementChild;
    var newPhonepe = secSlot.firstElementChild;
    var aLast = newJuspay ? newJuspay.getBoundingClientRect() : null;
    var bLast = newPhonepe ? newPhonepe.getBoundingClientRect() : null;

    if (aFirst && aLast && bFirst && bLast) {
      invert(newJuspay,  bFirst.top - aLast.top,  bFirst.left - aLast.left);
      invert(newPhonepe, aFirst.top - bLast.top,  aFirst.left - bLast.left);

      requestAnimationFrame(function () { requestAnimationFrame(function () {
        play(newJuspay); play(newPhonepe);
      }); });
    }
  }

  /* ---- legacy transition path (from opening with is-sent) for ?state=transition --- */
  function runTransition() {
    renderOpening();
    var hero = heroSlot.querySelector('[data-oppo="phonepe"]');

    // Show sent panel within the hero
    showPanel('sent');
    var hold = reduce ? 500 : 950;

    setTimeout(function () {
      if (reduce) { crossfadeSwap(); return; }

      var phonepeEl = heroSlot.firstElementChild;
      var juspayEl  = secSlot.firstElementChild;
      var aFirst = phonepeEl.getBoundingClientRect();
      var bFirst = juspayEl.getBoundingClientRect();

      renderReranked();
      var newJuspay  = heroSlot.firstElementChild;
      var newPhonepe = secSlot.firstElementChild;
      var aLast = newJuspay.getBoundingClientRect();
      var bLast = newPhonepe.getBoundingClientRect();

      invert(newJuspay,  bFirst.top - aLast.top,  bFirst.left - aLast.left);
      invert(newPhonepe, aFirst.top - bLast.top,  aFirst.left - bLast.left);

      requestAnimationFrame(function () { requestAnimationFrame(function () {
        play(newJuspay); play(newPhonepe);
      }); });
    }, hold);
  }

  function invert(el, dy, dx) {
    el.classList.add('flipping');
    el.style.transition = 'none';
    el.style.opacity = '.45';
    el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
  }
  function play(el) {
    el.style.transition = 'transform .58s cubic-bezier(.34,1.04,.62,1), opacity .42s ease';
    el.style.transform = 'translate(0,0)';
    el.style.opacity = '1';
    el.addEventListener('transitionend', function done(e) {
      if (e.propertyName !== 'transform') return;
      el.style.transition = ''; el.style.transform = ''; el.style.opacity = '';
      el.classList.remove('flipping');
      el.removeEventListener('transitionend', done);
    });
  }
  // reduced-motion path: no positional animation, short crossfade
  function crossfadeSwap() {
    var next = document.querySelector('.next');
    next.style.transition = 'opacity .18s ease';
    next.style.opacity = '0';
    setTimeout(function () {
      renderReranked();
      next.style.opacity = '1';
      setTimeout(function () { next.style.transition = ''; }, 220);
    }, 180);
  }

  /* ---- loading skeleton (preserves the final composition) ----------------- */
  function renderLoading() {
    main.classList.add('is-loading');
    main.setAttribute('aria-busy', 'true');

    // Accessible loading status (visually hidden, announced to screen readers)
    var status = document.createElement('p');
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
    status.textContent = 'Loading your career actions\u2026';
    main.insertBefore(status, main.firstChild);

    var sk = document.createElement('div');
    sk.className = 'skeleton';
    sk.setAttribute('aria-hidden', 'true');
    sk.innerHTML =
        '<div class="sk sk-lead"></div>'
      + '<div class="sk sk-hero"></div>'
      + '<div class="sk sk-secondary"></div>'
      + '<div class="sk sk-title"></div><div class="sk sk-attn"></div>'
      + '<div class="sk sk-title"></div><div class="sk sk-momentum"></div>'
      + '<div class="sk sk-title"></div><div class="sk sk-quote"></div>';
    main.insertBefore(sk, main.firstChild.nextSibling);
  }

  /* When content becomes available, clear loading state */
  function clearLoading() {
    main.classList.remove('is-loading');
    main.removeAttribute('aria-busy');
    var status = main.querySelector('.sr-only[role="status"]');
    if (status) status.remove();
    var sk = main.querySelector('.skeleton');
    if (sk) sk.remove();
  }

  /* ---- Worth-your-attention rail: paged scroll + keyboard ----------------- */
  function initRail() {
    var rail = document.querySelector('.attn__rail');
    var prev = document.querySelector('[data-scroll="prev"]');
    var next = document.querySelector('[data-scroll="next"]');
    if (!rail) return;
    function step() {
      var card = rail.querySelector('.attn-card');
      return card ? card.getBoundingClientRect().width + 12 : 260;
    }
    function sync() {
      if (!prev || !next) return;
      var max = rail.scrollWidth - rail.clientWidth - 2;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max;
    }
    if (prev) prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { rail.scrollBy({ left:  step(), behavior: reduce ? 'auto' : 'smooth' }); });
    rail.addEventListener('scroll', function () { window.requestAnimationFrame(sync); }, { passive: true });
    rail.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); rail.scrollBy({ left:  step(), behavior: reduce ? 'auto' : 'smooth' }); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); }
    });
    sync();
  }

  /* ---- "For today" quote reveal ------------------------------------------- */
  function initQuote() {
    var card = document.getElementById('quoteCard');
    var text = document.getElementById('quoteText');
    if (!card) return;
    var quoteId = card.getAttribute('data-quote-id') || 'actionable';
    var today = new Date().toISOString().slice(0, 10);
    var key = 'ab2a-quote-' + today + '-' + quoteId;
    var autoTimer = null, revealed = false;

    function reveal(persist) {
      if (revealed) return;
      revealed = true;
      card.classList.add('is-blooming');
      card.setAttribute('data-quote', 'revealed');
      card.setAttribute('aria-label', 'Today\u2019s note: ' + text.textContent.trim());
      if (persist) { try { localStorage.setItem(key, 'revealed'); } catch (e) {} }
    }
    function conceal() {
      card.setAttribute('data-quote', 'concealed');
      card.setAttribute('aria-label', 'Reveal today\u2019s note');
    }

    // deterministic overrides win first
    if (qOver === 'revealed') { card.classList.add('is-blooming'); reveal(false); return; }
    if (qOver === 'concealed') { conceal(); card.classList.add('is-blooming'); bindTap(); return; }

    // default: revealed once per daily quote, else conceal + arm
    var persisted = false;
    try { persisted = localStorage.getItem(key) === 'revealed'; } catch (e) {}
    if (persisted) { card.classList.add('is-blooming'); reveal(false); return; }

    conceal();
    bindTap();

    // begin aurora + arm auto-reveal when >=50% of the card is in view
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && en.intersectionRatio >= 0.5) {
            card.classList.add('is-blooming');
            if (!autoTimer) autoTimer = setTimeout(function () { reveal(true); }, reduce ? 260 : 1600);
            io.unobserve(card);
          }
        });
      }, { threshold: [0, 0.5, 1] });
      io.observe(card);
    } else {
      card.classList.add('is-blooming');
      autoTimer = setTimeout(function () { reveal(true); }, reduce ? 260 : 1600);
    }

    function bindTap() {
      card.addEventListener('click', function () {
        if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
        card.classList.add('is-blooming');
        reveal(true);
      });
    }
  }

  /* ---- momentum stats ticker animation ----------------------------------- */
  function initTicker() {
    var section = document.querySelector('.momentum');
    if (!section) return;

    var targets = section.querySelectorAll('[data-target]');
    if (!targets.length) return;

    // In capture mode, set values instantly with no animation
    if (capture) {
      for (var i = 0; i < targets.length; i++) {
        targets[i].textContent = targets[i].getAttribute('data-target');
      }
      return;
    }

    function animateCount(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      var duration = Math.min(600 + target * 40, 1200);
      var start = null;
      el.parentElement && el.parentElement.classList.add('ticked');
      if (el.classList.contains('momentum__big')) el.classList.add('ticked');

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        // ease-out curve
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function runTickers() {
      for (var i = 0; i < targets.length; i++) {
        (function (el, delay) {
          setTimeout(function () { animateCount(el); }, delay);
        })(targets[i], i * 100);
      }
    }

    // Trigger when momentum section scrolls into view
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            runTickers();
            io.unobserve(section);
          }
        });
      }, { threshold: 0.3 });
      io.observe(section);
    } else {
      runTickers();
    }
  }

  /* ---- soft entrance for content modules (skipped in capture / loading) --- */
  function entrance() {
    if (capture || reduce || state === 'loading') return;
    ['.next', '.attn', '.momentum', '.today'].forEach(function (sel, i) {
      var el = document.querySelector(sel);
      if (!el) return;
      el.classList.add('anim-in');
      el.style.animationDelay = (0.06 + i * 0.05) + 's';
    });
  }

  /* ---- boot --------------------------------------------------------------- */
  if (state === 'loading') {
    renderLoading();
  } else {
    if (state === 'reranked') {
      renderReranked();
    } else if (state === 'review') {
      renderOpening();
      showPanel('review');
    } else if (state === 'transition') {
      /* handled below after paint */
      renderOpening();
    } else {
      renderOpening();
    }

    initRail();
    initQuote();
    initTicker();
    entrance();

    if (state === 'transition') {
      if (params.get('freeze') === 'sent') {
        // deterministic capture of the success-confirmation step (no FLIP)
        showPanel('sent');
      } else {
        window.addEventListener('load', function () { setTimeout(runTransition, reduce ? 260 : 620); });
      }
    }
  }
})();
