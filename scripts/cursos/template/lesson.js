(function () {
  const L = window.LESSON;
  const tl = gsap.timeline({ paused: true });

  function anims() {
    document.querySelectorAll("[data-at]").forEach((el) => {
      const t = +el.dataset.at;
      switch (el.dataset.anim) {
        case "rise":
          tl.fromTo(el, { opacity: 0, y: 30, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "expo.out" }, t);
          break;
        case "words":
          tl.fromTo(el.querySelectorAll(".w"), { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.16, ease: "power4.out", stagger: 0.07 }, t);
          break;
        case "pop":
          tl.fromTo(el, { opacity: 0, scale: 0.86, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, t);
          break;
        case "fade":
          tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" }, t);
          break;
        case "stamp":
          tl.fromTo(el, { opacity: 0, scale: 1.22, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "expo.out" }, t);
          break;
        case "wipe": {
          tl.fromTo(el, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" }, t);
          const img = el.querySelector("img");
          if (img) tl.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.6, ease: "expo.out" }, t);
          break;
        }
        case "band":
          tl.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 0.75, ease: "expo.out" }, t);
          break;
        case "row":
          tl.fromTo(el, { opacity: 0, x: -36, filter: "blur(6px)" }, { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.45, ease: "expo.out" }, t);
          break;
      }
      if (el.dataset.out) {
        tl.to(el, { opacity: 0, y: -12, filter: "blur(8px)", duration: 0.22, ease: "power2.in" }, +el.dataset.out);
      }
    });

    document.querySelectorAll("[data-hl]").forEach((el) => {
      tl.fromTo(el, { backgroundColor: "rgba(232,168,76,0)", color: "#D5682F" }, { backgroundColor: "rgba(232,168,76,1)", color: "#141414", duration: 0.2, ease: "power2.out" }, +el.dataset.hl - 0.05);
    });
    document.querySelectorAll("[data-ring]").forEach((el) => {
      tl.fromTo(el, { strokeDashoffset: 540.35 }, { strokeDashoffset: 0, duration: +el.dataset.ringDur, ease: "none" }, +el.dataset.ring);
    });
    document.querySelectorAll("[data-res]").forEach((el) => {
      const t = +el.dataset.res;
      if (el.classList.contains("ok")) {
        tl.fromTo(el, { backgroundColor: "rgba(232,168,76,0)", borderColor: "rgba(255,255,255,0.55)", color: "#ffffff", scale: 1 },
          { backgroundColor: "rgba(232,168,76,1)", borderColor: "rgba(232,168,76,1)", color: "#141414", scale: 1.08, duration: 0.35, ease: "back.out(1.8)" }, t);
      } else {
        tl.fromTo(el, { opacity: 1 }, { opacity: 0.3, duration: 0.3, ease: "power2.out" }, t);
      }
    });
    document.querySelectorAll("[data-shifts]").forEach((el) => {
      JSON.parse(el.dataset.shifts).forEach(([t, y]) => tl.to(el, { y, duration: 0.5, ease: "power3.inOut" }, t));
    });
    document.querySelectorAll(".trans").forEach((el) => {
      tl.fromTo(el.querySelector(".tb"), { x: -3000 }, { x: 2100, duration: 1.0, ease: "power2.inOut" }, +el.dataset.start);
    });
    tl.fromTo("#progress i", { scaleX: 0 }, { scaleX: 1, duration: L.total, ease: "none" }, 0);
  }

  const ADELANTO = 2 / 30;
  const RESALTES = {
    claro: { fondo: "#C95023", tinta: "#ffffff" },
    oscuro: { fondo: "#D5682F", tinta: "#0c0c0e" },
    terra: { fondo: "#f5f3ee", tinta: "#0c0c0e" },
  };
  const OSCURO = { color: "#ffffff", WebkitTextStrokeColor: "rgba(6,6,8,0.6)", textShadow: "0 2px 4px rgba(0,0,0,0.55), 0 0 20px rgba(0,0,0,0.45), 0 8px 34px rgba(0,0,0,0.38)" };
  const ESTILO = {
    claro: { color: "#141210", WebkitTextStrokeColor: "rgba(0,0,0,0)", textShadow: "0 0 2px rgba(255,255,255,0.6), 0 0 16px rgba(255,255,255,0.8), 0 0 38px rgba(255,255,255,0.55)" },
    oscuro: OSCURO,
    terra: OSCURO,
  };
  const activa = (tono, res) => ({
    color: res.tinta,
    WebkitTextStrokeColor: tono === "claro" ? "rgba(0,0,0,0)" : res.tinta !== "#ffffff" ? res.fondo : "rgba(6,6,8,0.6)",
    textShadow: "0 1px 2px rgba(0,0,0,0.18), 0 0 0 rgba(0,0,0,0), 0 0 0 rgba(0,0,0,0)",
  });
  const lineasDe = (spans) => {
    const tops = [];
    spans.forEach((s) => { const t = Math.round(s.offsetTop); if (tops.every((x) => Math.abs(x - t) > 8)) tops.push(t); });
    return tops.length;
  };

  function subtitulos() {
    L.caps.forEach((g, gi) => {
      const el = document.getElementById("g" + gi);
      const tono = el.classList.contains("claro") ? "claro" : el.classList.contains("terra") ? "terra" : "oscuro";
      const RES = RESALTES[tono], REPOSO = ESTILO[tono], ACTIVA = activa(tono, RES);
      const linea = el.querySelector(".linea");
      const resalte = el.querySelector(".resalte");
      resalte.style.background = RES.fondo;
      const spans = Array.from(linea.querySelectorAll("span"));
      let tam = 64;
      while (lineasDe(spans) > 2 && tam > 48) { tam -= 4; linea.style.fontSize = tam + "px"; }

      tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: "power1.out" }, g.start);
      tl.to(el, { opacity: 0, y: -10, duration: 0.12, ease: "power2.in" }, Math.max(g.start + 0.2, g.end - 0.12));
      tl.set(el, { opacity: 0, visibility: "hidden" }, g.end);

      g.words.forEach((p, k) => {
        const t = Math.max(g.start, p.s - ADELANTO);
        tl.fromTo(spans[k], { opacity: 0, y: 26, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.24, ease: "power3.out" }, t);
        tl.fromTo(spans[k], { scale: 0.8 }, { scale: 1, duration: 0.34, ease: "back.out(2.2)" }, t);
      });

      let previa = null;
      g.words.forEach((p, k) => {
        const s = spans[k];
        const h = s.offsetHeight;
        const t = Math.max(g.start, p.s - ADELANTO / 2);
        const caja = { x: s.offsetLeft - 12, y: s.offsetTop + h * 0.1, width: s.offsetWidth + 24, height: h * 0.84 };
        const salta = previa === null || Math.abs(spans[previa].offsetTop - s.offsetTop) > 8 || p.s - g.words[previa].e > 0.6;
        if (salta) {
          tl.set(resalte, caja, t);
          tl.fromTo(resalte, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)" }, t);
        } else tl.to(resalte, { ...caja, duration: 0.12, ease: "power3.out" }, t);
        if (previa !== null) tl.set(spans[previa], REPOSO, t);
        tl.set(s, ACTIVA, t + 0.06);
        previa = k;
      });
    });
  }

  function construir() {
    anims();
    subtitulos();
    window.__timelines = window.__timelines || {};
    window.__timelines["main"] = tl;
  }

  Promise.all([
    document.fonts.load('800 64px "Bricolage Grotesque"'),
    document.fonts.load('400 100px "Bebas Neue"'),
    document.fonts.load('400 60px "Permanent Marker"'),
    document.fonts.load('600 40px "Montserrat"'),
  ]).then(() => document.fonts.ready).then(construir, construir);
})();
