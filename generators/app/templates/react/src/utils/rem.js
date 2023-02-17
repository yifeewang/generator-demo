(function (doc, win) {
  const docEl = doc.documentElement;
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  const recalc = function () {
      const { clientWidth } = docEl;
      if (!clientWidth) return;
      docEl.style.fontSize = `${100 * (clientWidth / 750)}px`;
  };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
