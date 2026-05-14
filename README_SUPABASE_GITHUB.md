# Registro de Incidentes con Supabase + GitHub Pages

Este paquete reemplaza Firebase por Supabase y mantiene la aplicación como sitio estático compatible con GitHub Pages.

## 1. Crear tablas

1. Entra a Supabase > SQL Editor.
2. Copia y ejecuta `schema.sql`.
3. Verifica que existan estas tablas:
   - `agentes`
   - `directorio`
   - `tickets`
   - `app_config`

## 2. Autenticación

En Supabase > Authentication > Providers:

- Habilita Email.
- Configura si deseas exigir confirmación de correo.
- En URL Configuration agrega tu URL de GitHub Pages:

```text
https://TU_USUARIO.github.io/TU_REPOSITORIO/
```

Y si pruebas localmente:

```text
http://localhost:8000
```

La app usa:

- Registro de agente con correo y contraseña.
- Inicio de sesión con correo y contraseña.
- Recuperación de contraseña vía correo.
- Tabla `agentes` para perfil, rol y estado operativo.

## 3. Publicar en GitHub Pages

Sube como mínimo:

```text
index.html
.nojekyll
```

Luego habilita GitHub Pages desde Settings > Pages.

## 4. Valoración pública

Cuando un ticket está en estado `Resuelto`, el sistema genera un enlace así:

```text
https://TU_USUARIO.github.io/TU_REPOSITORIO/#rate_ticket=UUID&token=TOKEN
```

Ese enlace abre solo la pantalla de valoración. No muestra ni permite regresar al panel administrativo.

Al enviar la valoración:

- Guarda estrellas y comentario en `tickets`.
- Borra el `rating_token` para que el enlace quede usado.
- Oculta la pantalla y muestra un mensaje para cerrar la pestaña.

## 5. Importación masiva de tickets

En el módulo Registros se agregó `Importar CSV`.

Debe usar el mismo formato exportado desde Reportes:

```text
ID,Fecha,Agente,Cedula_Usuario,Nombre_Usuario,Asunto,Categoria,Subcategoria,Prioridad,Canal,Estado,Valoracion_Estrellas,Comentario_Valoracion
```

La importación usa `id_str` como clave única. Si el ID ya existe, actualiza el registro.

## 6. Dashboard

Incluye filtros dinámicos por:

- Fecha desde
- Fecha hasta
- Estado
- Categoría
- Agente

Incluye KPIs:

- Total de tickets
- Resueltos
- Seguimiento
- Promedio de valoración
- Porcentaje de resolución

Incluye gráficos:

- Pastel por estado
- Barras por categoría
- Línea de tendencia diaria
- Barras por agente

## 7. Notas de seguridad

La publishable key de Supabase puede estar en frontend, pero las reglas RLS son obligatorias. El archivo `schema.sql` activa RLS y define políticas para agentes autenticados y valoración pública con token.

Para producción institucional se recomienda:

- Revisar dominios permitidos en Supabase Auth.
- Desactivar registro público de agentes si solo un administrador debe crearlos.
- Promover manualmente a `admin` desde SQL cuando corresponda.
- Revisar logs y políticas antes de cargar datos reales.

## Módulo Informe Documental

Esta versión incluye el módulo **Informe Documental**, diseñado para generar evidencia institucional con el estilo de la Plantilla Documental Cordillera.

Funciones incluidas:

- filtros por fecha, estado, categoría y agente;
- vista previa de KPIs antes de exportar;
- exportación a DOCX institucional, PDF y HTML;
- anexo opcional con detalle completo de tickets;
- descarga de `PlantillaDocumentosCordilleraGeneral2024.docx` como plantilla base;
- registro de metadatos en la tabla `informes_documentales`.

Para habilitar el registro histórico de informes, ejecuta de nuevo el archivo `schema.sql` en Supabase SQL Editor. El script es seguro para re-ejecución porque usa `create table if not exists` y `drop policy if exists`.
