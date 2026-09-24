/* Auberge de la Croix Blanche — interactions */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    var current = 0;
    var timer = null;
    var DELAY = 7000;

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

    var start = function () {
      if (reduceMotion) return;
      stop();
      timer = window.setInterval(function () { show(current + 1); }, DELAY);
    };
    var stop = function () {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    hero.querySelector('.hero__arrow--prev').addEventListener('click', function () { show(current - 1); start(); });
    hero.querySelector('.hero__arrow--next').addEventListener('click', function () { show(current + 1); start(); });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    // Balayage tactile
    var touchX = null;
    hero.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) { show(current + (dx < 0 ? 1 : -1)); start(); }
      touchX = null;
    });

    start();
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

  /* ---------- Année du copyright ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
