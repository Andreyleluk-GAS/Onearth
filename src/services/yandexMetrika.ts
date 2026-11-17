// Yandex.Metrika Helper for SPA navigation and conversion goals
import { telemetryService } from './telemetryService';

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
    // 1. Record in local live telemetry engine
    telemetryService.recordHit(path, title);

    // 2. Transmit to official Yandex.Metrika
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
 * Sends a conversion goal event to Yandex.Metrika with backward and forward compatibility
 */
export const trackMetrikaGoal = (goalName: string, params?: Record<string, any>): void => {
  if (typeof window === 'undefined') return;
  try {
    // 1. Record in local live telemetry engine
    telemetryService.recordGoal(goalName, params);

    // Goal alias mapping for comprehensive Yandex.Metrika goal coverage
    const aliasMap: Record<string, string[]> = {
      lead_quote_request: ['lead_quote_request', 'lead_form_quote_submit'],
      lead_form_quote_submit: ['lead_form_quote_submit', 'lead_quote_request'],
      lead_tz_submit: ['lead_tz_submit', 'tz_file_upload_submit'],
      tz_file_upload_submit: ['tz_file_upload_submit', 'lead_tz_submit'],
      email_click: ['email_click', 'contact_email_click'],
      contact_email_click: ['contact_email_click', 'email_click'],
      phone_click: ['phone_click', 'contact_phone_click'],
      contact_phone_click: ['contact_phone_click', 'phone_click'],
      license_zoom_view: ['license_zoom_view'],
      oprosny_list_pdf_download: ['oprosny_list_pdf_download'],
      postavka_page_deep_scroll: ['postavka_page_deep_scroll'],
      catalog_filter_interaction: ['catalog_filter_interaction'],
    };

    const targetGoals = aliasMap[goalName] || [goalName];

    // 2. Transmit to official Yandex.Metrika
    if (typeof window.ym === 'function') {
      targetGoals.forEach((target) => {
        window.ym?.(YANDEX_METRIKA_COUNTER_ID, 'reachGoal', target, params);
      });
      console.log(`[Yandex.Metrika] Goals registered: ${targetGoals.join(', ')}`, params);
    }
  } catch (err) {
    console.debug('[Yandex.Metrika] Goal error:', err);
  }
};
