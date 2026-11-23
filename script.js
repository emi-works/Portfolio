// 表示内容は content.js（window.SITE）から読み込む
(() => {
  'use strict';

  const SITE = window.SITE;

  // ---- utils ----

  const $ = (selector) => document.querySelector(selector);

  const createElement = (tag, className) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  };

  const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);

  const EXTERNAL_LINK_ICON =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>' +
    '</svg>';

  const DETAIL_LABELS = ['課題', 'やったこと', '工夫'];

  // 作品画像。表示枠（16:10）に object-fit: cover で合わせる。画像がなければ Coming soon
  const thumbImage = (url, alt) =>
    url
      ? `<img class="thumb-image" src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" width="1600" height="1000">`
      : 'Coming soon';

  // 画像の代わりの文：スクリーンショットは「〜の画面」、イラストは「〜のイメージイラスト」
  const imageAlt = (card, isIllustration) => `${card.title}の${isIllustration ? 'イメージイラスト' : '画面'}`;

  const imageBadge = (show) => (show ? '<em class="image-badge">イメージ</em>' : '');

  // GA4 のイベント送信（gtag は index.html で定義。無い環境では何もしない）
  const track = (eventName, params = {}) => {
    if (typeof gtag === 'function') gtag('event', eventName, params);
  };

  // ---- sections ----

  const app = $('#app');
  const sections = [];
  const workCards = [];

  // fullScreen: スクロール枠で包まない（TOP用。TOP は h1 が見出しを兼ねるので h2 は置かない）
  // TOP 以外は、左上に見えるセクション名をそのまま h2 にする（入れ替わりの動きは CSS）
  const addSection = (name, html, fullScreen = false) => {
    const el = createElement('section', `section section-${name.toLowerCase()}`);
    el.innerHTML = fullScreen
      ? html
      : `<div class="section-title-wrap"><h2 class="section-title"><span>${escapeHtml(name)}</span></h2></div>` +
        `<div class="section-scroll"><div class="section-inner">${html}</div></div>`;

    // 表示アニメーションの遅延用
    el.querySelectorAll('.reveal').forEach((item, i) => item.style.setProperty('--i', i));

    app.appendChild(el);
    sections.push({ name, el });
  };

  // TOP
  addSection(
    'TOP',
    `
    <div class="hero-name-wrap">
      <h1 class="hero-name reveal">${escapeHtml(SITE.name)}</h1>
    </div>
    <div class="hero-text">
      <p class="hero-catch reveal">${SITE.catch.map((part) => `<span>${escapeHtml(part)}</span>`).join('')}</p>
      <p class="hero-lead reveal">${escapeHtml(SITE.lead)}</p>
    </div>
    <div class="scroll-hint reveal" aria-hidden="true"><span>Scroll</span></div>`,
    true
  );

  // PROFILE
  const profileHtml = SITE.profile.map((line) => `<p class="reveal">${escapeHtml(line)}</p>`).join('');
  addSection('PROFILE', `<div class="profile-text">${profileHtml}</div>`);

  // WORKS
  const worksHtml = SITE.works
    .map((group) => {
      const cardsHtml = group.cards
        .map((card) => {
          const index = workCards.length;
          workCards.push({
            ...card,
            isIllustration: Boolean(group.isIllustration),
            detailLabels: card.detailLabels || group.detailLabels || DETAIL_LABELS,
            detailStyle: group.detailStyle,
          });
          const cardNote = card.cardNote || card.result; // タイトル下の一文（なければ成果）
          return `
          <button class="card reveal" data-index="${index}">
            <span class="thumb">${thumbImage(card.cardImage || card.images[0], imageAlt(card, group.isIllustration))}${imageBadge(group.isIllustration)}</span>
            <span class="card-title">${escapeHtml(card.title)}</span>
            ${cardNote ? `<span class="card-result">${escapeHtml(cardNote)}</span>` : ''}
          </button>`;
        })
        .join('');

      const noteHtml = group.note ? `<p class="works-note reveal">${escapeHtml(group.note)}</p>` : '';

      return `
      <h3 class="heading reveal">${escapeHtml(group.title)}</h3>
      <div class="works-grid">${cardsHtml}</div>
      ${noteHtml}`;
    })
    .join('');

  // 一番上に、実物ではなくイラストである旨の注意書き
  const worksNoticeHtml = SITE.worksNotice
    ? `<p class="works-notice reveal">${escapeHtml(SITE.worksNotice)}</p>`
    : '';
  addSection('WORKS', worksNoticeHtml + worksHtml);

  // STRENGTH
  const strengthsHtml = SITE.strengths
    .map(
      (item) => `
      <div class="reveal">
        <h3 class="heading">${escapeHtml(item.title)}</h3>
        <p>${item.description.map(escapeHtml).join('<br>')}</p>
      </div>`
    )
    .join('');

  addSection('STRENGTH', `<div class="strength-list">${strengthsHtml}</div>`);

  // SKILL
  const skillsHtml = SITE.skills
    .map(
      (skill) => `
      <div class="reveal">
        <b>${escapeHtml(skill.name)}</b>
        <span>${escapeHtml(skill.description)}</span>
      </div>`
    )
    .join('');

  addSection(
    'SKILL',
    `
    <div class="skill-list">${skillsHtml}</div>
    <h3 class="heading code-heading reveal">書けるコード</h3>
    ${SITE.languages
      .map(
        (group) => `
    <div class="code-group reveal">
      <span class="code-label">${escapeHtml(group.label)}</span>
      <p class="code-list">${group.items.map(escapeHtml).join('　／　')}</p>
    </div>`
      )
      .join('')}
    <p class="ai-note reveal">${escapeHtml(SITE.aiNote)}</p>`
  );

  // CONTACT
  const formConfig = SITE.form;
  const typeOptionsHtml = formConfig.types.map((type) => `<option>${escapeHtml(type)}</option>`).join('');
  // 項目名 + 必須マーク + 入力欄 + エラー表示
  const field = (label, controlHtml) => `
      <label class="field">
        <span class="field-label">${label}<em class="required">必須</em></span>
        ${controlHtml}
        <span class="field-error" aria-live="polite"></span>
      </label>`;

  addSection(
    'CONTACT',
    `
    <form id="contact-form" method="post" target="hidden-frame" class="reveal" novalidate>
      ${field('名前', `<input name="${escapeHtml(formConfig.entries.name)}" required>`)}
      ${field(
        'メールアドレス',
        `<input type="email" name="${escapeHtml(formConfig.entries.email)}" required pattern="[^@\\s]+@[^@\\s]+\\.[^@\\s]+" placeholder="name@example.com">`
      )}
      ${field(
        '依頼の種類',
        `<select name="${escapeHtml(formConfig.entries.type)}" required>
          <option value="" disabled selected>選択してください</option>
          ${typeOptionsHtml}
        </select>`
      )}
      ${field('内容', `<textarea name="${escapeHtml(formConfig.entries.message)}" required></textarea>`)}
      <button class="submit-button" type="submit">送信する</button>
    </form>
    <iframe name="hidden-frame" hidden></iframe>
    <p class="small-text reveal" id="form-status" role="status">${SITE.privacy.map(escapeHtml).join('<br>')}</p>
    <p class="small-text reveal">© 2026 ${escapeHtml(SITE.name)}<a class="source-link" href="${escapeHtml(SITE.sourceUrl)}" target="_blank" rel="noopener">Source code</a></p>`
  );

  // ---- contact form ----

  const form = $('#contact-form');
  const formFields = [...form.querySelectorAll('input, select, textarea')];
  const submitButton = form.querySelector('.submit-button');
  const hiddenFrame = $('iframe[name="hidden-frame"]');
  const formStatus = $('#form-status');

  const ERROR_REQUIRED = 'この質問は必須です';
  const ERROR_EMAIL = 'メールアドレスの形式で入力してください（例：name@example.com）';

  // ブラウザ標準の吹き出しは使わず（novalidate）、各欄の下にエラーを出す
  const validateField = (el) => {
    let message = '';
    if (!el.value.trim()) message = ERROR_REQUIRED;
    else if (!el.checkValidity()) message = ERROR_EMAIL;

    el.closest('.field').querySelector('.field-error').textContent = message;
    el.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  };

  // 一度エラーになった欄は、入力し直したらその場で再チェック
  const revalidate = (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true') validateField(e.target);
  };
  form.addEventListener('input', revalidate);
  form.addEventListener('change', revalidate);

  let isSending = false;

  form.action = formConfig.action;
  form.addEventListener('submit', (e) => {
    const invalidFields = formFields.filter((el) => !validateField(el));
    if (invalidFields.length) {
      e.preventDefault();
      invalidFields[0].focus();
      return;
    }
    if (!formConfig.action) {
      e.preventDefault();
      formStatus.textContent = '【追記】送信先（GoogleフォームのURL）が未設定です。';
      return;
    }
    isSending = true;
    submitButton.disabled = true;
  });

  // Googleフォームの応答が hidden-frame に返ってきたら完了とする（成否までは判別できない）
  hiddenFrame.addEventListener('load', () => {
    if (!isSending) return;
    isSending = false;
    submitButton.disabled = false;
    form.reset();
    openThanks();
    track('contact_submit');
  });

  // ---- section navigation ----

  const navList = $('#nav ul');
  const navMarker = $('.nav-marker');
  const contactCta = $('#contact-cta');
  const contactIndex = sections.findIndex((section) => section.name === 'CONTACT');
  if (contactCta) contactCta.addEventListener('click', () => goTo(contactIndex));
  const modal = $('#modal');

  const TRANSITION_LOCK_MS = 1000;

  let currentIndex = -1;
  let isLocked = false;

  sections.forEach((section, i) => {
    const li = createElement('li');
    li.innerHTML = `<button aria-label="${section.name}"></button><span class="nav-label">${section.name}</span>`;
    li.querySelector('button').addEventListener('click', () => goTo(i));
    navList.appendChild(li);
  });
  const navItems = [...navList.children];

  function goTo(index) {
    index = Math.max(0, Math.min(sections.length - 1, index));
    if (index === currentIndex || isLocked) return;

    // 現在地マーカーの移動先。DOM を書き換える前に読み、レイアウトの再計算を増やさない
    const markerTop = navItems[index].offsetTop;

    // アニメーション中の連続操作を防ぐ
    isLocked = true;
    setTimeout(() => {
      isLocked = false;
    }, TRANSITION_LOCK_MS);

    const direction = index > currentIndex ? 1 : -1;
    currentIndex = index;

    sections.forEach(({ el }, i) => {
      el.classList.toggle('is-current', i === index);
      el.classList.toggle('is-above', i < index);
      el.inert = i !== index;
    });

    const scroller = sections[index].el.querySelector('.section-scroll');
    if (scroller) scroller.scrollTop = 0;

    navMarker.style.transform = `translateY(${markerTop}px)`;
    navItems.forEach((li, i) => li.classList.toggle('is-current', i === index));

    // CONTACT 表示中はお問い合わせボタンを隠す
    if (contactCta) contactCta.classList.toggle('is-hidden', index === contactIndex);

    // 背景（background.js）に切り替えを知らせる
    dispatchEvent(new CustomEvent('sectionchange', { detail: { index, name: sections[index].name, direction } }));

    track('section_view', { section_name: sections[index].name });
  }

  goTo(0);

  // 低い画面ではナビの間隔が変わるので、マーカーの位置を合わせ直す
  addEventListener('resize', () => {
    navMarker.style.transform = `translateY(${navItems[currentIndex].offsetTop}px)`;
  });

  // セクション内にまだスクロールの余地があるか
  const canScrollInside = (scroller, deltaY) => {
    const maxScroll = scroller.scrollHeight - scroller.clientHeight;
    return (
      maxScroll > 2 &&
      ((deltaY > 0 && scroller.scrollTop < maxScroll - 2) || (deltaY < 0 && scroller.scrollTop > 2))
    );
  };

  // wheel
  // タッチパッドは小さい deltaY が連続で来るので、1回の操作分を合計して判定する。
  // 切り替え後も慣性のイベントが続くので、同じ操作の間は無視する。
  const WHEEL_GAP_MS = 200; // これ以上間が空いたら別の操作とみなす
  const WHEEL_THRESHOLD = 50;
  const NEW_PUSH_MARGIN = 10; // 止まってからの最小値よりこれだけ強ければ、次の操作とみなす
  let lastWheelTime = 0;
  let wheelDelta = 0;
  let hasScrolledInside = false;
  let isWheelPaused = false; // 切り替え後・端に着いた後は、次の操作まで止める
  let pausedMinAbs = 0;

  const pauseWheel = (abs) => {
    isWheelPaused = true;
    pausedMinAbs = abs;
  };

  addEventListener(
    'wheel',
    (e) => {
      if (modal.open) return;

      const now = Date.now();
      const abs = Math.abs(e.deltaY);
      const isGap = now - lastWheelTime > WHEEL_GAP_MS;
      lastWheelTime = now;

      // 慣性は減速していくだけなので、止まってから勢いが強まったら次の操作とみなす
      const isNewPush = isWheelPaused && !isLocked && abs > pausedMinAbs + NEW_PUSH_MARGIN;

      if (isGap || isNewPush) {
        wheelDelta = 0;
        hasScrolledInside = false;
        isWheelPaused = false;
      }

      // 切り替え中と、切り替え後の慣性では移動先の中身もスクロールさせない
      if (isLocked || isWheelPaused) {
        e.preventDefault();
        pausedMinAbs = Math.min(pausedMinAbs, abs);
        return;
      }

      const scroller = e.target.closest('.section-scroll');
      if (scroller && canScrollInside(scroller, e.deltaY)) {
        hasScrolledInside = true;
        return;
      }

      e.preventDefault();

      // 中身をスクロールして端に着いた操作では切り替えず、一度止める
      if (hasScrolledInside) {
        pauseWheel(abs);
        return;
      }

      wheelDelta += e.deltaY;
      if (Math.abs(wheelDelta) > WHEEL_THRESHOLD) {
        pauseWheel(abs);
        goTo(currentIndex + (wheelDelta > 0 ? 1 : -1));
      }
    },
    { passive: false }
  );

  // swipe
  const SWIPE_THRESHOLD = 60;
  let touchStartY = 0;
  let touchScroller = null;
  let touchStartScrollTop = 0;

  addEventListener(
    'touchstart',
    (e) => {
      touchStartY = e.touches[0].clientY;
      touchScroller = e.target.closest('.section-scroll');
      touchStartScrollTop = touchScroller ? touchScroller.scrollTop : 0;
    },
    { passive: true }
  );

  addEventListener('touchend', (e) => {
    if (modal.open) return;

    const deltaY = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;

    // 指を置いた時点で端にいたときだけ切り替える（端に着いた操作では一度止める）。
    // iOS は端でバウンスして scrollTop が動くので、操作中の変化では判定しない。
    if (touchScroller) {
      const maxScroll = touchScroller.scrollHeight - touchScroller.clientHeight;
      const wasAtEdge = deltaY > 0 ? touchStartScrollTop >= maxScroll - 2 : touchStartScrollTop <= 2;
      if (maxScroll > 2 && !wasAtEdge) return;
    }

    goTo(currentIndex + (deltaY > 0 ? 1 : -1));
  });

  // ---- modal ----

  let activeCard = null;
  let imageIndex = 0;
  let lastFocused = null;

  function renderModal(focusSelector) {
    const card = activeCard;
    const hasMultipleImages = card.images.length > 1;
    const linkAttrs = `href="${escapeHtml(card.url)}" target="_blank" rel="noopener"`;

    const arrowsHtml = hasMultipleImages
      ? '<button class="slider-arrow prev" aria-label="前へ">‹</button>' +
        '<button class="slider-arrow next" aria-label="次へ">›</button>'
      : '';

    // サムネイルの画像は飾り（alt=""）。説明はボタンの aria-label で行う
    const thumbnailsHtml = hasMultipleImages
      ? `<div class="thumbnails">${card.images
          .map((src, i) => {
            const activeClass = i === imageIndex ? 'is-active' : '';
            const img = src ? `<img src="${escapeHtml(src)}" alt="" loading="lazy" decoding="async" width="1600" height="1000">` : '';
            return `<button class="${activeClass}" data-index="${i}" aria-label="${i + 1}枚目の画像を表示">${img}</button>`;
          })
          .join('')}</div>`
      : '<div class="thumbnails-spacer"></div>';

    const mainAlt = imageAlt(card, card.isIllustration) + (hasMultipleImages ? `（${imageIndex + 1}枚目／全${card.images.length}枚）` : '');

    const titleHtml = card.url
      ? `<a ${linkAttrs}>${escapeHtml(card.name)}</a><a ${linkAttrs} aria-label="開く">${EXTERNAL_LINK_ICON}</a>`
      : escapeHtml(card.name);

    // 空の項目は見出しごと出さない（ポップアップ内の小見出しは h3）
    const block = (label, text) => (text ? `<h3>${label}</h3><p>${escapeHtml(text)}</p>` : '');
    const listOrText = (value) =>
      Array.isArray(value)
        ? `<ul class="detail-list">${value.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
        : `<p>${escapeHtml(value)}</p>`;
    const hasValue = (value) => (Array.isArray(value) ? value.length > 0 : Boolean(value));

    // 詳細：見出しごとに分ける形（kintoneデモ）と、「詳細」の下にまとめる形
    const detailsHtml =
      card.detailStyle === 'sections'
        ? card.detailLabels.map((label, i) => (hasValue(card.details[i]) ? `<h3>${label}</h3>${listOrText(card.details[i])}` : '')).join('')
        : card.detailLabels.map((label, i) =>
            card.details[i] ? `<p><b>${label}</b>　${escapeHtml(card.details[i])}</p>` : ''
          ).join('');

    // 使った技術はタグで表示（「、」「・」「,」「/」区切りの文字でも配列でもよい）
    const techTags = (Array.isArray(card.tech) ? card.tech : String(card.tech || '').split(/\s*[、・,，／/]\s*/))
      .map((t) => t.trim())
      .filter(Boolean);
    const techHtml = techTags.length
      ? `<h3>使った技術</h3><ul class="tech-tags">${techTags.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`
      : '';

    // 独立したリンク（GitHub など）
    const linksHtml = (card.links || []).length
      ? `<p class="modal-links">${card.links
          .map((l) => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)}${EXTERNAL_LINK_ICON}</a>`)
          .join('')}</p>`
      : '';

    // ポップアップのタイトルは h2（dialog の名前にも使う）
    modal.setAttribute('aria-labelledby', 'modal-title');
    modal.innerHTML = `
      <div class="modal-box">
        <button class="modal-close" aria-label="閉じる">×</button>
        <div class="slider">
          <div class="thumb">${thumbImage(card.images[imageIndex], mainAlt)}${imageBadge(card.isIllustration)}</div>
          ${arrowsHtml}
        </div>
        ${thumbnailsHtml}
        <h2 id="modal-title">${titleHtml}</h2>
        ${block('概要', card.summary)}
        ${block('成果', card.result)}
        ${
          card.detailStyle === 'sections'
            ? `${detailsHtml}${techHtml}`
            : `${techHtml}${detailsHtml ? `<h3>詳細</h3>${detailsHtml}` : ''}`
        }
        ${linksHtml}
      </div>`;

    if (focusSelector) modal.querySelector(focusSelector)?.focus();
  }

  // <dialog> を showModal() で開く。外側は自動で操作できなくなる（Tab の周回は keydown で処理）
  const showDialog = (focusSelector) => {
    if (!modal.open) modal.showModal();
    modal.querySelector(focusSelector).focus();
  };

  const openModal = (cardButton) => {
    lastFocused = cardButton;
    activeCard = workCards[Number(cardButton.dataset.index)];
    imageIndex = 0;
    renderModal();
    showDialog('.modal-close');
    track('work_open', { work_title: activeCard.title });
  };

  const closeModal = () => {
    if (modal.open) modal.close();
  };

  // Esc（ブラウザ標準の閉じ方）でも、×や背景クリックでも、閉じたら元の場所にフォーカスを戻す
  modal.addEventListener('close', () => {
    if (lastFocused) lastFocused.focus();
  });

  // 送信完了のポップアップ
  function openThanks() {
    activeCard = null;
    lastFocused = submitButton;
    modal.setAttribute('aria-labelledby', 'thanks-title');
    modal.innerHTML = `
      <div class="modal-box modal-thanks">
        <h2 id="thanks-title">${escapeHtml(formConfig.thanks.title)}</h2>
        <p>${escapeHtml(formConfig.thanks.message)}</p>
        <button class="submit-button thanks-close">閉じる</button>
      </div>`;
    showDialog('.thanks-close');
  }

  // 端まで行ったらループ
  const showNextImage = (step) => {
    const count = activeCard.images.length;
    imageIndex = (imageIndex + step + count) % count;
    renderModal(step > 0 ? '.slider-arrow.next' : '.slider-arrow.prev');
  };

  app.addEventListener('click', (e) => {
    const cardButton = e.target.closest('.card');
    if (cardButton) openModal(cardButton);
  });

  modal.addEventListener('click', (e) => {
    const target = e.target;

    // 背景・×・送信完了の「閉じる」
    if (target === modal || target.closest('.modal-close, .thanks-close')) return closeModal();

    const arrow = target.closest('.slider-arrow');
    if (arrow) return showNextImage(arrow.classList.contains('next') ? 1 : -1);

    const thumbnail = target.closest('.thumbnails button');
    if (thumbnail) {
      imageIndex = Number(thumbnail.dataset.index);
      renderModal(`.thumbnails [data-index="${imageIndex}"]`);
    }
  });

  // ---- keyboard ----

  addEventListener('keydown', (e) => {
    if (modal.open) {
      // Tab はポップアップの中だけで回す（最後の次は最初へ、最初の前は最後へ。ブラウザのUIにも抜けない）
      if (e.key === 'Tab') {
        const focusables = [...modal.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      if (e.key === 'Escape') {
        closeModal();
      } else if (activeCard && activeCard.images.length > 1 && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        showNextImage(e.key === 'ArrowRight' ? 1 : -1);
      }
      return;
    }

    // フォーム入力中は無視
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      goTo(currentIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goTo(currentIndex - 1);
    }
  });
})();
