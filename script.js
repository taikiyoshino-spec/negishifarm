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

  // ----- 商品モーダル -----
  var productModal = document.getElementById('productModal');
  var productModalClose = document.getElementById('productModalClose');
  var productModalContent = document.getElementById('productModalContent');
  var productCards = document.querySelectorAll('[data-product-modal]');

  if (productModal && productModalContent && productModalClose) {
    function openProductModal(card) {
      var template = card.querySelector('.product-detail');
      if (template && template.content) {
        productModalContent.innerHTML = '';
        productModalContent.appendChild(template.content.cloneNode(true));
        productModal.setAttribute('aria-hidden', 'false');
        productModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeProductModal() {
      productModal.classList.remove('is-open');
      productModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    productCards.forEach(function (card) {
      card.addEventListener('click', function () {
        openProductModal(card);
      });
    });

    productModalClose.addEventListener('click', closeProductModal);

    productModal.querySelector('.product-modal-backdrop').addEventListener('click', closeProductModal);

    productModalContent.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (link && link.getAttribute('href') !== '#') {
        closeProductModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && productModal.classList.contains('is-open')) {
        closeProductModal();
      }
    });
  }

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

  // ----- 本日の開園状況（NEGISHI_OPEN_CONFIG を農園の実情に合わせて編集） -----
  var NEGISHI_OPEN_CONFIG = {
    manual: null,
    seasonFrom: { month: 7, day: 1 },
    seasonTo: { month: 8, day: 31 },
    dayOpen: '09:00',
    dayClose: '17:00',
    closedWeekdays: [],
    extraClosedDates: []
  };

  function openStatusPad(n) {
    return n < 10 ? '0' + n : String(n);
  }
  function openStatusDateKey(d) {
    return d.getFullYear() + '-' + openStatusPad(d.getMonth() + 1) + '-' + openStatusPad(d.getDate());
  }
  function openStatusInSeason(d, cfg) {
    var m = d.getMonth() + 1;
    var day = d.getDate();
    var x = m * 100 + day;
    var f = cfg.seasonFrom.month * 100 + cfg.seasonFrom.day;
    var t = cfg.seasonTo.month * 100 + cfg.seasonTo.day;
    return x >= f && x <= t;
  }
  function openStatusParseTime(s) {
    var p = s.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  function updateOpenStatus() {
    var nowEl = document.getElementById('openStatusNow');
    var badgeEl = document.getElementById('openStatusBadge');
    var detailEl = document.getElementById('openStatusDetail');
    if (!nowEl || !badgeEl) return;

    var cfg = NEGISHI_OPEN_CONFIG;
    var now = new Date();
    var timeStr = now.toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    nowEl.textContent = '現在の目安（日本時間）：' + timeStr;

    function setBadge(msg, className, detail) {
      badgeEl.textContent = msg;
      badgeEl.className = 'open-status-badge ' + className;
      if (detailEl) detailEl.textContent = detail || '';
    }

    if (cfg.manual === 'open') {
      return setBadge('ただいま開園中（手動表示）', 'is-open', '');
    }
    if (cfg.manual === 'closed') {
      return setBadge('本日は休園（手動表示）', 'is-closed', '');
    }

    if (cfg.closedWeekdays.indexOf(now.getDay()) !== -1) {
      return setBadge('本日は定休日（設定の目安）', 'is-closed', '定休日は NEGISHI_OPEN_CONFIG の closedWeekdays（0=日…6=土）で編集できます。');
    }
    if (cfg.extraClosedDates.indexOf(openStatusDateKey(now)) !== -1) {
      return setBadge('本日は臨時休業（設定の目安）', 'is-closed', '');
    }
    if (!openStatusInSeason(now, cfg)) {
      return setBadge('ブルーベリー狩りシーズン外（目安）', 'is-out', 'シーズン期間は NEGISHI_OPEN_CONFIG の seasonFrom / seasonTo で変更。直売のみの日は新着等でお知らせください。');
    }

    var mins = now.getHours() * 60 + now.getMinutes();
    var o = openStatusParseTime(cfg.dayOpen);
    var c = openStatusParseTime(cfg.dayClose);
    if (mins < o) {
      return setBadge('本日は開園予定（受付開始前）', 'is-pending', '受付は ' + cfg.dayOpen + ' から（設定どおり）の目安です。');
    }
    if (mins >= c) {
      return setBadge('本日の受付は終了した時間帯です（目安）', 'is-closed', '最終目安 ' + cfg.dayClose + '。実際の案内を優先してください。');
    }
    return setBadge('ただいま開園中（受付時間内の目安）', 'is-open', cfg.dayOpen + ' 〜 ' + cfg.dayClose + ' の間で受付可能とみなしています。天候・在庫で変わる場合があります。');
  }
  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);

  // ----- トップ動画: 再生エラー時（コーデック非対応・大容量障害・file:// 制限 など） -----
  var topHeroVideo = document.getElementById('topHeroVideo');
  var topVideoError = document.getElementById('topVideoError');
  if (topHeroVideo && topVideoError) {
    function showTopVideoError() {
      topVideoError.hidden = false;
    }
    topHeroVideo.addEventListener('error', showTopVideoError);
    if (topHeroVideo.error) {
      showTopVideoError();
    }
  }
})();
