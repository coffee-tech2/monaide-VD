(function() {
  function cleanValue(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 90);
  }

  window.trackMonaideEvent = function(name, params) {
    var eventName = cleanValue(name);
    if (!eventName) return;
    var props = {};
    Object.keys(params || {}).forEach(function(key) {
      props[key] = cleanValue(params[key]);
    });

    try {
      window.dispatchEvent(new CustomEvent('monaide:track', {
        detail: Object.assign({ event: eventName }, props)
      }));
    } catch (e) {}

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, props);
    }
    if (typeof window.plausible === 'function') {
      window.plausible(eventName, { props: props });
    }
  };
})();
