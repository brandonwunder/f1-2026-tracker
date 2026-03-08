// =============================================================================
// ISR cache revalidation intervals (in seconds)
// =============================================================================

/** 1 hour — for race results and championship standings */
export const REVALIDATE_RESULTS = 3600;

/** 24 hours — for calendar, driver info, constructor info */
export const REVALIDATE_STATIC = 86400;

/** 5 minutes — for live/recent session supplementary data */
export const REVALIDATE_LIVE = 300;
