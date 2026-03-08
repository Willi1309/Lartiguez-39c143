# Ejercicio de Implementación Full Stack

## 1. Requisitos / Introducción

Necesita implementar una aplicación web sencilla que permita tomar notas, etiquetarlas y filtrarlas. El desarrollo se divide en dos fases:

- **Fase 1**: Creación de notas
- **Fase 2**: Aplicación y filtrado de etiquetas

### CONSIDERACIONES IMPORTANTES:

- La fase 1 es obligatoria para aprobar este ejercicio, mientras que la fase 2 otorgará puntos adicionales si se completa.
- El contenido debe persistir en una base de datos relacional mediante un ORM (memoria de ortografía). No se permite el almacenamiento en memoria ni simulaciones.

## 2. Entregables

Para aprobar este ejercicio, además de la implementación, debe:

- Subir el código a un repositorio privado de GitHub proporcionado por el equipo de RR. HH. de Ensolvers y usar Git correctamente. Tanto el frontend como el backend deben subirse a ese repositorio, en las carpetas `backend` y `frontend` respectivamente. - Incluya un script bash/zsh que permita ejecutar la aplicación. Idealmente, la aplicación debería iniciarse en un entorno Linux/MacOS con solo ejecutar un comando. Este comando debería configurar todo lo necesario para ejecutar la aplicación, como la configuración del esquema de la base de datos, la precreación de cualquier archivo de configuración, etc.
- Incluya un archivo `README.md` que describa todos los entornos de ejecución, motores, herramientas, etc., necesarios para ejecutar la aplicación, con sus versiones específicas (p. ej., npm 18.17, etc.).

## 3. Tecnologías

No hay restricciones sobre la tecnología a utilizar, siempre que:

- Estructurar la aplicación como una Aplicación Web de Página Única (SPA), es decir, el frontend y el backend son aplicaciones diferentes. Este es el caso general cuando se utiliza React, Angular, Vue.js o cualquier otro framework de interfaz de usuario similar. Tenga en cuenta que renderizar una página web en el servidor (mediante JSP, EJS, Smarty, Blade, etc.) pero usar algo de JS para, por ejemplo, obtener datos, no es una SPA pura. Debe implementar una aplicación aislada, en una carpeta independiente, con su package.json personalizado y sus dependencias.

- La aplicación backend expone una API REST para la comunicación con el frontend.

- La aplicación backend está dividida en capas (p. ej., Controladores, Servicios, DAO/Repositorios). Es importante mencionar que Laravel (PHP) y Django (Python) NO SOPORTAN esta separación de capas por defecto al crear aplicaciones. Por lo tanto, si envías un backend creado directamente con estas tecnologías sin realizar ajustes adicionales en la arquitectura, probablemente deba mejorarse o el ejercicio será rechazado directamente. Por otro lado, Spring Boot (Java) y Nestjs (Node.js) son dos tecnologías que aplican o facilitan el uso de esta separación de capas. Para más información, puedes consultar la definición del patrón [Capa de Servicio](https://martinfowler.com/eaaCatalog/serviceLayer.html) y un [ejemplo](https://www.sourcecodeexamples.net/2021/08/spring-boot-project-with-controller.html) en Spring Boot.

## 4. Historias de Usuario y Maquetas

### Fase 1

#### Historias de Usuario

- Como usuario, quiero poder crear, editar y eliminar notas. - Como usuario, quiero archivar/desarchivar notas.
- Como usuario, quiero listar mis notas activas.
- Como usuario, quiero listar mis notas archivadas.

### Fase 2

#### Historias de usuario

- Como usuario, quiero poder añadir/eliminar categorías a las notas.
- Como usuario, quiero poder filtrar las notas por categoría.

## 5. Requisitos adicionales funcionales y no funcionales

- **Inicio de sesión**: Si proporciona una pantalla de inicio de sesión, registre el usuario y la contraseña predeterminados en `README.md`.
- **Versión implementada**: Si implementa la aplicación (por ejemplo, a través de Heroku), agregue la URL de la versión en ejecución en `README.md`.