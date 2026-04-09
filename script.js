// Detecta navegador in-app e tenta abrir no browser externo
(function () {
  var ua = navigator.userAgent || '';

  // Detecção ampla: TikTok, Instagram, Facebook, qualquer WebView
  var isTikTok = /musical_ly|TikTok|BytedanceWebview|ByteLocale|aweme|Bytedance/i.test(ua);
  var isWebView = /wv|WebView/i.test(ua) && /Android/i.test(ua);
  var isFBIAB = /FBAN|FBAV|Instagram/i.test(ua);

  if (!isTikTok && !isWebView && !isFBIAB) return;

  var currentUrl = location.href;
  var urlSemProtocolo = currentUrl.replace(/^https?:\/\//, '');
  var isAndroid = /android/i.test(ua);
  var isIOS = /iphone|ipad|ipod/i.test(ua);

  function tentarAbrir(url) {
    try { location.href = url; } catch (e) {}
  }

  function tentarForm(url) {
    try {
      var form = document.createElement('form');
      form.method = 'GET';
      form.action = url;
      document.body.appendChild(form);
      form.submit();
    } catch (e) {}
  }

  function tentarLink(url) {
    try {
      var a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {}
  }

  if (isAndroid) {
    // Tentativa 1: intent para browser padrão
    tentarAbrir('intent://' + urlSemProtocolo + '#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end');
    setTimeout(function () {
      // Tentativa 2: Chrome no Android
      tentarAbrir('googlechrome://' + urlSemProtocolo);
    }, 500);
    setTimeout(function () {
      // Tentativa 3: link com target blank
      tentarLink(currentUrl);
    }, 1000);
    setTimeout(function () {
      // Tentativa 4: form submit
      tentarForm('intent://' + urlSemProtocolo + '#Intent;scheme=https;action=android.intent.action.VIEW;end');
    }, 1500);
  }

  if (isIOS) {
    // Tentativa 1: Chrome iOS
    tentarAbrir('googlechrome://' + urlSemProtocolo);
    setTimeout(function () {
      // Tentativa 2: Safari via x-safari
      tentarAbrir('x-safari-' + currentUrl);
    }, 500);
    setTimeout(function () {
      // Tentativa 3: Safari via safari scheme
      tentarAbrir('safari-' + currentUrl);
    }, 800);
    setTimeout(function () {
      // Tentativa 4: link com target blank
      tentarLink(currentUrl);
    }, 1100);
    setTimeout(function () {
      // Tentativa 5: form submit para x-safari
      tentarForm('x-safari-' + currentUrl);
    }, 1400);
    setTimeout(function () {
      // Tentativa 6: window.open
      try { window.open(currentUrl, '_blank'); } catch (e) {}
    }, 1700);
  }
})();
