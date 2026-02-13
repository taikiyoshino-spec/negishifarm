/**
 * 根岸FARM - メインスクリプト
 * モバイルナビ・スムーススクロール・ギャラリーライトボックス
 */

(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.querySelectorAll('.nav-list a');
  var galleryGrid = document.getElementById('galleryGrid');
  var lightbox = document.getElementById('lightbox');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxImage = document.getElementById('lightboxImage');
  var lightboxCaption = document.getElementById('lightboxCaption');

  // ----- モバイルナビ開閉 -----
  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-label', 'メニューを開く');
        document.body.style.overflow = '';
      });
    });
  }

  // ----- スムーススクロール（アンカーリンク） -----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    var href = anchor.getAttribute('href');
    if (href === '#') return;
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ----- ギャラリーライトボックス -----
  if (galleryGrid && lightbox && lightboxClose && lightboxImage && lightboxCaption) {
    var items = galleryGrid.querySelectorAll('.gallery-item');

    function openLightbox(index) {
      var item = items[index];
      if (!item) return;
      var thumb = item.querySelector('.gallery-thumb');
      var captionEl = item.querySelector('.gallery-caption');
      var caption = captionEl ? captionEl.textContent : '';

      // 背景スタイルをコピー（プレースホルダー用）、または img があれば表示
      var img = item.querySelector('.gallery-thumb img');
      if (img && img.src) {
        lightboxImage.innerHTML = '';
        var fullImg = document.createElement('img');
        fullImg.src = img.dataset.full || img.src;
        fullImg.alt = caption;
        lightboxImage.appendChild(fullImg);
      } else {
        lightboxImage.innerHTML = '';
        var div = document.createElement('div');
        div.className = 'gallery-thumb';
        div.style.cssText = thumb ? thumb.getAttribute('style') || '' : '';
        div.style.width = 'min(90vw, 400px)';
        div.style.height = 'min(90vw, 400px)';
        div.style.margin = '0 auto';
        div.style.borderRadius = '12px';
        lightboxImage.appendChild(div);
      }

      lightboxCaption.textContent = caption;
      lightbox.setAttribute('aria-hidden', 'false');
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    items.forEach(function (item, index) {
      item.addEventListener('click', function () {
        openLightbox(index);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }
})();
