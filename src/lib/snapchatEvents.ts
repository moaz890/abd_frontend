/** Snapchat Pixel ID — override via NEXT_PUBLIC_SNAPCHAT_PIXEL_ID if needed. */
export const SNAPCHAT_PIXEL_ID =
  process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID ?? 'b152085c-4c61-44f1-8b40-a149555e9e8f';

/**
 * Standard Snapchat event fired when a user opens WhatsApp to contact the business.
 * @see https://businesshelp.snapchat.com/s/article/pixel-direct-implementation
 */
export const SNAPCHAT_WHATSAPP_EVENT = 'SIGN_UP';

/** Optional params for {@link SNAPCHAT_WHATSAPP_EVENT}. */
export const SNAPCHAT_WHATSAPP_EVENT_DATA = {
  sign_up_method: 'WhatsApp',
} as const;

/**
 * Standard Snapchat event fired when a user clicks "تحقق من أهليتك" to begin eligibility verification.
 * Represents the start of the installment purchase / eligibility funnel.
 */
export const SNAPCHAT_ELIGIBILITY_CTA_EVENT = 'START_CHECKOUT';
