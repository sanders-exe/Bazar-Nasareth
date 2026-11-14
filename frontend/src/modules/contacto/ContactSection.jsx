import { useLanguage } from '../../shared/Language.jsx';
import React from 'react';
import { BazarDoodle, SocialIcon } from '../../shared/Icons.jsx';
export default function ContactSection({ business }) {
  const { t } = useLanguage();
  const mapUrl = `https://www.google.com/maps?${new URLSearchParams({ q: business.direccion })}`;

  return (
    <section id="contacto" className="wrap section contact">
      <span className="eyebrow">{t('Sede central')}</span>
      <h2>
        {' '}
        {t('Su próxima idea')} <br /> {t('empieza con un')}{' '}
        <span>{t('¡hola!')}</span>
      </h2>
      <p className="contact-intro">
        {' '}
        {t(
          'Consulte disponibilidad, cuéntenos lo que busca o visítenos en el bazar.',
        )}{' '}
      </p>
      <BazarDoodle kind="gift" className="contact-gift" />
      <article className="store-card">
        <p>
          <b>{t('Dirección')}</b>
          <br />
          {business.direccion}
        </p>
        <p>
          <b>{t('Horario')}</b>
          <br />
          {business.horario}
        </p>
      </article>
      <div className="contact-grid contact-details">
        <p>
          <b>{t('Teléfono')}</b>
          <br />
          {business.telefono}
        </p>
        {business.email && (
          <p>
            <b>{t('Correo')}</b>
            <br />
            {business.email}
          </p>
        )}
      </div>
      <div className="location-map">
        <iframe
          title={t('Mapa de Bazar Nazareth en Hojancha')}
          src={`${mapUrl}&z=19&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          {t('Abrir ubicación en Google Maps ↗')}{' '}
        </a>
      </div>
      <div className="contact-actions">
        <a
          className="button primary"
          href={business.enlaceContacto}
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          {t('Abrir contacto por WhatsApp')}{' '}
        </a>
        <div className="social" aria-label={t('Redes sociales')}>
          {(business.redes || '')
            .split('\n')
            .filter((x) => {
              try {
                return ['https:', 'http:'].includes(new URL(x.trim()).protocol);
              } catch {
                return false;
              }
            })
            .map((x, i) => {
              const url = new URL(x.trim());
              const instagram = url.hostname.includes('instagram.com');
              return (
                <a
                  key={i}
                  href={x.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={
                    instagram ? t('Abrir Instagram') : t('Abrir Linktree')
                  }
                >
                  <SocialIcon kind={instagram ? 'instagram' : 'linktree'} />
                  <span>{instagram ? 'Instagram' : 'Linktree'}</span>
                </a>
              );
            })}
        </div>
      </div>
    </section>
  );
}
