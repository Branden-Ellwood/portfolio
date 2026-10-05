/* 3D background (three.js): particles, wireframe shapes and a camera that flies forward as you scroll.
   Add <canvas id="gl" data-depth="165"> to any page to use it. Smaller data-depth = shorter flight. */
(function () {
  var TH = window.THREE, cv = document.getElementById('gl');
  if (!cv) return;
  if (!TH) { cv.style.display = 'none'; return; }
  var st = App.state || { sp: 0, mx: 0, my: 0 }, red = App.reduced, depth = +cv.getAttribute('data-depth') || 165;
  try {
    var R = new TH.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    R.setPixelRatio(Math.min(devicePixelRatio, 2));
    var S = new TH.Scene(), C = new TH.PerspectiveCamera(60, 1, .1, 300); C.position.z = 9;

    // particles
    var N = 2200, pa = new Float32Array(N * 3);
    for (var a = 0; a < N; a++) { pa[a * 3] = (Math.random() - .5) * 70; pa[a * 3 + 1] = (Math.random() - .5) * 50; pa[a * 3 + 2] = 10 - Math.random() * (depth + 25); }
    var pg = new TH.BufferGeometry(); pg.setAttribute('position', new TH.BufferAttribute(pa, 3));
    var pm = new TH.PointsMaterial({ size: .14, transparent: true, opacity: .9, depthWrite: false });
    var pts = new TH.Points(pg, pm); S.add(pts);

    // wireframe shapes
    var mats = [], shapes = [];
    function wire() { var m = new TH.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: .55 }); mats.push(m); return m; }
    var core = new TH.Mesh(new TH.IcosahedronGeometry(2.4, 1), wire()); core.position.set(4, 0, 0); S.add(core);
    var inner = new TH.Mesh(new TH.OctahedronGeometry(1.3, 0), wire()); inner.position.copy(core.position); S.add(inner);
    var geos = [new TH.TorusGeometry(2, .05, 8, 60), new TH.OctahedronGeometry(1.6), new TH.IcosahedronGeometry(1.5, 0), new TH.TorusKnotGeometry(1.1, .3, 70, 8), new TH.BoxGeometry(2, 2, 2)];
    var count = Math.max(3, Math.round(depth / 18)), gap = (depth - 12) / count;
    for (var z = 0; z < count; z++) {
      var m = new TH.Mesh(geos[z % 5], wire()), side = z % 2 ? 1 : -1;
      m.position.set(side * (5 + Math.random() * 5), (Math.random() - .5) * 8, -14 - z * gap);
      m.rotation.set(Math.random() * 3, Math.random() * 3, 0); S.add(m); shapes.push(m);
    }

    // colours follow the theme (edit the hex values to change the 3D colours)
    var cs = [new TH.Color(), new TH.Color()];
    function paint() {
      var d = App.isDark();
      cs[0].set(d ? 0x3dd6d0 : 0x4f46e5); cs[1].set(d ? 0x8b8bff : 0xf43f6e);
      var ca = pg.attributes.color;
      if (!ca) { ca = new TH.BufferAttribute(new Float32Array(N * 3), 3); pg.setAttribute('color', ca); }
      for (var a = 0; a < N; a++) { var cc = (!d && (a * 7919 % 10) < 4) ? cs[1] : cs[0]; ca.setXYZ(a, cc.r, cc.g, cc.b); }
      ca.needsUpdate = true; pm.vertexColors = true; pm.color.set(0xffffff);
      pm.blending = d ? TH.AdditiveBlending : TH.NormalBlending; pm.opacity = d ? .9 : .75; pm.needsUpdate = true;
      mats.forEach(function (mt, i) { mt.color.copy(cs[i % 2]); });
    }
    paint(); App.onThemeChange(paint);

    function resize() {
      var w = innerWidth, h = innerHeight; R.setSize(w, h, false); C.aspect = w / h; C.updateProjectionMatrix();
      core.position.x = w < 760 ? 0 : 4; inner.position.x = core.position.x;
    }
    addEventListener('resize', resize); resize();

    var cz = 9, tx = 0, ty = 0, clock = new TH.Clock(), run = true;
    document.addEventListener('visibilitychange', function () { run = !document.hidden; if (run) loop(); });
    function frame() {
      var t = clock.getElapsedTime();
      if (!red) {
        cz += ((9 - st.sp * depth) - cz) * .06; tx += (st.mx * 1.6 - tx) * .05; ty += (-st.my - ty) * .05;
        C.position.set(tx, ty, cz); C.rotation.y = -st.mx * .08; C.rotation.x = st.my * .05;
        core.rotation.x = t * .25; core.rotation.y = t * .35 + st.mx * .5;
        inner.rotation.x = -t * .5; inner.rotation.z = t * .4;
        core.scale.setScalar(1 + Math.sin(t * 1.6) * .05);
        shapes.forEach(function (s, i) { s.rotation.x += .004 + i * .0004; s.rotation.y += .006; });
        pts.rotation.z = t * .01;
      }
      R.render(S, C);
    }
    function loop() { if (!run) return; frame(); if (!red) requestAnimationFrame(loop); }
    loop();
  } catch (e) { cv.style.display = 'none'; }
})();
