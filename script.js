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

  // ----- 拡大可能画像ライトボックス -----
  if (lightbox && lightboxImage && lightboxCaption) {
    document.querySelectorAll('.variety-zoomable').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        lightboxImage.innerHTML = '';
        var fullImg = document.createElement('img');
        fullImg.src = img.src;
        fullImg.alt = img.alt;
        lightboxImage.appendChild(fullImg);
        lightboxCaption.textContent = img.alt;
        lightbox.setAttribute('aria-hidden', 'false');
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  // ----- 本日の開園状況 -----

  var NEGISHI_GITHUB_REPO = 'taikiyoshino-spec/negishifarm';

  var NEGISHI_GCAL_CONFIG = {
    apiKey: '',
    calendarId: 'nesscamod@gmail.com'
  };

  var NEGISHI_OPEN_CONFIG = {
    manual: null,
    seasonFrom: { month: 7, day: 1 },
    seasonTo: { month: 8, day: 20 },
    dayOpen: '06:00',
    dayClose: '16:00',
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
    nowEl.textContent = timeStr;

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
      return setBadge('ブルーベリー狩りシーズン外', 'is-out', '');
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

  function loadStatusFromGCal(callback) {
    if (!NEGISHI_GCAL_CONFIG.apiKey || typeof fetch === 'undefined') {
      callback(null);
      return;
    }
    var now = new Date();
    var d = now.getFullYear() + '-' + openStatusPad(now.getMonth() + 1) + '-' + openStatusPad(now.getDate());
    var url = 'https://www.googleapis.com/calendar/v3/calendars/' +
      encodeURIComponent(NEGISHI_GCAL_CONFIG.calendarId) +
      '/events?key=' + NEGISHI_GCAL_CONFIG.apiKey +
      '&timeMin=' + encodeURIComponent(d + 'T00:00:00+09:00') +
      '&timeMax=' + encodeURIComponent(d + 'T23:59:59+09:00') +
      '&singleEvents=true';

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var items = (data && data.items) || [];
        var status = null;
        for (var i = 0; i < items.length; i++) {
          var title = items[i].summary || '';
          if (/休園|臨時休業|定休|お休み/.test(title)) { status = 'closed'; break; }
          if (/開園/.test(title)) { status = 'open'; }
        }
        callback(status);
      })
      .catch(function () { callback(null); });
  }

  // 優先順位: Googleカレンダー → status.json（手動）→ 時間設定（自動）
  function loadStatusAndUpdate() {
    loadStatusFromGCal(function (gcalStatus) {
      if (gcalStatus !== null) {
        NEGISHI_OPEN_CONFIG.manual = gcalStatus;
        updateOpenStatus();
        return;
      }
      if (typeof fetch === 'undefined') {
        updateOpenStatus();
        return;
      }
      fetch('status.json?_=' + Date.now())
        .then(function (r) { return r.json(); })
        .then(function (data) {
          NEGISHI_OPEN_CONFIG.manual = (data && (data.manual === 'open' || data.manual === 'closed'))
            ? data.manual : null;
          updateOpenStatus();
        })
        .catch(function () { updateOpenStatus(); });
    });
  }

  loadStatusAndUpdate();
  setInterval(loadStatusAndUpdate, 60000);

  // ----- 管理パネル（ロゴを5回タップ／クリックで表示） -----
  (function () {
    var panel = document.createElement('div');
    panel.id = 'adminPanel';
    panel.className = 'admin-panel';
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'adminPanelTitle');
    panel.innerHTML =
      '<div class="admin-panel-backdrop" id="adminPanelBackdrop"></div>' +
      '<div class="admin-panel-inner">' +
        '<button class="admin-panel-close" id="adminPanelClose" aria-label="閉じる">&times;</button>' +
        '<h2 class="admin-panel-title" id="adminPanelTitle">開園状況の管理</h2>' +
        '<p class="admin-panel-current">現在の設定：<strong id="adminCurrentLabel">—</strong></p>' +
        '<p class="admin-panel-note">変更したいステータスを選んでください。</p>' +
        '<div class="admin-status-group">' +
          '<button class="admin-status-btn admin-status-btn--open" data-status="open">開園中（手動）</button>' +
          '<button class="admin-status-btn admin-status-btn--closed" data-status="closed">休園（手動）</button>' +
          '<button class="admin-status-btn admin-status-btn--auto" data-status="">自動（日時計算に戻す）</button>' +
        '</div>' +
        '<div class="admin-action" id="adminAction" hidden>' +
          '<p class="admin-preview-label">status.json の内容：</p>' +
          '<pre class="admin-json-preview" id="adminJsonPreview"></pre>' +
          '<button class="admin-download-btn" id="adminDownloadBtn">status.json をダウンロード</button>' +
          '<div class="admin-guide" id="adminGuide"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(panel);

    var backdrop = document.getElementById('adminPanelBackdrop');
    var closeBtn = document.getElementById('adminPanelClose');
    var currentLabel = document.getElementById('adminCurrentLabel');
    var statusBtns = panel.querySelectorAll('.admin-status-btn');
    var actionSection = document.getElementById('adminAction');
    var jsonPreview = document.getElementById('adminJsonPreview');
    var downloadBtn = document.getElementById('adminDownloadBtn');
    var guideDiv = document.getElementById('adminGuide');

    function getStatusLabel(s) {
      if (s === 'open') return '開園中（手動）';
      if (s === 'closed') return '休園（手動）';
      return '自動（日時計算）';
    }

    function openAdminPanel() {
      currentLabel.textContent = getStatusLabel(NEGISHI_OPEN_CONFIG.manual || '');
      statusBtns.forEach(function (b) { b.classList.remove('is-selected'); });
      actionSection.hidden = true;
      panel.setAttribute('aria-hidden', 'false');
      panel.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeAdminPanel() {
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function selectStatus(status) {
      statusBtns.forEach(function (b) {
        b.classList.toggle('is-selected', b.dataset.status === status);
      });
      jsonPreview.textContent = JSON.stringify({ manual: status || null }, null, 2);

      var guide = '<p class="admin-guide-step">① 「status.json をダウンロード」でファイルを保存</p>';
      if (NEGISHI_GITHUB_REPO) {
        var editUrl = 'https://github.com/' + NEGISHI_GITHUB_REPO + '/edit/main/status.json';
        guide += '<p class="admin-guide-step">② <a href="' + editUrl + '" target="_blank" rel="noopener">GitHub でファイルを直接編集</a>して上の内容に書き換えてコミット、</p>';
        guide += '<p class="admin-guide-step">　 またはダウンロードしたファイルをGitHubにアップロードしてください。</p>';
      } else {
        guide += '<p class="admin-guide-step">② ダウンロードした <code>status.json</code> をサーバーの同じ場所に上書きアップロードすると反映されます。</p>';
      }
      guideDiv.innerHTML = guide;
      actionSection.hidden = false;
    }

    statusBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectStatus(btn.dataset.status);
      });
    });

    downloadBtn.addEventListener('click', function () {
      var selectedBtn = panel.querySelector('.admin-status-btn.is-selected');
      var status = selectedBtn ? selectedBtn.dataset.status : '';
      var blob = new Blob([JSON.stringify({ manual: status || null }, null, 2) + '\n'], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'status.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    backdrop.addEventListener('click', closeAdminPanel);
    closeBtn.addEventListener('click', closeAdminPanel);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) {
        closeAdminPanel();
      }
    });

    // ロゴを5回タップ／クリックで管理パネルを表示
    var logo = document.querySelector('.logo');
    var clickCount = 0;
    var clickTimer = null;
    if (logo) {
      logo.style.cursor = 'pointer';
      logo.addEventListener('click', function () {
        clickCount++;
        clearTimeout(clickTimer);
        if (clickCount >= 5) {
          clickCount = 0;
          openAdminPanel();
        } else {
          clickTimer = setTimeout(function () { clickCount = 0; }, 2500);
        }
      });
    }
  }());

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
}());
