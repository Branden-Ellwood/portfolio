/* Page effects: name reveal, typing line, ribbon, counters, scroll reveal, card tilt, scroll progress.
   Safe on any page: each effect only runs if its element exists. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var red = App.reduced, st = App.state = { sp: 0, mx: 0, my: 0 }, intro = $('#intro');

  // 1. Name: split into letters that flip in (only on pages with <h1 id="nm">)
  var nm = $('#nm');
  if (nm) {
    var parts = nm.textContent.split(' '), k = 0, base = intro && !red ? 3.4 : 0.2;
    nm.textContent = '';
    nm.setAttribute('aria-label', parts.join(' '));
    parts.forEach(function (w, i) {
      var g = document.createElement('span');
      g.className = i ? 'g' : '';
      g.setAttribute('aria-hidden', 'true');
      w.split('').forEach(function (c) {
        var l = document.createElement('span');
        l.className = 'l'; l.textContent = c;
        l.style.animationDelay = (red ? 0 : base + k * 0.06) + 's'; k++;
        g.appendChild(l);
      });
      nm.appendChild(g);
      if (!i) nm.appendChild(document.createTextNode(' '));
    });
  }

  // 2. Skills ribbon: edit the words in data-items on #rb
  var rb = $('#rb');
  if (rb) {
    var items = (rb.getAttribute('data-items') || '').split(','), html = '';
    for (var q = 0; q < 2; q++) items.forEach(function (x) { html += '<span>' + x + '</span>'; });
    rb.innerHTML = html;
  }

  // 3. Typing line: edit the words in data-words on #typed (separated by |)
  var ty = $('#typed');
  if (ty && !red) {
    var words = (ty.getAttribute('data-words') || ty.textContent).split('|'), i = 0, j = 0, del = false;
    (function tick() {
      var x = words[i]; j += del ? -1 : 1; ty.textContent = x.slice(0, j);
      var d = del ? 35 : 75;
      if (!del && j === x.length) { del = true; d = 1400; }
      else if (del && j === 0) { del = false; i = (i + 1) % words.length; d = 300; }
      setTimeout(tick, d);
    })();
  }

  // 4. Scroll reveal for anything with class "rv"
  var reveal = new IntersectionObserver(function (es) {
    es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('on'); reveal.unobserve(x.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.rv').forEach(function (e) { reveal.observe(e); });

  // 5. Count-up numbers: <b data-n="60" data-p="~">
  function count(e) {
    var n = +e.dataset.n, p = e.dataset.p || '', t0 = performance.now();
    (function f(now) {
      var v = Math.min(1, (now - t0) / 1300), x = Math.round(n * (1 - Math.pow(1 - v, 3)));
      e.textContent = p + x.toLocaleString('en-US');
      if (v < 1) requestAnimationFrame(f);
    })(t0);
  }
  if (!red) {
    var wait = intro ? 3600 : 0;
    var counters = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { setTimeout(function () { count(x.target); }, wait); counters.unobserve(x.target); } });
    });
    document.querySelectorAll('[data-n]').forEach(function (e) { counters.observe(e); });
  }

  // 6. 3D card tilt (mouse devices only)
  if (matchMedia('(pointer:fine)').matches && !red) {
    document.querySelectorAll('.card').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
        c.style.setProperty('--ry', ((x - .5) * 16) + 'deg'); c.style.setProperty('--rx', ((.5 - y) * 16) + 'deg');
        c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
      });
      c.addEventListener('pointerleave', function () { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
  }

  // 7. Scroll progress, hero parallax, cursor glow (shared with scene.js through App.state)
  var hc = $('#hc'), bar = $('#bar'), glow = $('#glow');
  function onScroll() {
    var m = document.documentElement.scrollHeight - innerHeight, y = scrollY;
    st.sp = m > 0 ? y / m : 0;
    if (bar) bar.style.width = st.sp * 100 + '%';
    if (hc && !red) {
      hc.style.transform = 'translateY(' + y * .25 + 'px) translateZ(0) rotateX(' + Math.min(y / 40, 14) + 'deg)';
      hc.style.opacity = Math.max(0, 1 - y / (innerHeight * .75));
    }
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  addEventListener('pointermove', function (e) {
    st.mx = e.clientX / innerWidth * 2 - 1; st.my = e.clientY / innerHeight * 2 - 1;
    if (glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
  });

  // 8. Click to skip the opening titles
  if (intro) intro.addEventListener('click', function () { this.style.display = 'none'; });
})();
