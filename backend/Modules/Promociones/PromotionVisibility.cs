using Microsoft.EntityFrameworkCore;

public static class PromotionVisibility
{
    public static IQueryable<Promocion> PublicCandidates(BazarDb db) =>
        db.Promociones.AsNoTracking().Where(p => p.Estado == "Publicado"
            && !string.IsNullOrWhiteSpace(p.Titulo)
            && !string.IsNullOrWhiteSpace(p.Descripcion)
            && !string.IsNullOrWhiteSpace(p.Condiciones)
            && p.ImagenId.HasValue && p.Inicio.HasValue && p.Fin.HasValue
            && p.Inicio < p.Fin);

    public static IQueryable<Promocion> Current(BazarDb db, DateTimeOffset now) =>
        PublicCandidates(db).Where(p => p.Inicio <= now && now < p.Fin);
}
