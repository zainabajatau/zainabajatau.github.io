/* Builds the page from the files in /content.
   Edit the content through Pages CMS (see HOW-TO-EDIT.md), not in here. */
(function () {
  'use strict';
  var d = document;
  var SECTIONS = ['home', 'about', 'explore', 'writing', 'photography', 'video',
                  'publications', 'notes', 'podcast', 'zayform', 'contact'];

  /* ---------- small helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  // plain text -> safe HTML; *word* becomes italic, line breaks are kept
  function rich(s) {
    return esc(s).replace(/\*([^*\n]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
  }
  function paras(s) {
    return String(s || '').split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
  }
  // CMS may store /assets/images/x.jpg; make it relative so it also works on subfolder hosting
  function img(p) { return esc(String(p || '').trim().replace(/^\/+/, '')); }
  function href(u) {
    u = String(u || '').trim();
    return /^(javascript|data|vbscript):/i.test(u) ? '#' : esc(u);
  }
  function ext(u) { return /^https?:/i.test(String(u || '').trim()) ? ' target="_blank" rel="noopener"' : ''; }
  function list(a) { return Array.isArray(a) ? a : []; }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function quoted(s) { return '“' + String(s || '').replace(/^[“”"]+|[“”"]+$/g, '') + '”'; }
  function target(t) {
    t = String(t || '').trim();
    return /^(https?:|mailto:|#)/i.test(t) ? t : '#' + t;
  }

  /* ---------- section builders ---------- */
  var build = {
    home: function (c) {
      var first = c.first_name || '', last = c.last_name || '';
      var full = (first + ' ' + last).trim();
      var t = esc(c.ticker || '');
      var tick = t ? (t + ' &nbsp;✺&nbsp; ').repeat(4) : '';
      return '<section id="home" class="intro" aria-label="Home"><div class="wrap home-grid"><div>' +
        (c.kicker ? '<p class="kicker">' + esc(c.kicker) + '</p>' : '') +
        '<h1 aria-label="' + esc(full) + '">' +
          '<span class="ln" aria-hidden="true"><span data-split>' + esc(first) + '</span></span>' +
          '<span class="ln" aria-hidden="true"><span data-split>' + esc(last) + '</span></span></h1>' +
        (c.tagline ? '<p class="sub">' + esc(c.tagline) + '</p>' : '') +
        (c.quote ? '<div class="home-quote"><blockquote>' + quoted(c.quote) + '</blockquote></div>' : '') +
        '<p class="home-cta">' +
          (c.cta_primary ? '<a href="#explore">' + esc(c.cta_primary) + '</a>' : '') +
          (c.cta_secondary ? '<a href="#contact">' + esc(c.cta_secondary) + '</a>' : '') + '</p></div>' +
        (c.hero_image ? '<figure class="hero-frame"><img src="' + img(c.hero_image) + '" alt="' + esc(c.hero_alt) + '"></figure>' : '') +
        '</div></section>' +
        (tick ? '<div class="ticker" aria-hidden="true"><div>' + tick + '</div></div>' : '');
    },

    about: function (c) {
      return '<section id="about"><div class="wrap">' +
        (c.label ? '<p class="subtle-lede reveal">' + esc(c.label) + '</p>' : '') +
        '<h2 class="reveal">' + esc(c.heading) + '</h2><div class="hello">' +
        (c.photo ? '<div class="hello-photo"><img src="' + img(c.photo) + '" alt="' + esc(c.photo_alt) + '" loading="lazy"></div>' : '<div></div>') +
        '<div class="reveal">' + (c.subheading ? '<h3>' + esc(c.subheading) + '</h3>' : '') +
        paras(c.text).map(function (p) { return '<p>' + rich(p) + '</p>'; }).join('') +
        '</div></div></div></section>';
    },

    explore: function (c) {
      return '<section id="explore"><div class="wrap">' +
        (c.label ? '<p class="subtle-lede reveal">' + esc(c.label) + '</p>' : '') +
        '<h2 class="reveal">' + esc(c.heading) + '</h2><div class="cards">' +
        list(c.cards).map(function (k) {
          return '<a class="xcard reveal" href="' + href(target(k.target)) + '">' +
            '<span class="tag">' + esc(k.tag) + '</span><h3>' + esc(k.title) + '</h3><p>' + esc(k.text) + '</p>' +
            '<span class="go">' + esc(k.link_text) + '</span></a>';
        }).join('') + '</div></div></section>';
    },

    writing: function (c) {
      var n = 0;
      var essays = list(c.essays).map(function (e) {
        n++;
        var id = 'essay-' + n;
        var body = paras(e.body);
        var first = body[0] ? body[0].replace(/\*/g, '').replace(/\s+/g, ' ') : '';
        var excerpt = e.excerpt || (first.length > 150 ? first.slice(0, 150).replace(/\s+\S*$/, '') + '…' : first);
        var orig = e.original_url
          ? '<p class="orig"><a href="' + href(e.original_url) + '"' + ext(e.original_url) + '>' + esc(e.original_label || 'Read the original') + '</a></p>' : '';
        return '<article class="article reveal"><div class="card-head"><div>' +
          '<h3>' + esc(e.title) + '</h3>' +
          (e.subtitle ? '<p class="sub-t">' + esc(e.subtitle) + '</p>' : '') +
          (e.date ? '<p class="date">' + esc(e.date) + '</p>' : '') +
          (excerpt ? '<p class="excerpt">' + esc(excerpt) + '</p>' : '') +
          '</div><button class="btn toggle" aria-expanded="false" aria-controls="' + id + '">Read more</button></div>' +
          '<div class="reading" id="' + id + '"><div><div class="page"><div class="text">' +
          '<h4>' + esc(e.title) + '</h4>' +
          (e.subtitle ? '<p class="subtitle">' + esc(e.subtitle) + '</p>' : '') +
          body.map(function (p) { return '<p>' + rich(p) + '</p>'; }).join('') + orig +
          '</div></div></div></div></article>';
      }).join('');
      var more = c.more_title
        ? '<div class="more reveal"><h3>' + esc(c.more_title) + '</h3>' +
          (c.more_text ? '<p>' + esc(c.more_text) + '</p>' : '') +
          (c.more_button_url ? '<a class="btn" href="' + href(c.more_button_url) + '"' + ext(c.more_button_url) + '>' + esc(c.more_button_text || 'Read more') + '</a>' : '') +
          '</div>' : '';
      return '<section id="writing"><div class="wrap"><h2 class="reveal">' + esc(c.heading) + '</h2>' +
        (c.intro ? '<p class="lede reveal">' + esc(c.intro) + '</p>' : '') +
        '<div class="articles">' + essays + '</div>' + more + '</div></section>';
    },

    photography: function (c) {
      var cols = list(c.collections).map(function (col, i) {
        var g = 'c' + (i + 1);
        var shots = list(col.photos).map(function (p) {
          return '<div class="shot"><button class="frame-btn" data-group="' + g + '" aria-label="Open ' +
            esc(p.caption || 'photograph') + ' in a larger view"><span class="frame has-img"><img src="' + img(p.image) +
            '" alt="' + esc(p.alt || p.caption) + '" loading="lazy"></span></button>' +
            (p.caption ? '<p class="cap">' + esc(p.caption) + '</p>' : '') + '</div>';
        }).join('');
        return '<div class="collection ' + g + '" aria-labelledby="' + g + 't"><div class="col-title reveal"><span class="no">' +
          pad(i + 1) + '</span><h3 id="' + g + 't">' + esc(col.title) + '</h3></div><div class="gallery">' + shots + '</div></div>';
      }).join('');
      var ig = c.instagram_url
        ? '<p class="ig">' + esc(c.instagram_text) + ' <a href="' + href(c.instagram_url) + '"' + ext(c.instagram_url) + '>' + esc(c.instagram_handle || c.instagram_url) + '</a></p>' : '';
      return '<section id="photography"><div class="wrap"><h2 class="reveal">' + esc(c.heading) + '</h2>' +
        (c.intro ? '<p class="lede reveal">' + esc(c.intro) + '</p>' : '') + cols + ig + '</div></section>';
    },

    video: function (c) {
      var vids = list(c.videos).map(function (v) {
        return '<article class="vid reveal"><a class="thumb" href="' + href(v.url) + '"' + ext(v.url) +
          ' aria-label="Watch ' + esc(v.title) + '">' +
          (v.thumbnail ? '<img src="' + img(v.thumbnail) + '" alt="' + esc(v.alt || v.title) + '" loading="lazy">' : '') +
          '<span class="play" aria-hidden="true"></span></a><h3>' + esc(v.title) + '</h3>' +
          (v.description ? '<p>' + esc(v.description) + '</p>' : '') +
          '<a class="link" href="' + href(v.url) + '"' + ext(v.url) + '>' + esc(v.link_text || 'Watch the video') + '</a></article>';
      }).join('');
      return '<section id="video"><div class="wrap"><h2 class="reveal">' + esc(c.heading) + '</h2>' +
        (c.intro ? '<p class="lede reveal">' + esc(c.intro) + '</p>' : '') +
        '<div class="grid3">' + vids + '</div></div></section>';
    },

    publications: function (c) {
      var items = list(c.items).map(function (p) {
        var isPng = /\.png$/i.test(String(p.cover || ''));
        var cover = p.cover
          ? '<div class="cover has-img' + (isPng ? ' png' : '') + '"><img src="' + img(p.cover) + '" alt="' + esc(p.cover_alt || ('Cover of ' + p.title)) + '" loading="lazy"></div>'
          : '<div class="cover type">' + esc(p.title) + '</div>';
        return '<article class="pub reveal">' + cover + '<h3>' + esc(p.title) + '</h3>' +
          (p.description ? '<p>' + rich(p.description) + '</p>' : '') +
          (p.link_url ? '<p><a href="' + href(p.link_url) + '"' + ext(p.link_url) + '>' + esc(p.link_text || 'Read more') + '</a></p>' : '') +
          (p.credit ? '<p class="credit">' + esc(p.credit) + '</p>' : '') + '</article>';
      }).join('');
      var note = c.note_link_url
        ? '<p class="shelf-note reveal">' + esc(c.note_text) + ' <a href="' + href(c.note_link_url) + '"' + ext(c.note_link_url) + '>' + esc(c.note_link_text || c.note_link_url) + '</a>.</p>' : '';
      return '<section id="publications"><div class="wrap"><h2 class="reveal">' + esc(c.heading) + '</h2>' +
        (c.intro ? '<p class="lede reveal">' + esc(c.intro) + '</p>' : '') +
        '<div class="shelf">' + items + '</div>' + note + '</div></section>';
    },

    notes: function (c) {
      var notes = list(c.notes).map(function (n) {
        return '<blockquote class="note letter reveal">' +
          (n.about ? '<p class="re">' + esc(n.about) + '</p>' : '') +
          (n.quote ? '<q class="big">' + quoted(n.quote) + '</q>' : '') +
          (n.message ? '<p class="body">' + rich(n.message) + '</p>' : '') +
          (n.from ? '<footer>' + esc(n.from) + '</footer>' : '') + '</blockquote>';
      }).join('');
      return '<section id="notes"><div class="wrap"><h2 class="reveal">' + esc(c.heading) + '</h2>' +
        (c.intro ? '<p class="lede reveal">' + esc(c.intro) + '</p>' : '') +
        '<div class="notes">' + notes + '</div></div></section>';
    },

    podcast: function (c) {
      var bars = '';
      for (var i = 1; i <= 16; i++) bars += '<i style="--n:' + i + '"></i>';
      return '<section id="podcast"><div class="wrap"><h2 class="reveal">' + esc(c.heading) + '</h2>' +
        '<div class="reveal" style="margin-top:2rem">' +
        (c.status ? '<span class="soon">' + esc(c.status) + '</span>' : '') +
        '<div class="wave" aria-hidden="true">' + bars + '</div></div></div></section>';
    },

    zayform: function (c) {
      var mail = c.enquiry_email
        ? 'mailto:' + encodeURIComponent(c.enquiry_email).replace(/%40/g, '@') +
          (c.enquiry_subject ? '?subject=' + encodeURIComponent(c.enquiry_subject) : '') : '';
      return '<section id="zayform"><div class="wrap"><h2 class="reveal">' + esc(c.heading) + '</h2>' +
        (c.label ? '<p class="subtle-lede reveal">' + esc(c.label) + '</p>' : '') +
        (c.intro ? '<p class="lede reveal">' + esc(c.intro) + '</p>' : '') +
        '<div class="zf">' +
        (c.logo ? '<div class="zf-logo reveal"><img src="' + img(c.logo) + '" alt="' + esc(c.logo_alt) + '" loading="lazy">' +
          (c.logo_caption ? '<p>' + esc(c.logo_caption) + '</p>' : '') + '</div>' : '<div></div>') +
        '<div class="zf-list">' +
        list(c.services).map(function (s) {
          return '<div class="zf-item reveal"><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></div>';
        }).join('') +
        (mail ? '<p><a class="btn" style="text-decoration:none;display:inline-flex;align-items:center;border-color:var(--lav);color:#efe8f6" href="' + esc(mail) + '">' + esc(c.button_text || 'Get in touch') + '</a></p>' +
          '<p style="font-size:.95rem">' + esc(c.or_write_text || 'Or write to') + ' <a href="mailto:' + esc(c.enquiry_email) + '" style="color:#d5c6ee">' + esc(c.enquiry_email) + '</a></p>' : '') +
        '</div></div></div></section>';
    },

    contact: function (c) {
      var links = list(c.links).map(function (l) {
        return '<li>' + esc(l.label) + ': <a href="' + href(l.url) + '"' + ext(l.url) + '>' + esc(l.text || l.url) + '</a></li>';
      }).join('');
      var form = c.subscribe_url
        ? '<div class="newsletter reveal"><h3>' + esc(c.newsletter_title) + '</h3><p>' + esc(c.newsletter_text) + '</p>' +
          '<form class="signup" action="' + href(c.subscribe_url) + '" method="post" target="_blank">' +
          '<label for="nl-email">Your email address</label><div class="signup-row">' +
          '<input id="nl-email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required>' +
          '<input type="hidden" name="source" value="' + esc(c.newsletter_source) + '">' +
          '<button class="btn" type="submit">Subscribe</button></div>' +
          (c.signup_note ? '<p class="signup-note">' + esc(c.signup_note) + '</p>' : '') + '</form></div>' : '';
      return '<section id="contact"><div class="wrap">' +
        (c.label ? '<p class="subtle-lede reveal">' + esc(c.label) + '</p>' : '') +
        '<h2 class="reveal">' + esc(c.heading) + '</h2>' +
        (c.intro ? '<p class="lede reveal">' + esc(c.intro) + '</p>' : '') +
        '<ul class="contact-list reveal">' +
        (c.email ? '<li>Email: <a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></li>' : '') + links + '</ul>' +
        form + '</div></section>';
    }
  };

  /* ---------- behaviours (menu, reveals, essays, photo viewer) ---------- */
  function init() {
    d.getElementById('yr').textContent = new Date().getFullYear();

    var i = 0;
    d.querySelectorAll('[data-split]').forEach(function (el) {
      var t = el.textContent; el.textContent = '';
      t.split('').forEach(function (ch) {
        var s = d.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i++);
        s.textContent = ch === ' ' ? ' ' : ch; el.appendChild(s);
      });
    });

    var nav = d.querySelector('header.nav'), btn = d.querySelector('.menu-btn'), menu = d.getElementById('menu');
    window.addEventListener('scroll', function () { nav.classList.toggle('solid', window.scrollY > 40); }, { passive: true });
    function setMenu(o) { menu.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); btn.textContent = o ? 'Close' : 'Menu'; }
    btn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

    var els = d.querySelectorAll('.reveal,.mask');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: .12 });
      els.forEach(function (e) { io.observe(e); });
    } else els.forEach(function (e) { e.classList.add('in'); });

    d.querySelectorAll('.toggle').forEach(function (b) {
      b.addEventListener('click', function () {
        var art = b.closest('.article'), open = !art.classList.contains('open');
        art.classList.toggle('open', open);
        b.setAttribute('aria-expanded', open);
        b.textContent = open ? 'Read less' : 'Read more';
        if (!open) art.scrollIntoView({ block: 'nearest' });
      });
    });

    var lb = d.querySelector('.lb'), stage = lb.querySelector('.lb-stage'), count = lb.querySelector('.lb-count'),
        group = [], idx = 0, opener = null;
    function show() {
      var f = group[idx].querySelector('.frame').firstElementChild.cloneNode(true);
      f.style.transform = 'none'; f.style.position = 'static';
      stage.innerHTML = ''; stage.appendChild(f);
      count.textContent = (idx + 1) + ' / ' + group.length;
    }
    function open(b) {
      group = [].slice.call(d.querySelectorAll('.frame-btn[data-group="' + b.dataset.group + '"]'));
      idx = group.indexOf(b); opener = b; show();
      lb.hidden = false; lb.classList.add('open'); d.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    }
    function close() { lb.classList.remove('open'); lb.hidden = true; d.body.style.overflow = ''; if (opener) opener.focus(); }
    function step(n) { idx = (idx + n + group.length) % group.length; show(); }
    d.querySelectorAll('.frame-btn').forEach(function (b) { b.addEventListener('click', function () { open(b); }); });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    d.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab') {
        var f = lb.querySelectorAll('button'), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    if (location.hash.length > 1) {
      var t = d.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) t.scrollIntoView();
    }
  }

  /* ---------- load content, build, start ---------- */
  var main = d.getElementById('main');
  Promise.all(SECTIONS.map(function (name) {
    return fetch('content/' + name + '.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) { return { name: name, data: data }; })
      .catch(function (err) { console.error('Could not load content/' + name + '.json', err); return { name: name, data: null }; });
  })).then(function (res) {
    var html = '', loaded = 0;
    res.forEach(function (r) {
      if (!r.data) return;
      loaded++;
      try { html += build[r.name](r.data); }
      catch (e) { console.error('Could not build section ' + r.name, e); }
    });
    if (!loaded) {
      main.innerHTML = '<p style="padding:8rem 2rem;text-align:center">The content files could not be loaded. ' +
        'If you opened index.html straight from a folder, view it through your website address instead, ' +
        'because browsers block reading the content files from a local folder.</p>';
      return;
    }
    main.innerHTML = html;
    var home = res[0].data;
    if (home) {
      var full = ((home.first_name || '') + ' ' + (home.last_name || '')).trim();
      if (full) {
        d.querySelector('.brand').textContent = full;
        d.getElementById('foot-name').textContent = full;
      }
    }
    init();
  });
})();
