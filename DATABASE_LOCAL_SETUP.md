# TERRANOVA GESTIÓN INMOBILIARIA S. DE R.L.
## Guía de Instalación y Ejecución de la Base de Datos Local

Esta guía te explica paso a paso cómo montar y ejecutar la base de datos completa de **Terranova Gestión Inmobiliaria** en tu computadora local (localhost) para probarla y verificar su funcionamiento.

---

### Requisitos Previos

Puedes utilizar cualquiera de los siguientes entornos en tu máquina local:

1. **XAMPP / WAMP / Laragon** (Recomendado para principiantes con MySQL / MariaDB + phpMyAdmin)
2. **PostgreSQL 14+ / pgAdmin 4**
3. **Docker / Docker Compose** (Instalación limpia en 30 segundos)
4. **DBeaver / MySQL Workbench** (Clientes de administración gráfica)

---

### Opción 1: Ejecución en MySQL / MariaDB con XAMPP

1. **Iniciar Servicios:**
   - Abre el **XAMPP Control Panel**.
   - Inicia los módulos **Apache** y **MySQL** haciendo clic en **Start**.

2. **Abrir phpMyAdmin:**
   - Ingresa en tu navegador web a: `http://localhost/phpmyadmin`

3. **Importar el Script SQL:**
   - En el menú superior de phpMyAdmin, haz clic en la pestaña **Importar** (Import).
   - Haz clic en **Seleccionar archivo** (Choose File) y elige:
     `documentacion/script_base_de_datos.sql` o `script_base_de_datos.txt`.
   - Asegúrate de que el juego de caracteres esté en `utf-8`.
   - Haz clic en el botón **Continuar** (Go) al final de la página.

4. **Verificación:**
   - En la barra lateral izquierda verás la nueva base de datos: `terranova_inmobiliaria`.
   - Verás todas las tablas creadas con sus relaciones e índices:
     - `roles`
     - `users`
     - `company_settings`
     - `bank_accounts`
     - `properties`
     - `contract_templates` (Plantillas de contratos oficiales en .docx y .pdf)
     - `lease_contracts` (Contratos de venta, plazos, arrendamiento con firmas y documentos.pdf)
     - `contract_clauses`
     - `employees` (Nómina de colaboradores y asesores)
     - `payroll_records` (Liquidaciones de salario y comisiones)
     - `payment_transactions` (Comprobantes y recibos con cuenta bancaria circulada)
     - `maintenance_requests` (Tickets de mantenimiento)
     - `calendar_events` (Citas y visitas)
     - `system_logs` (Auditoría)

---

### Opción 2: Ejecución por Terminal (Línea de Comandos MySQL)

Si tienes MySQL o MariaDB instalado en tu PATH:

```bash
# 1. Ingresar a la consola de MySQL
mysql -u root -p

# 2. Ejecutar el script directamente desde la raíz del proyecto
mysql -u root -p < documentacion/script_base_de_datos.sql
```

Para verificar que las tablas y datos semilla se crearon con éxito:

```sql
USE terranova_inmobiliaria;
SHOW TABLES;
SELECT code, title, price, transaction_type, status FROM properties;
SELECT contract_number, contract_type, tenant_name, total_value, signed_document_file_name FROM lease_contracts;
SELECT name, position, base_salary, commission_rate FROM employees;
```

---

### Opción 3: Ejecución en Docker (Sin instalar nada más)

Si tienes Docker instalado en tu máquina, puedes levantar MySQL con un solo comando:

```bash
# Levantar contenedor MySQL 8.0
docker run --name terranova-mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=terranova_inmobiliaria \
  -p 3306:3306 \
  -d mysql:8.0

# Copiar y ejecutar el script dentro del contenedor
docker cp documentacion/script_base_de_datos.sql terranova-mysql:/script.sql
docker exec -i terranova-mysql mysql -u root -psecret < documentacion/script_base_de_datos.sql

# Probar consulta
docker exec -it terranova-mysql mysql -u root -psecret -e "USE terranova_inmobiliaria; SHOW TABLES;"
```

---

### Opción 4: Ejecución en PostgreSQL (pgAdmin o psql)

Para entornos PostgreSQL:

```bash
# Crear base de datos
createdb -U postgres terranova_inmobiliaria

# Ejecutar el script compatible
psql -U postgres -d terranova_inmobiliaria -f documentacion/script_base_de_datos.sql
```

---

### Estructura de Credenciales y Seguridad

- **Contraseñas:** Todas las credenciales semilla en `users` han sido cifradas utilizando el estándar criptográfico **bcrypt** con factor de costo 12 (`$2a$12$...`) y digest **SHA-256**.
- **Roles:**
  - `admin`: Kenneth Adonay Zúniga (`kenneth.zuniga@unah.hn`)
  - `agent`: Anthony Rafael Alfaro (`anthony.alfaro@unah.hn`)
  - `owner`: Keydi Reyes (`keydi.reyes@unah.hn`)
  - `tenant`: Carlos Mendoza (`carlos.mendoza@cliente.hn`)

---

### Exportación Directa desde la Aplicación Web

También puedes descargar el script SQL generado con los últimos cambios en vivo directamente desde la aplicación:
1. Haz clic en **"Base de Datos Local (.sql)"** en el pie de página o dentro del manual de usuario.
2. Selecciona tu motor preferido (**MySQL** o **PostgreSQL**).
3. Pulsa **"Descargar .sql"** o **"Copiar SQL"**.
