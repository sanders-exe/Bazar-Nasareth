-- Actualización aditiva para una base de Bazar Nazareth ya inicializada.
-- Seleccione la base de destino antes de ejecutar. Las referencias actuales se conservan.
SET XACT_ABORT ON;

IF OBJECT_ID(N'dbo.SeccionContenido', N'U') IS NULL OR OBJECT_ID(N'dbo.Imagen', N'U') IS NULL
    THROW 50001, 'Seleccione una base de Bazar Nazareth ya inicializada.', 1;

BEGIN TRANSACTION;

IF COL_LENGTH(N'dbo.SeccionContenido', N'Imagen2Id') IS NULL
    ALTER TABLE dbo.SeccionContenido ADD Imagen2Id int NULL;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.SeccionContenido') AND name = N'IX_SeccionContenido_Imagen2Id'
)
    EXEC(N'CREATE INDEX IX_SeccionContenido_Imagen2Id ON dbo.SeccionContenido (Imagen2Id);');

IF OBJECT_ID(N'dbo.FK_SeccionContenido_Imagen_Imagen2Id', N'F') IS NULL
    EXEC(N'ALTER TABLE dbo.SeccionContenido WITH CHECK ADD CONSTRAINT FK_SeccionContenido_Imagen_Imagen2Id
        FOREIGN KEY (Imagen2Id) REFERENCES dbo.Imagen (Id);');

COMMIT TRANSACTION;
