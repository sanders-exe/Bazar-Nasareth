[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [pscredential]$Credential
)

$ErrorActionPreference = 'Stop'
$api = 'http://localhost:5080/api'
$email = 'demo@bazar.example'
if ($Credential.UserName -ne $email) {
    throw "Use la cuenta $email creada en la instalación de demostración."
}

$origin = @{ Origin = 'http://localhost:5080' }

function Invoke-DemoApi {
    param([string]$Route, [string]$Method = 'Get', [object]$Body)
    $request = @{ Uri = "$api/$Route"; Method = $Method; WebSession = $session; Headers = $origin; TimeoutSec = 30 }
    if ($PSBoundParameters.ContainsKey('Body')) {
        $request.ContentType = 'application/json; charset=utf-8'
        $request.Body = ConvertTo-Json -InputObject $Body -Depth 5 -Compress
    }
    Invoke-RestMethod @request
}

function Add-DemoImage {
    param([string]$Name, [string]$Alt, [string]$Base64)
    $form = [System.Net.Http.MultipartFormDataContent]::new()
    try {
        $image = [System.Net.Http.ByteArrayContent]::new([Convert]::FromBase64String($Base64))
        $image.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::new('image/png')
        $form.Add($image, 'archivo', $Name)
        $form.Add([System.Net.Http.StringContent]::new($Alt), 'textoAlternativo')
        Invoke-RestMethod -Uri "$api/admin/imagenes" -Method Post -Headers $origin -WebSession $session -TimeoutSec 30 -Body $form
    }
    finally { $form.Dispose() }
}

$login = @{ email = $email; password = $Credential.GetNetworkCredential().Password }
$null = Invoke-RestMethod -Uri "$api/login" -Method Post -Headers $origin -SessionVariable session -TimeoutSec 30 `
    -ContentType 'application/json; charset=utf-8' -Body (ConvertTo-Json -InputObject $login -Compress)

try {
    $editors = Invoke-DemoApi 'admin/editores'
    $business = Invoke-DemoApi 'admin/negocio'
    if ($editors.Count -ne 1 -or $editors[0].email -ne $email -or
        $business.id -ne 1 -or $business.direccion -ne 'Hojancha, Guanacaste' -or
        $business.horario -ne 'Consultar horario') {
        throw 'La API local debe usar una base nueva, con el contacto inicial y una sola cuenta de demostración.'
    }
    foreach ($collection in @('categorias', 'productos', 'servicios', 'promociones', 'secciones', 'galeria', 'imagenes')) {
        $existing = Invoke-DemoApi "admin/$collection"
        if ($null -ne $existing -and $existing.Count -gt 0) {
            throw "La colección $collection ya contiene datos. Use una base de demostración nueva."
        }
    }

    # Imágenes sintéticas en PNG. Comparten biblioteca, pero cada ficha conserva su propia referencia.
    $blue = Add-DemoImage 'demo-azul.png' 'Muestra de color azul para la demostración' 'iVBORw0KGgoAAAANSUhEUgAAAGAAAACACAIAAAB7vvvtAAAA/0lEQVR4nO3QAQ2EQBAEQSziCCMvAhMIQcmbWHKdSyUjoKeO87pH9nvekdV6jlpQrQcQIECAAAECBAhQJKjWAwgQIECAAAECBCgSVOsBBAgQIECAAAECFAmq9QACBOhboF2PTfUAAgQIECBAgAABigTVegABAgQIECBAgABFgmo9gAABAgQIECBAgCJBtR5AgAABWgq067GpHkCAAAECBAgQIECRoFoPIECAAAECBAgQoEhQrQcQIECAAAECBAhQJKjWAwgQIEBLgXY9NtUDCBAgQIAAAQIEKBJU6wEECBAgQIAAAQIUCar1AAIECBAgQIAAAYoE1XoAAQIEaGXPH/bGrUfIwAQ7AAAAAElFTkSuQmCC'
    $pink = Add-DemoImage 'demo-rosa.png' 'Muestra de color rosa para la demostración' 'iVBORw0KGgoAAAANSUhEUgAAAGAAAACACAIAAAB7vvvtAAAA/0lEQVR4nO3QUQ2EQBQEQTSiCClngy8MIeJMPLKdTSUjoKeO57xG9v7ukdV6jlpQrQcQIECAAAECBAhQJKjWAwgQIECAAAECBCgSVOsBBAgQIECAAAECFAmq9QACBOhboF2PTfUAAgQIECBAgAABigTVegABAgQIECBAgABFgmo9gAABAgQIECBAgCJBtR5AgAABWgq067GpHkCAAAECBAgQIECRoFoPIECAAAECBAgQoEhQrQcQIECAAAECBAhQJKjWAwgQIEBLgXY9NtUDCBAgQIAAAQIEKBJU6wEECBAgQIAAAQIUCar1AAIECBAgQIAAAYoE1XoAAQIEaGXPHxS7FWXU0Rx3AAAAAElFTkSuQmCC'
    $category = Invoke-DemoApi 'admin/categorias' 'Post' @{ nombre = 'Papelería de muestra'; orden = 1; activa = $true }
    $null = Invoke-DemoApi 'admin/productos/guardar' 'Post' @{
        producto = @{ categoriaId = $category.id; nombre = 'Cuaderno de muestra'; descripcion = 'Cuaderno ficticio para practicar la edición.'; orden = 1; estado = 'Publicado'; precioInformativo = 1200; moneda = 'CRC'; destacado = $true }
        imagenes = @($blue.id)
    }
    $null = Invoke-DemoApi 'admin/servicios' 'Post' @{
        nombre = 'Impresión de muestra'; descripcion = 'Servicio ficticio de impresión.'; alcance = 'Impresión de documentos de ejemplo en tamaño carta.'; imagenId = $pink.id; orden = 1; estado = 'Publicado'
    }
    $null = Invoke-DemoApi 'admin/secciones' 'Post' @{
        clave = 'portada'; titulo = 'Bazar Nazareth de Hojancha'; cuerpo = 'Bienvenida para la demostración con datos ficticios.'; imagenId = $blue.id; orden = 1; estado = 'Publicado'
    }
    $null = Invoke-DemoApi 'admin/secciones' 'Post' @{
        clave = 'preguntas'; titulo = 'Preguntas de muestra'; cuerpo = 'Contenido ficticio que puede editarse desde el panel.'; orden = 2; estado = 'Publicado'
    }
    $null = Invoke-DemoApi 'admin/galeria' 'Post' @{
        titulo = 'Fotografía de muestra'; imagenId = $pink.id; orden = 1; estado = 'Publicado'
    }
    $null = Invoke-DemoApi 'admin/negocio' 'Put' @{
        nombre = 'Bazar Nazareth de Hojancha'; direccion = 'Hojancha, Guanacaste (ubicación ficticia)'; horario = 'Lunes a viernes, 9:00 a. m. a 4:00 p. m.'; telefono = '+506 0000 0000'; enlaceContacto = 'https://example.com/contacto'
    }
    Write-Output 'Datos ficticios cargados. Abra /login en el frontend para ejecutar el guion de demostración.'
}
finally {
    try { $null = Invoke-DemoApi 'logout' 'Post' } catch { Write-Verbose 'La sesión de demostración ya no está disponible.' }
}
