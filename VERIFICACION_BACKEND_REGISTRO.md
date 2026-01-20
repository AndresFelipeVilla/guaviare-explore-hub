# Verificación del Backend para Registro de Jefe

## Estado Actual

✅ **Frontend**: Corriendo en `http://localhost:8081/`
✅ **Backend**: Corriendo en `http://localhost:8084/` (respondió con 401 en `/actuator/health`)

## Verificar Endpoint de Registro de Jefe

Para confirmar que el endpoint de registro funciona correctamente, sigue estos pasos:

### Opción 1: Prueba Manual desde el Frontend

1. **Abrir la consola del navegador** (`F12` → pestaña Console)
2. **Navegar a** `http://localhost:8081/register`
3. **Seleccionar** tipo de usuario "Jefe"
4. **Llenar el formulario** con datos de prueba:
   - Nombre: `Juan Pérez`
   - Email: `juan.perez@test.com`
   - Contraseña: `123456`
   - Cargo: `Gerente General`
   - Departamento: `Operaciones`
   - Código de Jefe: `BOSS001`
5. **Hacer clic en** "Registrar Jefe"
6. **Observar los logs en consola** que dirán:
   ```
   Form submission started with data: {...}
   Form validation passed, submitting to API...
   ```
7. **Verificar el resultado**:
   - ✅ Si es exitoso: verás `Registration API call successful:` y redirección
   - ❌ Si falla: verás `Registration error:` con detalles del error

### Opción 2: Prueba con cURL (PowerShell)

```powershell
# Crear un objeto con los datos de registro
$body = @{
    name = "Juan Pérez"
    email = "juan.perez@test.com"
    password = "123456"
    position = "Gerente General"
    department = "Operaciones"
    bossCode = "BOSS001"
} | ConvertTo-Json

# Hacer la petición POST
Invoke-RestMethod -Uri "http://localhost:8084/api/auth/boss" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing
```

### Opción 3: Revisar Logs del Backend

Si tienes acceso a los logs del backend (Spring Boot), busca:

```
POST /api/auth/boss
```

Y verifica:
- ✅ ¿Se recibe la petición?
- ✅ ¿Hay errores en el proceso?
- ✅ ¿Se guarda correctamente en la base de datos?
- ✅ ¿Se devuelve token y datos de usuario?

## Respuesta Esperada del Backend

El backend debe responder con:

```json
{
    "message": "Jefe registrado exitosamente",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Juan Pérez",
        "email": "juan.perez@test.com",
        "role": "BOSS",
        "position": "Gerente General"
    }
}
```

### Campos Importantes

1. **`token`** (CRÍTICO): Sin este campo, el frontend no podrá autenticar automáticamente
2. **`user.role`**: Debe ser `"BOSS"` o `"JEFE"` para redirigir correctamente
3. **`user`**: Datos del usuario que se almacenarán en localStorage

## Posibles Problemas en el Backend

### 1. Endpoint No Implementado
**Síntoma**: Error 404 "Not Found"
**Solución**: Verificar que existe un `@PostMapping("/api/auth/boss")` en el controlador

### 2. Respuesta Sin Token
**Síntoma**: Frontend redirige a login después de registro
**Solución**: El backend debe generar y devolver el token JWT en la respuesta

### 3. Error de Validación
**Síntoma**: Error 400 "Bad Request"
**Solución**: Verificar que los campos del request coincidan con los del DTO del backend

### 4. Base de Datos No Disponible
**Síntoma**: Error 500 "Internal Server Error"
**Solución**: Verificar conexión a la base de datos

### 5. Email Duplicado
**Síntoma**: Error indicando que el email ya existe
**Solución**: Usar un email diferente o limpiar la base de datos de pruebas

## Comandos Útiles

### Verificar que el Backend está Corriendo

```powershell
# Intentar conectar al backend
Test-NetConnection -ComputerName localhost -Port 8084
```

### Ver Logs del Backend

Si estás corriendo el backend con Maven/Gradle:
```bash
# Terminal donde está corriendo el backend
# Los logs aparecerán automáticamente
```

## Flujo Completo de Depuración

1. ✅ **Verificar que ambos servidores estén corriendo**
   - Frontend: http://localhost:8081
   - Backend: http://localhost:8084

2. ✅ **Intentar registro desde el frontend**
   - Llenar formulario
   - Observar consola del navegador

3. ✅ **Revisar logs del backend**
   - Verificar que llegó la petición
   - Verificar respuesta

4. ✅ **Verificar localStorage**
   - Abrir DevTools → Application → Local Storage
   - Buscar `authToken` y `userData`

5. ✅ **Verificar redirección**
   - Si hay token: debe ir a `/admin/informes`
   - Si no hay token: debe mostrar mensaje y redirigir a `/auth`

## Archivos Relacionados del Backend

Verifica estos archivos en tu backend:

- `AuthController.java`: Debe tener endpoint `/api/auth/boss`
- `AuthService.java`: Lógica de registro de jefe
- `JwtService.java`: Generación del token
- `BossRegistrationRequest.java`: DTO para el request
- `RegistrationResponse.java`: DTO para la respuesta

## Contacto para Soporte

Si después de seguir estos pasos el problema persiste:

1. Copia los logs de la consola del navegador
2. Copia los logs del backend
3. Copia el mensaje de error exacto que aparece
4. Proporciona esta información para análisis detallado

---

**Última actualización**: 2026-01-13
