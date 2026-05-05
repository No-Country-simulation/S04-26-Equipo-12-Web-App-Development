src/ 
│ 
├── api/                      # Funciones y configuraciones de llamadas a la API
├── assets/                   # Recursos estáticos (imágenes, fuentes, etc.)
├── components/               # Componentes de interfaz de usuario compartidos
 │ ├── atoms/                # Elementos básicos reutilizables (p. ej., Botón, Entrada)
 │ ├── molecules/            # Combinaciones de átomos (p. ej., FormGroup, Navbar)
 │ ├── organisms/            # Componentes complejos (p. ej., Tarjeta, Modal)
 │ └── templates/            # Secciones de página y contenedores de diseño
 │ 
├── features/                 # Módulos basados en características (p. ej., chat, contactos)
 │ ├── [ nombre-de-la-característica ] /       # Carpeta de característica individual
 │ │ ├── components/       # Componentes específicos de la función
 │ │ ├── hooks/            # Ganchos específicos de la función
 │ │ ├── api.ts            # Llamadas a la API específicas de la función
 │ │ ├── tests/            # Tests unitarios de la función (opcionales)
 │ │ └── index.tsx         # Punto de entrada de la función
 │ 
├── hooks/                    # Ganchos reutilizables globales
├── layouts/                  # Componentes de diseño (por ejemplo, DashboardLayout)
├── services/                 # Servicios centralizados (por ejemplo, autenticación, notificaciones)
├── store/                    # Configuración del almacén de Zustand
├── styles/                   # Estilos y temas globales
├── tests/                    # Tests E2E con Playwright (requeridos)
├── types/                    # Tipos e interfaces de TypeScript
├── utils/                    # Funciones de utilidad (por ejemplo, dateUtils, stringUtils)
│ 
├── App.tsx                   # Componente principal de la aplicación
├── main.tsx                  # Punto de entrada de la aplicación
└── vite.config.ts            # Archivo de configuración de Vite

1. **api/:** Esta carpeta contiene toda la lógica relacionada con las llamadas y configuraciones de la API. Puede albergar funciones como fetchUserData, updatePost o configuraciones generales para las solicitudes de la API, como las URL base y los encabezados.
2. **assets/:** La carpeta assets es donde se almacenan los recursos estáticos como imágenes, fuentes e iconos.
3. **components/:** La carpeta componentes contiene todos los componentes de interfaz de usuario compartidos. Las subcarpetas organizan los componentes en:
    1. **atoms/** : Los elementos de interfaz de usuario más pequeños, como botones, campos de entrada y etiquetas, que normalmente no tienen estado y son altamente reutilizables.
    2. **molecules/** : Estos son elementos de interfaz de usuario más complejos que combinan átomos, como un grupo de formularios o una barra de navegación.
    3. **organisms/:** Componentes más grandes y complejos compuestos de moléculas y átomos, como tarjetas, modales o tablas.
    4. **templates/:** Estas definen secciones de página y contenedores de diseño, lo que ayuda a estructurar elementos comunes de la página como encabezados, pies de página y barras laterales.
4. **features/:** La carpeta features es donde se encuentran los módulos basados en características. Cada carpeta corresponde a una característica o funcionalidad específica de la aplicación. Cada carpeta de características contiene:
    1. **components/:** Componentes de interfaz de usuario específicos de la funcionalidad.
    2. **hooks/:** Ganchos reutilizables específicos de la funcionalidad, como useFetchMessages.
    3. **api.ts:** Funciones para gestionar las llamadas a la API de esa funcionalidad, como getMessages o sendMessage.
    4. **tests/:** Pruebas unitarias sobre los diferentes elementos específicos de la funcionalidad.
    5. **index.tsx:** El punto de entrada principal para la función, que exporta sus componentes y ganchos.
5. **hooks/:** Ganchos globales reutilizables como useLocalStorage, useAuth o useFetchData se pueden colocar aquí. Estos ganchos se utilizan en diferentes funciones de la aplicación y abstraen la lógica de negocio común o los efectos secundarios.
6. **layouts/:**  Son componentes que definen la estructura general de la página. Esto puede incluir plantillas para páginas específicas, como DashboardLayout o AuthLayout, lo que garantiza una estructura y un diseño de página consistentes en toda la aplicación.
7. **services/:** Esta carpeta contiene servicios centralizados como autenticación, notificaciones o registro. Por ejemplo, puede tener un servicio para gestionar la autenticación, como authService.ts, que se puede importar y utilizar en diferentes funcionalidades.
8. **store/:** Aquí se encuentra la configuración del store de Zustand, incluido el archivo store.ts.
9. **styles/:** Esta carpeta contiene estilos globales e información de temas. Puede incluir un archivo theme.ts con la paleta de colores, la tipografía, el espaciado y otros aspectos visuales de la aplicación. Los estilos para elementos globales, como el fondo del cuerpo o la fuente, también pueden ir aquí.
10. **tests/**: Esta carpeta registra las pruebas End-To-End (E2E) realizadas a las distintas funcionalidades.
11. **types/:** Los tipos e interfaces de TypeScript se almacenan aquí, lo que ayuda a garantizar la seguridad de tipos en toda la aplicación. Esto puede incluir tipos para componentes, respuestas de API, etc.
12. **utils/:** Aquí se encuentran las funciones de utilidad, como el formato de fechas, la manipulación de cadenas y funciones auxiliares generales. Estas funciones no están vinculadas a ninguna característica específica y pueden utilizarse en toda la aplicación.
13. **App.tsx:** El componente principal de la aplicación que sirve como punto de entrada para la aplicación React. Generalmente contiene proveedores globales como ThemeProvider.
14. **main.tsx:** Este es el punto de entrada para la aplicación React, donde el componente raíz (App.tsx) se renderiza en el DOM.
15. **vite.config.ts:** Archivo de configuración para Vite, la herramienta de compilación utilizada en este ejemplo. Define la configuración y las optimizaciones del proyecto.