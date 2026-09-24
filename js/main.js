/* Auberge de la Croix Blanche — interactions */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js-ready');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var wideScreen = window.matchMedia('(min-width: 901px)');
  var clamp = function (value, min, max) { return Math.min(max, Math.max(min, value)); };

  /* ---------- Carrousel du hero ---------- */
  var slides = [
    {
      kicker: 'Maison établie depuis 1870',
      title: 'Cuisine traditionnelle<br>et gastronomique',
      text: 'Notre établissement est ouvert du jeudi au lundi, le midi de 12h15 à 14h et le soir de 19h30 à 20h45.'
    },
    {
      kicker: 'Le restaurant',
      title: 'Un menu de saison<br>midi et soir',
      text: 'Et un menu du jour le midi, quotidiennement renouvelé.'
    },
    {
      kicker: 'L’hôtel',
      title: 'Confort<br>et sérénité',
      text: '7 chambres confortables, au cœur du village de Marcilly-en-Villette.'
    }
  ];

  var hero = document.querySelector('.hero');
  if (hero) {
    var images = hero.querySelectorAll('.hero__img');
    var kicker = hero.querySelector('[data-slide-kicker]');
    var title = hero.querySelector('[data-slide-title]');
    var text = hero.querySelector('[data-slide-text]');
    var num = hero.querySelector('[data-slide-num]');
    var progress = hero.querySelector('.hero__counter-progress');
    var current = 0;

    var show = function (index) {
      index = (index + slides.length) % slides.length;
      if (index === current) return;
      images[current].classList.remove('is-active');
      images[index].classList.add('is-active');
      current = index;

      hero.classList.add('is-changing');
      window.setTimeout(function () {
        var s = slides[current];
        kicker.textContent = s.kicker;
        title.innerHTML = s.title;
        text.textContent = s.text;
        num.textContent = String(current + 1).padStart(2, '0');
        hero.classList.remove('is-changing');
      }, reduceMotion ? 0 : 450);
    };

    // La lecture automatique suit la jauge sous le compteur : quand elle est pleine,
    // on passe à la diapositive suivante. La mettre en pause suspend donc aussi le minuteur.
    var restart = function () {
      if (reduceMotion) return;
      hero.classList.remove('is-playing');
      void progress.offsetWidth; // relance l'animation CSS
      hero.classList.add('is-playing');
    };
    var pause = function () { hero.classList.add('is-paused'); };
    var resume = function () { hero.classList.remove('is-paused'); };

    progress.addEventListener('animationend', function () { show(current + 1); restart(); });

    hero.querySelector('.hero__arrow--prev').addEventListener('click', function () { show(current - 1); restart(); });
    hero.querySelector('.hero__arrow--next').addEventListener('click', function () { show(current + 1); restart(); });

    // Pause quand on survole ce qu'on lit ou qu'on manipule (le hero entier occupe l'écran,
    // une pause au survol global bloquerait la lecture automatique en permanence).
    Array.prototype.forEach.call(hero.querySelectorAll('.hero__content > *, .hero__arrow'), function (el) {
      el.addEventListener('mouseenter', pause);
      el.addEventListener('mouseleave', resume);
    });
    hero.addEventListener('focusin', pause);
    hero.addEventListener('focusout', resume);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pause(); else resume();
    });

    // Balayage tactile
    var touchX = null;
    hero.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) { show(current + (dx < 0 ? 1 : -1)); restart(); }
      touchX = null;
    });

    restart();
  }

  /* ---------- En-tête compact au défilement ---------- */
  var header = document.getElementById('header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  var setMenu = function (open) {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); burger.focus(); }
  });

  /* ---------- Lien actif selon la section visible ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var setActive = function (id) {
      links.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
      });
    };
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------- Apparition au défilement ---------- */
  // Les éléments qui entrent ensemble dans l'écran apparaissent en cascade, dans
  // l'ordre de lecture ; une fois l'animation jouée, on retire data-reveal pour
  // que l'élément retrouve ses styles normaux (survols, carrousel…).
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var STEP = 90;

  var reveal = function (el, delay) {
    el.style.setProperty('--d', delay + 'ms');
    el.classList.add('is-visible');
    window.setTimeout(function () {
      el.removeAttribute('data-reveal');
      el.classList.remove('is-visible');
      el.style.removeProperty('--d');
    }, delay + 1900);
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.removeAttribute('data-reveal'); });
  } else {
    // Les photos « masquées » et les ornements sont entièrement rognés au départ (surface
    // visible nulle) : l'observateur ne les verrait jamais entrer, on surveille donc leur parent.
    var revealTargets = new Map();
    revealItems.forEach(function (el) {
      var type = el.getAttribute('data-reveal');
      var target = type === 'mask' || type === 'ornament' ? el.parentElement : el;
      if (!revealTargets.has(target)) revealTargets.set(target, []);
      revealTargets.get(target).push(el);
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      var batch = [];
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        revealObserver.unobserve(entry.target);
        batch = batch.concat(revealTargets.get(entry.target));
      });
      batch
        .map(function (el) { return { el: el, rect: el.getBoundingClientRect() }; })
        .sort(function (a, b) {
          return (Math.round(a.rect.top / 20) - Math.round(b.rect.top / 20)) || (a.rect.left - b.rect.left);
        })
        .forEach(function (item, i) { reveal(item.el, Math.min(i, 8) * STEP); });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealTargets.forEach(function (els, target) { revealObserver.observe(target); });
  }

  /* ---------- Parallaxe et profondeur du hero ---------- */
  // Réservé aux grands écrans avec souris : sur mobile, le mouvement lié au
  // défilement gêne plus qu'il n'aide.
  var parallaxItems = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var heroSlides = hero && hero.querySelector('.hero__slides');
  var heroContent = hero && hero.querySelector('.hero__content');
  var pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  var motionOn = false;
  var ticking = false;

  var frame = function () {
    ticking = false;
    if (!motionOn) return;
    var vh = window.innerHeight;

    // Décalage proportionnel à la distance entre le cadre parent et le centre de l'écran :
    // vitesse positive = premier plan (plus rapide que la page), négative = arrière-plan.
    parallaxItems.forEach(function (el) {
      var box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -200 || box.top > vh + 200) return;
      var speed = parseFloat(el.getAttribute('data-parallax'));
      var max = parseFloat(el.getAttribute('data-parallax-max')) || 60;
      var y = clamp((box.top + box.height / 2 - vh / 2) * speed, -max, max);
      el.style.translate = '0 ' + y.toFixed(1) + 'px';
    });

    if (hero) {
      var h = hero.offsetHeight;
      var s = window.scrollY;
      pointer.x += (pointer.targetX - pointer.x) * 0.08;
      pointer.y += (pointer.targetY - pointer.y) * 0.08;
      if (s < h) {
        heroSlides.style.translate = pointer.x.toFixed(2) + 'px ' + (s * 0.3 + pointer.y).toFixed(2) + 'px';
        heroContent.style.translate = '0 ' + (s * 0.12).toFixed(1) + 'px';
        heroContent.style.opacity = clamp(1 - s / (h * 0.75), 0, 1).toFixed(3);
      }
      if (Math.abs(pointer.targetX - pointer.x) > 0.05 || Math.abs(pointer.targetY - pointer.y) > 0.05) requestFrame();
    }
  };

  var requestFrame = function () {
    if (!ticking && motionOn) { ticking = true; window.requestAnimationFrame(frame); }
  };

  var updateMotion = function () {
    var on = !reduceMotion && finePointer.matches && wideScreen.matches;
    if (on === motionOn) return;
    motionOn = on;
    root.classList.toggle('has-motion', on);
    if (!on) {
      parallaxItems.concat(heroSlides ? [heroSlides, heroContent] : []).forEach(function (el) {
        el.style.translate = '';
        el.style.opacity = '';
      });
    }
    requestFrame();
  };

  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame);
  [finePointer, wideScreen].forEach(function (query) {
    if (query.addEventListener) query.addEventListener('change', updateMotion);
  });

  if (hero) {
    // Le décor du hero glisse légèrement à l'opposé du curseur, comme vu à travers une fenêtre.
    hero.addEventListener('mousemove', function (e) {
      if (!motionOn) return;
      var box = hero.getBoundingClientRect();
      pointer.targetX = ((e.clientX - box.left) / box.width - 0.5) * -18;
      pointer.targetY = ((e.clientY - box.top) / box.height - 0.5) * -12;
      requestFrame();
    });
    hero.addEventListener('mouseleave', function () {
      pointer.targetX = 0;
      pointer.targetY = 0;
      requestFrame();
    });
  }

  updateMotion();

  /* ---------- Effets liés au curseur ---------- */
  // Boutons « magnétiques » : ils se laissent attirer de quelques pixels vers le curseur.
  Array.prototype.forEach.call(document.querySelectorAll('[data-magnetic]'), function (el) {
    el.addEventListener('mousemove', function (e) {
      if (!motionOn) return;
      var box = el.getBoundingClientRect();
      var x = clamp((e.clientX - (box.left + box.width / 2)) * 0.25, -8, 8);
      var y = clamp((e.clientY - (box.top + box.height / 2)) * 0.35, -6, 6);
      el.style.translate = x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
    });
    el.addEventListener('mouseleave', function () { el.style.translate = ''; });
  });

  // Halo lumineux qui suit le curseur dans les encadrés « Repas & événements ».
  Array.prototype.forEach.call(document.querySelectorAll('.event'), function (el) {
    el.addEventListener('mousemove', function (e) {
      var box = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - box.left) + 'px');
      el.style.setProperty('--my', (e.clientY - box.top) + 'px');
    });
  });

  /* ---------- Année du copyright ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
