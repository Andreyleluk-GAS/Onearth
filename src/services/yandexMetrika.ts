// Yandex.Metrika Helper for SPA navigation and conversion goals
export const YANDEX_METRIKA_COUNTER_ID = 114211100;

declare global {
  interface Window {
    ym?: (
      counterId: number,
      action: 'init' | 'hit' | 'reachGoal' | 'params',
      target: any,
      options?: any
    ) => void;
  }
}

/**
 * Tracks a pageview hit in Yandex.Metrika for SPA route transitions
 */
export const trackMetrikaHit = (path: string, title?: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const fullUrl = `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
    if (typeof window.ym === 'function') {
      window.ym(YANDEX_METRIKA_COUNTER_ID, 'hit', fullUrl, {
        title: title || document.title,
        referrer: document.referrer,
      });
    }
  } catch (err) {
    // Non-critical logging
    console.debug('[Yandex.Metrika] Hit tracking error:', err);
  }
};

/**
 * Sends a conversion goal event to Yandex.Metrika
 * Goals supported:
 * - 'lead_quote_request': Sent when customer submits a quote modal
 * - 'lead_tz_submit': Sent when customer submits a custom TZ in configurator
 * - 'lead_tz_copy': Sent when customer copies the custom TZ summary
 * - 'phone_click': Sent when customer clicks the phone number link
 * - 'email_click': Sent when customer clicks email link
 */
export const trackMetrikaGoal = (goalName: string, params?: Record<string, any>): void => {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.ym === 'function') {
      window.ym(YANDEX_METRIKA_COUNTER_ID, 'reachGoal', goalName, params);
      console.log(`[Yandex.Metrika] Goal '${goalName}' registered`, params);
    }
  } catch (err) {
    console.debug('[Yandex.Metrika] Goal error:', err);
  }
};
