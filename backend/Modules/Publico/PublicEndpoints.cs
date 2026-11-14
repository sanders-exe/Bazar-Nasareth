using Microsoft.EntityFrameworkCore;

public static class PublicEndpoints
{
    public static void Map(WebApplication app, IConfiguration configuration)
    {
        app.MapGet("/api/publico", async (BazarDb db, HttpContext ctx) =>
        {
            ctx.Response.Headers.CacheControl = "no-store";
            var now = DateTimeOffset.UtcNow;
            var categorias = await db.Categorias.AsNoTracking().Where(x => x.Activa).OrderBy(x => x.Orden).ToListAsync();
            var categoryIds = categorias.Select(x => x.Id).ToArray();
            var productos = await db.Productos.AsNoTracking().Where(x => x.Estado == "Publicado" && categoryIds.Contains(x.CategoriaId) && !string.IsNullOrWhiteSpace(x.Nombre) && !string.IsNullOrWhiteSpace(x.Descripcion) && db.ProductoImagenes.Any(i => i.ProductoId == x.Id)).OrderBy(x => x.Orden).ToListAsync();
            var productIds = productos.Select(x => x.Id).ToArray();
            var productImages = await db.ProductoImagenes.AsNoTracking().Where(x => productIds.Contains(x.ProductoId)).OrderBy(x => x.Orden).ToListAsync();
            var servicios = await db.Servicios.AsNoTracking().Where(x => x.Estado == "Publicado" && !string.IsNullOrWhiteSpace(x.Nombre) && !string.IsNullOrWhiteSpace(x.Descripcion) && !string.IsNullOrWhiteSpace(x.Alcance)).OrderBy(x => x.Orden).ToListAsync();
            var promociones = await PromotionVisibility.Current(db, now).OrderBy(x => x.Orden).ToListAsync();
            var promotionIds = promociones.Select(x => x.Id).ToArray();
            var serviceIds = servicios.Select(x => x.Id).ToArray();
            var proximoInicioPromocion = await PromotionVisibility.PublicCandidates(db)
                .Where(p => now < p.Inicio).OrderBy(p => p.Inicio)
                .Select(p => p.Inicio).FirstOrDefaultAsync();
            var galeria = await db.Galeria.AsNoTracking().Where(x => x.Estado == "Publicado" && db.Imagenes.Any(i => i.Id == x.ImagenId)).OrderBy(x => x.Orden).ToListAsync();
            var secciones = await db.Secciones.AsNoTracking().Where(x => x.Estado == "Publicado" && !string.IsNullOrWhiteSpace(x.Titulo) && !string.IsNullOrWhiteSpace(x.Cuerpo)).OrderBy(x => x.Orden).ToListAsync();
            var imagenes = await db.Imagenes.AsNoTracking().Select(x => new { x.Id, x.TextoAlternativo }).ToListAsync();
            var negocio = (await db.Negocio.AsNoTracking().SingleAsync(x => x.Id == 1)).UseCentralOffice();
            var promocionProductos = await db.PromocionProductos.AsNoTracking()
                .Where(x => productIds.Contains(x.ProductoId) && promotionIds.Contains(x.PromocionId)).ToListAsync();
            var promocionServicios = await db.PromocionServicios.AsNoTracking()
                .Where(x => serviceIds.Contains(x.ServicioId) && promotionIds.Contains(x.PromocionId)).ToListAsync();
            return Results.Ok(new
            {
                negocio,
                medicionWhatsApp = configuration.GetValue<bool>("MedicionWhatsApp:Enabled"),
                categorias,
                productos = productos.Select(x => new { x.Id, x.CategoriaId, x.Nombre, x.Descripcion, x.PrecioInformativo, x.Moneda, x.Destacado, imagenes = productImages.Where(i => i.ProductoId == x.Id).Select(i => i.ImagenId).ToArray() }),
                servicios, promociones, proximoInicioPromocion, galeria, secciones, imagenes, promocionProductos, promocionServicios
            });
        });
    }
}
