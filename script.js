// Detecta navegador in-app do TikTok e força abertura no browser externo
(function () {
  var ua = navigator.userAgent || '';
  var isTikTok = /musical_ly|TikTok/i.test(ua);

  // Banner de teste: aparece só dentro do TikTok
  if (isTikTok) {
    var banner = document.createElement('div');
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#ff0050;color:#fff;text-align:center;padding:12px;font-size:14px;z-index:9999;';
    banner.innerText = '⚠️ TikTok detectado — redirecionando para o navegador...';
    document.body.appendChild(banner);
  }

  if (!isTikTok) return;

  var url = encodeURIComponent(location.href);

  // Tenta abrir no Chrome (Android e iOS)
  var chrome = 'googlechrome://' + location.href.replace(/^https?:\/\//, '');

  // Tenta abrir no Safari via intent (iOS)
  var safari = 'x-safari-' + location.href;

  // Android: intent URL para abrir no browser padrão
  var intent =
    'intent://' +
    location.href.replace(/^https?:\/\//, '') +
    '#Intent;scheme=https;action=android.intent.action.VIEW;end';

  var isAndroid = /android/i.test(ua);
  var isIOS = /iphone|ipad|ipod/i.test(ua);

  if (isAndroid) {
    location.href = intent;
  } else if (isIOS) {
    // Tenta Chrome primeiro, depois Safari
    location.href = chrome;
    setTimeout(function () {
      location.href = safari;
    }, 500);
    setTimeout(function () {
      // Fallback: abre o link manualmente via prompt invisível
      var a = document.createElement('a');
      a.setAttribute('href', location.href);
      a.setAttribute('target', '_blank');
      a.click();
    }, 1000);
  }
})();
