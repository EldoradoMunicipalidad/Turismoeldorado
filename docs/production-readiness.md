# Puesta en producción

## Qué ejecuta el contenedor

Al arrancar, `scripts/entrypoint.sh` comprueba `DATABASE_URL` y `AUTH_SECRET`; `scripts/apply-schema.mjs` selecciona del SQL generado únicamente `CREATE TABLE "HomePageContent"`. No ejecuta DDL de ninguna otra tabla. Si el SQL contiene operaciones distintas de `CREATE` o no encuentra exactamente esa tabla, aborta. Si la tabla ya existe, continúa sin tocar su estructura.

Después, el bootstrap inserta la fila `HomePageContent/default` solo si todavía no existe. Usa `ON CONFLICT DO NOTHING`, por lo que un home ya editado en el admin no se reemplaza. En la primera inicialización copia los campos no vacíos del hero desde `HomeConfig`; solo lee esa fila histórica y no la actualiza ni elimina. El resto de la configuración inicial proviene de `prisma/home-content-seed.json` y debe revisarse en `/admin/home`. Estas son las únicas dos escrituras de base de datos de este cambio: crear esta tabla e insertar esta fila si falta.

El despliegue no debe ejecutar `prisma/seed.ts`: ese script contiene `deleteMany()` para las colecciones y volvería a cargar datos de ejemplo. Tampoco hace falta ejecutar `prisma/seed-admin.ts` si ya existe el administrador; ese script cambia la contraseña del usuario indicado.

## Revisión previa

1. Crear y comprobar un backup restaurable de la base, o una rama/entorno de staging en Neon con una copia representativa.
2. Configurar en staging una `DATABASE_URL` de staging y un `AUTH_SECRET` aleatorio, único y de al menos 32 caracteres. No copiar secretos de producción al repositorio.
3. Desplegar la misma imagen que se pretende promover. Confirmar que el arranque termina correctamente y que no aparecen errores de SQL.
4. Iniciar sesión en `/admin/home`. Revisar textos, enlaces, imágenes, datos de contacto y las tarjetas. Confirmar que cada `sourceId` de atractivos/actividades existe en la colección correspondiente y que el contenido inicial es el aprobado.
5. Guardar un cambio de prueba en staging, recargar el admin y la portada, y comprobar que persiste. Revertir ese cambio de prueba desde el admin.
6. Revisar en Dokploy que el servicio no tenga un comando pre/post-deploy que ejecute `prisma/seed.ts` ni otro seed destructivo.
7. Confirmar cuál rama y evento activan el despliegue automático. Un commit local no publica; un push a la rama observada por Dokploy sí puede iniciar un despliegue.

## Variables requeridas

- `DATABASE_URL`: conexión de Neon adecuada para el runtime.
- `AUTH_SECRET`: secreto aleatorio propio del entorno, mínimo 32 caracteres. Si falta o es demasiado corto, el contenedor aborta y las rutas administrativas quedan cerradas.

## Verificación después del despliegue

- Revisar logs de arranque y el healthcheck `/`.
- Abrir la portada y `/admin/home`; confirmar que aparecen el hero, las secciones habilitadas, el encabezado y el pie.
- Guardar y volver a cargar un cambio pequeño del home para comprobar escritura y lectura.
- Confirmar en Neon que se creó `HomePageContent` y que la fila existente de `HomeConfig` y las colecciones mantienen sus registros.

El cambio de esquema es aditivo; un rollback de la aplicación no necesita borrar `HomePageContent`. No borrar esa tabla ni ejecutar seeds para revertir una versión.
