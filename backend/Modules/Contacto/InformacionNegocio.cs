public class InformacionNegocio : IRecord
{
    public int Id { get; set; } = 1;
    public string Nombre { get; set; } = "Bazar Nazareth de Hojancha";
    public string Direccion { get; set; } = "Hojancha, Guanacaste";
    public string Horario { get; set; } = "Consultar horario";
    public string Telefono { get; set; } = "+506 6488 3862";
    public string? Email { get; set; }
    public string EnlaceContacto { get; set; } = "https://wa.me/50664883862";
    public string? Redes { get; set; } = "https://www.instagram.com/bazarnazarethojancha\nhttps://linktr.ee/bazarnazareth";

    public InformacionNegocio UseCentralOffice()
    {
        Direccion = CentralValue(Direccion);
        Horario = CentralValue(Horario);
        return this;
    }

    // Las instalaciones anteriores guardaban cada local como «Tienda | dato».
    // Conservar el texto multilínea de una sede y dar prioridad a la tienda principal heredada.
    private static string CentralValue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return "";
        foreach (var line in value.Split('\n', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries))
        {
            var separator = line.IndexOf('|');
            if (separator >= 0 && line[..separator].Trim().Equals("Tienda principal", StringComparison.OrdinalIgnoreCase))
                return line[(separator + 1)..].Trim();
        }
        return value.Trim();
    }
}
