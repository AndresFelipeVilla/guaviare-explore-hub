# Solución: Pantalla en Blanco en /admin/informes

## Cambios Implementados

Se han agregado las siguientes mejoras para diagnosticar y solucionar el problema de pantalla en blanco en `/admin/informes`:

### 1. ✅ Logging Completo en AdminViewReports

Ahora la página `AdminViewReports.tsx` incluye logs en consola para cada etapa:

```typescript
console.log('=== AdminViewReports Component Mounted ===');
console.log('Stored user data:', storedUser);
console.log('Auth check - isAuthenticated:', authService.isAuthenticated());
console.log('User role (uppercase):', role);
console.log('Fetching user profile...');
console.log('Profile data received:', data);
console.log('Fetching admin reports...');
console.log('Reports data received:', data);
console.log('Display values:', { userName, userRole, userPosition });
console.log('Rendering dashboard UI...');
```

### 2. ✅ Manejo de Errores Visual

- **Estado de carga** mientras se obtiene el perfil
- **Pantalla de error** si ocurre un error crítico
- **Banner de advertencia** si no se pueden cargar los informes (pero se muestran datos de ejemplo)

### 3. ✅ Error Boundary Global

Se creó `src/components/ErrorBoundary.tsx` y se agregó a `App.tsx` para capturar errores de renderizado que causen pantallas en blanco.

### 4. ✅ Manejo de Reintentos

Las queries de React Query tienen `retry: false` para evitar esperas innecesarias y mostrar errores inmediatamente.

## Cómo Diagnosticar el Problema

### Paso 1: Abrir la Consola del Navegador

1. Presiona `F12` en el navegador
2. Ve a la pestaña **Console**
3. Limpia la consola (botón de "Clear console" o Ctrl+L)

### Paso 2: Intentar Acceder al Dashboard

1. Ve a `http://localhost:8081/register`
2. Completa el formulario de registro de jefe
3. Haz clic en "Registrar Jefe"

O si ya estás registrado:

1. Ve a `http://localhost:8081/auth`
2. Inicia sesión con tus credenciales de jefe

### Paso 3: Observar los Logs

Verás una secuencia de logs como esta si todo funciona bien:

```
Form submission started with data: {...}
Form validation passed, submitting to API...
Registration API call successful: {...}
Post-registration state: { hasToken: true, hasUserData: true, ... }
Auto-login successful, redirecting to admin dashboard...
=== AdminViewReports Component Mounted ===
Stored user data: { id: "...", name: "...", role: "BOSS", ... }
Auth check - isAuthenticated: true
User role (uppercase): BOSS
User is admin/boss, staying on admin page
Fetching user profile...
Fetching admin reports...
Profile data received: {...}
Reports data received: [...]
Display values: { userName: "...", userRole: "BOSS", userPosition: "..." }
Rendering dashboard UI...
```

### Paso 4: Identificar el Error

Si ves un error, identifica en qué etapa ocurre:

#### ❌ Error: "User not authenticated"
```
Auth check - isAuthenticated: false
User not authenticated, redirecting to /auth
```

**Causa**: No hay token en localStorage
**Solución**: El backend no está devolviendo el token al registrar

#### ❌ Error: "Error fetching profile"
```
Fetching user profile...
Error fetching profile: Error: No se pudo conectar con el servidor
```

**Causa**: El backend no está respondiendo al endpoint `/api/users/profile`
**Solución**: Verificar que el backend esté corriendo y el endpoint exista

#### ❌ Error: "Error fetching reports"
```
Fetching admin reports...
Error fetching reports: Error: ...
```

**Causa**: El backend no está respondiendo al endpoint `/api/reports/summary`
**Solución**: Se mostrarán datos de ejemplo, pero verifica el backend

#### ❌ Error de Renderizado
```
Error rendering dashboard: TypeError: Cannot read property 'X' of undefined
```

**Causa**: Error en algún componente hijo (AdminSidebar, ReportsTable, etc.)
**Solución**: Revisar el error específico en el stack trace

## Posibles Causas y Soluciones

### Causa 1: Backend No Devuelve Token al Registrar

**Síntoma**:
```
Registration API call successful: { message: "...", user: {...} }
Post-registration state: { hasToken: false, hasUserData: true, ... }
User not authenticated, redirecting to /auth
```

**Solución**: El backend debe devolver:
```json
{
    "message": "...",
    "token": "JWT_TOKEN_AQUI",
    "user": { ... }
}
```

### Causa 2: Endpoint `/api/users/profile` No Existe

**Síntoma**:
```
Fetching user profile...
Error fetching profile: Error: 404 Not Found
```

**Solución**: 
- Implementar el endpoint en el backend
- O modificar el frontend para no llamarlo si no es necesario

### Causa 3: Datos del Usuario No Tienen Formato Correcto

**Síntoma**:
```
Stored user data: null
```
o
```
Error rendering dashboard: Cannot read property 'name' of null
```

**Solución**: Verificar que localStorage contenga:
```json
{
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "BOSS",
    "position": "..."
}
```

### Causa 4: Componente Hijo Lanza Error

Si el ErrorBoundary atrapa un error, muestra la pantalla de error con detalles técnicos.

**Solución**: Revisar el stack trace en los detalles técnicos del error.

## Validación Manual

### Verificar localStorage

En la consola del navegador, ejecuta:

```javascript
// Verificar token
console.log('Token:', localStorage.getItem('authToken'));

// Verificar datos de usuario
console.log('User Data:', JSON.parse(localStorage.getItem('userData')));
```

Debe mostrar:
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User Data: { id: "...", name: "...", email: "...", role: "BOSS", position: "..." }
```

### Verificar Endpoints del Backend

Desde PowerShell:

```powershell
# Verificar que el backend responda
Test-NetConnection -ComputerName localhost -Port 8084

# Probar endpoint de perfil (necesitas un token válido)
$token = "TU_TOKEN_AQUI"
Invoke-RestMethod -Uri "http://localhost:8084/api/users/profile" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $token" } `
    -UseBasicParsing

# Probar endpoint de informes
Invoke-RestMethod -Uri "http://localhost:8084/api/reports/summary" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $token" } `
    -UseBasicParsing
```

## Solución Temporal: Datos Mock

Si el backend no está disponible, el servicio `dashboardService.getAdminReports()` ya incluye datos de ejemplo (mock data) y mostrará un banner de advertencia.

El dashboard funcionará y mostrará 5 informes de ejemplo.

## Archivos Modificados

1. ✅ `src/pages/AdminViewReports.tsx` - Logging y manejo de errores
2. ✅ `src/components/ErrorBoundary.tsx` - Nuevo componente
3. ✅ `src/App.tsx` - ErrorBoundary agregado
4. ✅ `src/components/auth/BossRegistrationForm.tsx` - Logging y manejo de errores

## Próximos Pasos

1. **Abrir la consola del navegador**
2. **Intentar registrarse o iniciar sesión**
3. **Revisar los logs** para identificar exactamente dónde falla
4. **Compartir los logs** si el problema persiste

Con estos cambios, ya no deberías ver una página en blanco sin información. En su lugar, verás:
- ✅ Una pantalla de carga
- ✅ Una pantalla de error con mensaje claro
- ✅ El dashboard funcionando con datos mock si el backend falla
- ✅ Logs completos para diagnosticar el problema

---

**Fecha**: 2026-01-13
**Estado**: ✅ Implementado y listo para pruebas
