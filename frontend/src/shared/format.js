const toCostaRicaInput = (value) =>
  value
    ? new Date(value)
        .toLocaleString('sv-SE', {
          timeZone: 'America/Costa_Rica',
          hour12: false,
        })
        .slice(0, 16)
        .replace(' ', 'T')
    : '';
function formattedPrice(value, currency, language = 'es') {
  return value == null
    ? language === 'en'
      ? 'Ask for price'
      : 'Consultar precio'
    : `${currency || 'CRC'} ${Number(value).toLocaleString(language === 'en' ? 'en-US' : 'es-CR', { minimumFractionDigits: 2 })}`;
}
function formatPromotionDate(value, language = 'es') {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return '';
  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'es-CR', {
    timeZone: 'America/Costa_Rica',
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(timestamp);
}
function promotionTimingLabel(promotion, now = Date.now()) {
  const start = promotion.inicio ? new Date(promotion.inicio).getTime() : NaN;
  const end = promotion.fin ? new Date(promotion.fin).getTime() : NaN;
  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end)
    return 'Sin vigencia válida';
  if (now < start) return 'Programada';
  if (now >= end) return 'Finalizada';
  return 'Vigente';
}
export { toCostaRicaInput, formattedPrice, formatPromotionDate, promotionTimingLabel };
