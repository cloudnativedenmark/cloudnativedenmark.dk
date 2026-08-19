/**
 * Feature flags.
 *
 * Simple, build-time toggles for content that isn't ready to be public yet.
 * Flip a value here and every consumer follows — routes, navigation, and
 * in-page links all read from these flags.
 */

export interface FeatureFlags {
  /**
   * Controls the /schedule and /speakers subpages. When disabled the routes
   * are not registered, the pages disappear from the menu, and links pointing
   * at them (e.g. the "View all speakers" button under Featured speakers and
   * the "Schedule →" CTAs) are hidden.
   */
  scheduleAndSpeakers: boolean
}

export const features: FeatureFlags = {
  scheduleAndSpeakers: true,
}
