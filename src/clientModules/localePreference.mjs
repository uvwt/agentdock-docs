const STORAGE_KEY = 'agentdock-docs.locale';
const SUPPORTED_LOCALES = new Set(['en', 'zh-CN']);

let localeClickListenerInstalled = false;

/**
 * 将浏览器语言和 Docusaurus 的 html lang 统一映射到站点支持的 locale。
 * 目前只有简体中文翻译，因此所有中文浏览器环境都落到 zh-CN。
 */
export function normalizeLocale(locale) {
  if (typeof locale !== 'string') {
    return null;
  }

  const normalized = locale.trim().toLowerCase();
  if (normalized === 'en' || normalized.startsWith('en-')) {
    return 'en';
  }
  if (normalized === 'zh' || normalized.startsWith('zh-')) {
    return 'zh-CN';
  }
  return null;
}

export function browserPrefersChinese(languages) {
  return languages.some((language) => normalizeLocale(language) === 'zh-CN');
}

export function choosePreferredLocale({currentLocale, storedLocale, browserLanguages}) {
  const savedLocale = normalizeLocale(storedLocale);
  if (savedLocale && SUPPORTED_LOCALES.has(savedLocale)) {
    return savedLocale;
  }

  // 用户直接进入带 locale 的中文地址时，将当前 URL 视为明确选择。
  if (currentLocale === 'zh-CN') {
    return 'zh-CN';
  }

  return browserPrefersChinese(browserLanguages) ? 'zh-CN' : 'en';
}

function readStoredLocale() {
  try {
    return normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function writeStoredLocale(locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // 浏览器禁用本地存储时仍允许正常浏览，只是不再记住语言选择。
  }
}

function getBrowserLanguages() {
  if (Array.isArray(window.navigator.languages) && window.navigator.languages.length > 0) {
    return window.navigator.languages;
  }
  return window.navigator.language ? [window.navigator.language] : [];
}

function getLocaleTarget(locale) {
  const localeLink = document.querySelector(`a.dropdown__link[lang="${locale}"]`);
  if (!(localeLink instanceof HTMLAnchorElement)) {
    return null;
  }

  const target = new URL(localeLink.href, window.location.href);
  target.search = window.location.search;
  target.hash = window.location.hash;
  return target;
}

function redirectToLocale(locale) {
  const target = getLocaleTarget(locale);
  if (!target || target.href === window.location.href) {
    return;
  }
  window.location.replace(target.href);
}

function installLocaleClickListener() {
  if (localeClickListenerInstalled) {
    return;
  }

  document.addEventListener(
    'click',
    (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const localeLink = event.target.closest('a.dropdown__link[lang]');
      if (!localeLink) {
        return;
      }

      const locale = normalizeLocale(localeLink.getAttribute('lang'));
      if (locale && SUPPORTED_LOCALES.has(locale)) {
        // 在 Docusaurus 导航发生前保存选择，避免新页面按浏览器语言跳回去。
        writeStoredLocale(locale);
      }
    },
    true,
  );
  localeClickListenerInstalled = true;
}

export function onRouteDidUpdate() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  installLocaleClickListener();

  const currentLocale = normalizeLocale(document.documentElement.lang);
  if (!currentLocale || !SUPPORTED_LOCALES.has(currentLocale)) {
    return;
  }

  const preferredLocale = choosePreferredLocale({
    currentLocale,
    storedLocale: readStoredLocale(),
    browserLanguages: getBrowserLanguages(),
  });
  writeStoredLocale(preferredLocale);

  if (preferredLocale !== currentLocale) {
    redirectToLocale(preferredLocale);
  }
}
