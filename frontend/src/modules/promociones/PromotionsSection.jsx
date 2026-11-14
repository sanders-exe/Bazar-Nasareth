import { useLanguage } from '../../shared/Language.jsx';
import React from 'react';
import Img from '../../shared/Img.jsx';
import { BazarDoodle } from '../../shared/Icons.jsx';
import { formatPromotionDate } from '../../shared/format.js';
export default function PromotionsSection({ promotions, images, openCampaign }) {
  const { t, language } = useLanguage();

  return (
    <section id="promociones" className="wrap section">
      <span className="eyebrow">{t('TEMPORADA EN EL BAZAR')}</span>
      <h2>
        {' '}
        {t('Un detalle más para alegrarse')} <BazarDoodle />
      </h2>
      <div className="grid promotion-grid">
        {promotions.map((p) => (
          <article className="card promo-card" key={p.id}>
            <Img id={p.imagenId} alt={images[p.imagenId]} />
            <div className="card-body">
              <span className="promo-status">{t('✦ Vigente ahora')}</span>
              <h3>{p.titulo}</h3>
              <p>{p.descripcion}</p>
              <p>
                <b>{t('Condiciones:')}</b> {p.condiciones}
              </p>
              <small>
                {t('Hasta ')}
                <time dateTime={p.fin}>{formatPromotionDate(p.fin, language)}</time>
              </small>
              <button
                className="button promo-products-button"
                type="button"
                onClick={() => openCampaign(p)}
              >
                {t('Consultar con esta temática')}
              </button>
            </div>
          </article>
        ))}
      </div>
      {!promotions.length && (
        <p className="empty">{t('No hay promociones vigentes.')}</p>
      )}
    </section>
  );
}
