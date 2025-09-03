# Guía Tipográfica ConfesApp

## Resumen
Esta guía establece la jerarquía tipográfica consistente para toda la aplicación ConfesApp, combinando legibilidad moderna con elegancia apropiada para el contexto religioso.

## Fuentes Utilizadas

### Poppins
- **Fuente**: Sans-serif moderna y friendly
- **Uso**: Títulos y encabezados
- **Características**: Geométrica, legible, profesional

### Inter
- **Fuente**: Sans-serif optimizada para UI
- **Uso**: Texto de cuerpo, elementos de interfaz
- **Características**: Diseñada para pantallas, excelente legibilidad

## Jerarquía Tipográfica

### 1. Títulos Principales (H1, H2)
- **Fuente**: Poppins
- **Peso**: Bold (700)
- **Uso**: Pantallas iniciales, secciones importantes
- **Clase CSS**: `.heading-primary`
- **Ejemplo**: "Vuelve a la gracia"

```css
.heading-primary {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  letter-spacing: -0.025em;
}
```

### 2. Subtítulos (H3, H4)
- **Fuente**: Poppins
- **Peso**: Medium (500)
- **Uso**: Secciones secundarias, encabezados dentro de páginas
- **Clase CSS**: `.heading-secondary`
- **Ejemplo**: "Agenda fácil", "Ambiente reverente"

```css
.heading-secondary {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  letter-spacing: -0.01em;
}
```

### 3. Texto de Párrafos
- **Fuente**: Inter
- **Peso**: Regular (400)
- **Uso**: Descripciones, contenido largo, formularios
- **Clase CSS**: `.text-body`
- **Ejemplo**: Texto descriptivo de características

```css
.text-body {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  line-height: 1.6;
}
```

### 4. Notas, Botones, Labels Pequeños
- **Fuente**: Inter
- **Peso**: Medium (500) o SemiBold (600)
- **Uso**: Botones de acción, menús, mensajes de validación
- **Clases CSS**: `.text-ui-medium`, `.text-ui-semibold`

```css
.text-ui-medium {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.text-ui-semibold {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}
```

## Implementación

### Archivo CSS Principal
Las clases tipográficas están definidas en `/app/frontend/src/App.css`

### Archivo de Referencia
Documentación adicional en `/app/frontend/src/styles/typography-guide.css`

### Importación de Fuentes
```html
<!-- En /app/frontend/public/index.html -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

```css
/* En CSS */
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
```

## Ejemplos de Uso

### React/JSX
```jsx
{/* Título principal */}
<h1 className="text-4xl heading-primary text-purple-900">
  Vuelve a la gracia
</h1>

{/* Subtítulo */}
<h3 className="text-2xl heading-secondary text-purple-900">
  Agenda fácil
</h3>

{/* Texto de párrafo */}
<p className="text-body text-gray-600">
  Encuentra, agenda y prepárate para tu confesión de manera sencilla y reverente
</p>

{/* Botón */}
<button className="text-ui-semibold bg-purple-600 text-white px-6 py-3 rounded-xl">
  Agendar confesión
</button>

{/* Label */}
<label className="text-ui-medium text-sm text-gray-700">
  Correo electrónico
</label>
```

## Beneficios de esta Guía

✅ **Consistencia Visual**: Jerarquía clara en toda la aplicación
✅ **Legibilidad Optimizada**: Fuentes diseñadas para interfaces digitales
✅ **Profesionalismo**: Combinación moderna y elegante
✅ **Accesibilidad**: Excelente contraste y claridad
✅ **Mantenibilidad**: Sistema de clases reutilizables
✅ **Escalabilidad**: Fácil aplicación en nuevos componentes

## Versión
- **Implementada**: 2 de Septiembre 2025
- **Estado**: ✅ Activa
- **Archivos Modificados**: 
  - `/app/frontend/src/App.css`
  - `/app/frontend/public/index.html`
  - `/app/frontend/src/App.js`