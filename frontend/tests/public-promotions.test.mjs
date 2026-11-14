import test from 'node:test';
import assert from 'node:assert/strict';
import { activePromotions, schedulePromotionBoundary } from '../src/modules/promociones/publicPromotions.js';

const promotion = {
  estado: 'Publicado',
  inicio: '2026-11-14T15:00:00Z',
  fin: '2026-11-14T16:00:00Z',
};

test('Una promoción pública aparece al inicio y sale exactamente al vencer', () => {
  const start = Date.parse(promotion.inicio);
  const end = Date.parse(promotion.fin);
  const draft = { ...promotion, estado: 'Borrador' };
  const archived = { ...promotion, estado: 'Archivado' };
  const invalid = { ...promotion, fin: null };
  const collection = [promotion, draft, archived, invalid];
  assert.deepEqual(activePromotions(collection, start - 1), []);
  assert.deepEqual(activePromotions(collection, start), [promotion]);
  assert.deepEqual(activePromotions(collection, end - 1), [promotion]);
  assert.deepEqual(activePromotions(collection, end), []);
});

test('Una fecha lejana se reprograma y se puede cancelar al salir de la página', (t) => {
  const originalWindow = globalThis.window;
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: new Date(promotion.inicio) });
  globalThis.window = { setTimeout, clearTimeout };
  try {
    let updates = 0;
    const boundary = Date.now() + 2_147_483_649;
    const cancel = schedulePromotionBoundary(boundary, () => updates++);
    t.mock.timers.tick(2_147_483_647);
    assert.equal(updates, 0);
    t.mock.timers.tick(2);
    assert.equal(updates, 1);
    cancel();
    const cancelNext = schedulePromotionBoundary(Date.now() + 1000, () => updates++);
    cancelNext();
    t.mock.timers.tick(1000);
    assert.equal(updates, 1);
  } finally {
    globalThis.window = originalWindow;
  }
});
