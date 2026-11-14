# Manual de edición y demostración

## Editar contenido

Abra `/login` en la página del bazar e inicie sesión con su cuenta editora. Use el menú lateral para elegir la sección. **Vista previa** muestra los cambios del formulario. Después de revisarlos, cierre la vista previa y pulse **Guardar y publicar** con el estado **Publicado**. Use **Borrador** si necesita continuar después.

| Para cambiar | Pasos |
| --- | --- |
| Imágenes de portada | En **Portada**, abra la ficha y seleccione **Imagen 1** (foto grande) e **Imagen 2** (foto pequeña). Puede elegir fotos de la biblioteca o subir una nueva usando **Asignar a** para escoger su posición. **Usar imagen original** restaura la foto de vasos en la primera posición o la de regalo para padrinos en la segunda. Revise ambas en **Vista previa** y guarde. Si aún no hay ficha, use **Crear portada**. |
| Textos | En **Información adicional**, abra una sección y modifique el título o la descripción visible. Conserve la clave al editar una sección existente. Use **Portada** para cambiar el texto de bienvenida. |
| Producto | En **Productos**, abra la ficha. Para mantenerla publicada, conserve una categoría activa, un nombre, una descripción y al menos una foto. El precio informativo es opcional. Si se indica un precio, elija la moneda. |
| Servicio | En **Servicios**, edite el nombre, la descripción o el alcance. Puede asignar una foto y un precio informativo opcionales. |
| Promoción | En **Promociones**, cree el anuncio y escriba título, descripción y condiciones. Seleccione una imagen y defina el inicio y el fin en hora de Costa Rica. Puede asociar productos o servicios. Revise las fechas en **Vista previa** y publique. La promoción aparece desde la hora de inicio y se retira al llegar al fin. Para retirarla antes, use **Archivar**. |
| Horario y dirección | En **Contacto**, actualice los datos de la sede central y pulse **Guardar contacto**. Compruebe la dirección y el horario en Contacto y en el pie de página. En instalaciones con los valores antiguos de dos locales, el editor muestra los datos de la tienda principal. |
| Retirar una foto | En **Galería**, pulse **Archivar** en la entrada y confirme. En la página pública desaparece esa entrada. La imagen queda disponible en la biblioteca y sigue apareciendo donde se use por separado. |

## Preparar la demostración

Use una base SQL Server **vacía y exclusiva para la demostración**, por ejemplo `BazarNazarethDemo`. En PowerShell 7, desde la raíz del repositorio, configure el servidor local y la ruta de imágenes separada. El ejemplo supone SQL Server Express. Para LocalDB, sustituya `.\SQLEXPRESS` por `(localdb)\MSSQLLocalDB`. Cree la base vacía o use una cuenta de SQL Server con permiso para crearla.

```powershell
$env:ConnectionStrings__Bazar = 'Server=.\SQLEXPRESS;Database=BazarNazarethDemo;Integrated Security=True;TrustServerCertificate=True'
$env:ImageDirectory = Join-Path ([IO.Path]::GetTempPath()) ('bazar-demo-imagenes-' + [guid]::NewGuid().ToString('N'))
$env:INITIAL_ADMIN_EMAIL = 'demo@bazar.example'
$demoPassword = Read-Host 'Contraseña temporal para la cuenta demo (12 caracteres o más)' -AsSecureString
$env:INITIAL_ADMIN_PASSWORD = [pscredential]::new($env:INITIAL_ADMIN_EMAIL, $demoPassword).GetNetworkCredential().Password
dotnet run --project backend --no-launch-profile --urls http://localhost:5080
```

Desde otra terminal PowerShell 7, en la raíz del repositorio, use la misma contraseña temporal cuando se la solicite el script.

```powershell
./scripts/Initialize-BazarDemo.ps1 -Credential (Get-Credential -UserName 'demo@bazar.example' -Message 'Cuenta local de demostración')
npm --prefix frontend ci
npm --prefix frontend run dev
```

El script usa la API local, comprueba la cuenta y el contacto iniciales y exige que las colecciones estén vacías. Carga dos PNG sintéticos, una ficha de cada tipo, un texto editable, una foto de galería y un contacto ficticio. La primera promoción se crea durante la demostración. Si la carga falla después de escribir datos, use una base de demostración nueva e indique otra carpeta de imágenes para repetir la carga completa.

## Guion de aceptación

1. En `http://localhost:5173/login`, entre con la cuenta de demostración. Cambie **Imagen 1** de **Portada** de azul a rosa y asigne la azul a **Imagen 2**. En la página pública compruebe ambas posiciones y que el **Cuaderno de muestra** conserva la azul.
2. Cambie la descripción del **Cuaderno de muestra** y el alcance de **Impresión de muestra**. Revise, guarde y compruebe los textos en las fichas públicas.
3. Cree **Promoción de demostración** como borrador. Use una imagen, descripción y condiciones ficticias. Establezca el inicio para dentro de dos minutos y el fin uno o dos minutos después. Abra **Vista previa** y confirme ambas fechas y horas. Guarde primero como borrador y compruebe que la página no la muestra.
4. Cambie la promoción a **Publicado**, vuelva a revisar y guarde. Abra la página pública antes del inicio y mantenga esa pestaña visible. Verifique que la tarjeta aparece al empezar y desaparece al vencer, sin recargar manualmente. Desde el editor confirme que la promoción sigue registrada.
5. Cambie el horario en **Contacto**, guarde y confirme que ese mismo texto aparece en Contacto y en el pie de página.
6. Archive **Fotografía de muestra** y compruebe que sale de Galería. En **Imágenes** la foto rosa debe seguir disponible y permanecer en la portada.

Para cerrar la demostración, detenga las dos aplicaciones y borre la variable temporal de contraseña con `Remove-Item Env:INITIAL_ADMIN_PASSWORD` en la terminal de la API.
