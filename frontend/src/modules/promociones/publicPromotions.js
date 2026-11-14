import { promotionTimingLabel } from '../../shared/format.js';

export function activePromotions(promotions, now = Date.now()) {
  return promotions.filter(
    (promotion) => promotion.estado === 'Publicado' && promotionTimingLabel(promotion, now) === 'Vigente',
  );
}

export function schedulePromotionBoundary(timestamp, callback) {
  let timer;
  function schedule() {
    const remaining = timestamp - Date.now();
    timer = window.setTimeout(() => {
      if (Date.now() < timestamp) schedule();
      else callback();
    }, Math.min(Math.max(0, remaining), 2_147_483_647));
  }
  schedule();
  return () => window.clearTimeout(timer);
}
