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

  // ----- 予約フォームモーダル -----
  var reservationModal = document.getElementById('reservationModal');
  var reservationModalClose = document.getElementById('reservationModalClose');
  var openReservationModalBtns = document.querySelectorAll('[data-open-reservation-modal]');

  if (reservationModal && reservationModalClose && openReservationModalBtns.length) {
    function openReservationModal() {
      reservationModal.setAttribute('aria-hidden', 'false');
      reservationModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeReservationModal() {
      reservationModal.classList.remove('is-open');
      reservationModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openReservationModalBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openReservationModal();
      });
    });
    reservationModalClose.addEventListener('click', closeReservationModal);
    reservationModal.querySelector('.product-modal-backdrop').addEventListener('click', closeReservationModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && reservationModal.classList.contains('is-open')) {
        closeReservationModal();
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
    apiKey: 'AIzaSyA3GerkBCFAdaHUdUmjb2M6_g0XISdNbrY',
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

  function setReservationButtonsEnabled(enabled) {
    openReservationModalBtns.forEach(function (btn) {
      btn.disabled = !enabled;
    });
  }

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

    setReservationButtonsEnabled(true);

    if (cfg.manual === 'open') {
      return setBadge('ただいま開園中（手動表示）', 'is-open', '');
    }
    if (cfg.manual === 'closed') {
      return setBadge('本日は休園（手動表示）', 'is-closed', '');
    }

    if (cfg.closedWeekdays.indexOf(now.getDay()) !== -1) {
      return setBadge('本日は定休日', 'is-closed', '');
    }
    if (cfg.extraClosedDates.indexOf(openStatusDateKey(now)) !== -1) {
      return setBadge('本日は臨時休業', 'is-closed', '');
    }
    if (cfg.calendarStatus === 'offseason' || !openStatusInSeason(now, cfg)) {
      setReservationButtonsEnabled(false);
      return setBadge('ブルーベリー狩りシーズン外', 'is-out', '');
    }
    if (cfg.calendarStatus === 'closed') {
      return setBadge('本日は休園予定です', 'is-closed', '');
    }

    var mins = now.getHours() * 60 + now.getMinutes();
    var o = openStatusParseTime(cfg.dayOpen);
    var c = openStatusParseTime(cfg.dayClose);
    if (mins < o) {
      return setBadge('本日は開園予定（受付開始前）', 'is-pending', '受付開始は ' + cfg.dayOpen + ' からです。');
    }
    if (mins >= c) {
      return setBadge('本日の受付は終了しました', 'is-closed', '');
    }
    if (cfg.calendarStatus !== 'open') {
      return setBadge('本日は休園', 'is-closed', '本日の開園予定がカレンダーに登録されていません。ご来園前にお電話でご確認ください。');
    }
    return setBadge('ただいま開園中', 'is-open', cfg.dayOpen + ' 〜 ' + cfg.dayClose);
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
        var hasClosed = false, hasOpen = false, hasOffseason = false;
        for (var i = 0; i < items.length; i++) {
          var title = items[i].summary || '';
          if (/休園|臨時休業|定休|お休み/.test(title)) { hasClosed = true; }
          if (/オフシーズン/.test(title)) { hasOffseason = true; }
          if (/開園/.test(title)) { hasOpen = true; }
        }
        var status = hasClosed ? 'closed' : (hasOffseason ? 'offseason' : (hasOpen ? 'open' : null));
        callback(status);
      })
      .catch(function () { callback(null); });
  }

  // cfg.manual（status.json の人為的な強制表示）は営業時間を無視して即座に反映する。
  // cfg.calendarStatus（Googleカレンダーの「開園」「休園」予定）は、あくまで
  // 「今日は営業日か」の判定に使うだけで、実際の受付時間（dayOpen〜dayClose）は
  // 別途チェックする。予定が1件も無い日は自動的に休園扱いとするフェイルセーフ。
  function loadStatusAndUpdate() {
    loadStatusFromGCal(function (gcalStatus) {
      NEGISHI_OPEN_CONFIG.calendarStatus = gcalStatus;
      if (typeof fetch === 'undefined') {
        NEGISHI_OPEN_CONFIG.manual = null;
        updateOpenStatus();
        return;
      }
      fetch('status.json?_=' + Date.now())
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var manual = (data && (data.manual === 'open' || data.manual === 'closed'))
            ? data.manual : null;
          NEGISHI_OPEN_CONFIG.manual = manual;
          updateOpenStatus();
        })
        .catch(function () {
          NEGISHI_OPEN_CONFIG.manual = null;
          updateOpenStatus();
        });
    });
  }

  loadStatusAndUpdate();
  setInterval(loadStatusAndUpdate, 60000);

  // ----- 予約フォーム -----

  var NEGISHI_RESERVATION_CONFIG = {
    // デプロイ後、GASのウェブアプリURLをここに貼り付けてください（README参照）
    webAppUrl: 'https://script.google.com/macros/s/AKfycbwZ7Stq82oiVI5V4Qrlv4NNNvJMkQZQXVxgD4x1LVD_JBYkhy94Tm6tqWhjrMHE5-YjkA/exec'
  };

  function buildTimeSlots(dayOpen, dayClose) {
    var slots = [];
    var o = openStatusParseTime(dayOpen);
    var c = openStatusParseTime(dayClose);
    for (var mins = o; mins < c; mins += 60) {
      var h = openStatusPad(Math.floor(mins / 60));
      var m = openStatusPad(mins % 60);
      slots.push(h + ':' + m);
    }
    return slots;
  }

  function checkDateAvailability(dateStr, callback) {
    var parts = dateStr.split('-');
    var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    var cfg = NEGISHI_OPEN_CONFIG;

    if (!openStatusInSeason(d, cfg)) {
      return callback({ status: 'closed', reason: 'ブルーベリー狩りシーズン外の日付です。' });
    }
    if (cfg.closedWeekdays.indexOf(d.getDay()) !== -1) {
      return callback({ status: 'closed', reason: 'この日は定休日です。' });
    }
    if (cfg.extraClosedDates.indexOf(dateStr) !== -1) {
      return callback({ status: 'closed', reason: 'この日は臨時休業です。' });
    }

    var noScheduleReason = 'この日の開園予定がまだ登録されていません。お電話にてご確認ください。';

    if (!NEGISHI_GCAL_CONFIG.apiKey || typeof fetch === 'undefined') {
      return callback({ status: 'closed', reason: noScheduleReason });
    }

    var url = 'https://www.googleapis.com/calendar/v3/calendars/' +
      encodeURIComponent(NEGISHI_GCAL_CONFIG.calendarId) +
      '/events?key=' + NEGISHI_GCAL_CONFIG.apiKey +
      '&timeMin=' + encodeURIComponent(dateStr + 'T00:00:00+09:00') +
      '&timeMax=' + encodeURIComponent(dateStr + 'T23:59:59+09:00') +
      '&singleEvents=true';

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var items = (data && data.items) || [];
        var hasClosed = false, hasOpen = false, hasOffseason = false;
        for (var i = 0; i < items.length; i++) {
          var title = items[i].summary || '';
          if (/休園|臨時休業|定休|お休み/.test(title)) { hasClosed = true; }
          if (/オフシーズン/.test(title)) { hasOffseason = true; }
          if (/開園/.test(title)) { hasOpen = true; }
        }
        if (hasClosed) {
          return callback({ status: 'closed', reason: 'この日は休園予定です。' });
        }
        if (hasOffseason) {
          return callback({ status: 'closed', reason: 'ブルーベリー狩りシーズン外の日付です。' });
        }
        if (hasOpen) {
          return callback({ status: 'open', reason: '' });
        }
        callback({ status: 'closed', reason: noScheduleReason });
      })
      .catch(function () { callback({ status: 'closed', reason: noScheduleReason }); });
  }

  var reservationForm = document.getElementById('reservationForm');
  if (reservationForm) {
    var resDate = document.getElementById('resDate');
    var resTime = document.getElementById('resTime');
    var resAvailability = document.getElementById('resAvailability');
    var resSubmitBtn = document.getElementById('resSubmitBtn');
    var resFormMessage = document.getElementById('resFormMessage');

    (function setDateRange() {
      var y = new Date().getFullYear();
      var cfg = NEGISHI_OPEN_CONFIG;
      var seasonFromStr = y + '-' + openStatusPad(cfg.seasonFrom.month) + '-' + openStatusPad(cfg.seasonFrom.day);
      var todayStr = openStatusDateKey(new Date());
      resDate.min = todayStr > seasonFromStr ? todayStr : seasonFromStr;
      resDate.max = y + '-' + openStatusPad(cfg.seasonTo.month) + '-' + openStatusPad(cfg.seasonTo.day);
    }());

    function showAvailability(msg, className) {
      if (!msg) {
        resAvailability.hidden = true;
        return;
      }
      resAvailability.textContent = msg;
      resAvailability.className = 'form-availability ' + className;
      resAvailability.hidden = false;
    }

    resDate.addEventListener('change', function () {
      resTime.innerHTML = '';
      if (!resDate.value) {
        resTime.disabled = true;
        showAvailability('', '');
        return;
      }
      resTime.disabled = true;
      var loadingOpt = document.createElement('option');
      loadingOpt.textContent = '空き状況を確認しています…';
      resTime.appendChild(loadingOpt);

      checkDateAvailability(resDate.value, function (result) {
        resTime.innerHTML = '';
        if (result.status === 'closed') {
          showAvailability(result.reason, 'is-closed');
          var noneOpt = document.createElement('option');
          noneOpt.value = '';
          noneOpt.textContent = '選択できる時間帯がありません';
          resTime.appendChild(noneOpt);
          resTime.disabled = true;
          if (resSubmitBtn) resSubmitBtn.disabled = true;
          return;
        }
        showAvailability('', '');
        var slots = buildTimeSlots(NEGISHI_OPEN_CONFIG.dayOpen, NEGISHI_OPEN_CONFIG.dayClose);
        slots.forEach(function (slot) {
          var opt = document.createElement('option');
          opt.value = slot;
          opt.textContent = slot + '〜';
          resTime.appendChild(opt);
        });
        resTime.disabled = false;
        if (resSubmitBtn) resSubmitBtn.disabled = false;
      });
    });

    function showFormMessage(msg, className) {
      if (!resFormMessage) return;
      resFormMessage.textContent = msg;
      resFormMessage.className = 'form-message ' + className;
      resFormMessage.hidden = false;
    }

    reservationForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var email = document.getElementById('resEmail').value.trim();
      if (!email) {
        showFormMessage('メールアドレスをご入力ください。メールアドレスがない場合はお電話にてご予約ください。', 'is-error');
        return;
      }

      var adults = parseInt(document.getElementById('resAdults').value, 10) || 0;
      var elementary = parseInt(document.getElementById('resElementary').value, 10) || 0;
      var infants = parseInt(document.getElementById('resInfants').value, 10) || 0;
      if (adults + elementary + infants <= 0) {
        showFormMessage('人数を1名以上でご入力ください。', 'is-error');
        return;
      }
      if (!resTime.value) {
        showFormMessage('来園希望時刻を選択してください。', 'is-error');
        return;
      }

      if (!NEGISHI_RESERVATION_CONFIG.webAppUrl) {
        showFormMessage('現在フォームからの送信は準備中です。お手数ですがお電話（080-6003-1840）にてご連絡ください。', 'is-error');
        return;
      }

      if (resSubmitBtn) resSubmitBtn.disabled = true;
      showFormMessage('送信しています…', '');

      var formData = new FormData(reservationForm);
      fetch(NEGISHI_RESERVATION_CONFIG.webAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      }).then(function () {
        showFormMessage('ご予約を受け付けました。ご入力のメールアドレスに確認メールをお送りしています。', 'is-success');
        reservationForm.reset();
        resTime.innerHTML = '<option value="">日付を選択してください</option>';
        resTime.disabled = true;
        showAvailability('', '');
      }).catch(function () {
        showFormMessage('送信に失敗しました。お手数ですがお電話（080-6003-1840）にてご連絡ください。', 'is-error');
      }).then(function () {
        if (resSubmitBtn) resSubmitBtn.disabled = false;
      });
    });
  }

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
