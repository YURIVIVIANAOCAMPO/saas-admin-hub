# ⚡ AuraSaaS Admin Hub

<div align="center">

![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
[![CI Pipeline](https://github.com/YURIVIVIANAOCAMPO/saas-admin-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/YURIVIVIANAOCAMPO/saas-admin-hub/actions)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

<p align="center">
  <strong>Panel de control administrativo moderno, intuitivo y de alto rendimiento para plataformas SaaS.</strong>
  <br />
  Diseñado para la gestión ágil de ingresos recurrentes (MRR), cohortes de usuarios, facturación y claves de API.
</p>

[Ver Demo en Vivo](#) • [Características](#-características-principales) • [Estructura](#-arquitectura-del-proyecto) • [Instalación](#-instalación-rápida)

</div>

---

## 🚀 Vista General

**AuraSaaS Admin Hub** es una solución de panel administrativo diseñada bajo principios de arquitectura limpia y diseño de experiencia de usuario de primer nivel. Permite a fundadores y equipos de operaciones monitorizar en tiempo real el ciclo de vida de los clientes, las conversiones de prueba y los cobros recurrentes sin sobreingeniería.

### ✨ Características Principales

- **📊 Dashboard Financiero & KPIs en Tiempo Real:**
  - Seguimiento instantáneo de **MRR**, volumen de clientes activos, tasa de cancelación (**Churn**) y tasa de conversión de trials.
  - Gráfico interactivo SVG de evolución de ingresos recurrentes (mensual y anual) con tooltips dinámicos sin librerías pesadas.
  - Desglose porcentual por niveles de contrato (*Starter, Pro, Enterprise*).

- **👥 Gestión Centralizada de Suscriptores:**
  - Tabla de datos con búsqueda global y filtros por estado (*Activos, En Prueba, Mora, Cancelados*) y por tipo de plan.
  - Modal reactivo para registrar nuevos suscriptores con cálculo automático de MRR.
  - Menú de acciones contextuales: cambio de estado en un clic y eliminación segura.

- **💳 Facturación & Pasarela de Pagos:**
  - Monitoreo del estado del gateway (**Stripe Connect**) y alertas de cobros fallidos.
  - Historial de comprobantes con estados (*Pagada, Pendiente, Fallida*) y simulación de descarga en PDF.

- **🔑 Seguridad & Gestión de API Keys:**
  - Generador de tokens de API criptográficamente seguros para integraciones externas.
  - Copiado automático al portapapeles con notificaciones tipo *Toast*.
  - Simulador de webhooks HTTP para pruebas de integración continua.

- **🌓 Soporte Nativo de Temas (Dark / Light Mode):**
  - Sistema de tokens de diseño con persistencia automática en `localStorage`.
  - Transiciones suaves y soporte completo para dispositivos móviles y tablets.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| **Frontend Framework** | **React 19** + **TypeScript** | Interfaz declarativa, tipado estricto y renderizado eficiente. |
| **Build Tooling** | **Vite** | Arranque instantáneo y compilación de producción optimizada. |
| **Iconografía** | **Lucide Icons** | Iconos vectoriales consistentes y modernos. |
| **Estilos & Diseño** | **CSS3 Moderno & CSS Variables** | Tokens de diseño modulares, modo oscuro y cero dependencias CSS hinchadas. |
| **CI/CD** | **GitHub Actions** | Validación automática de tipos (`tsc`) y compilación en cada `push`. |

---

## 📂 Arquitectura del Proyecto

```text
saas-admin-hub/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline de integración continua (CI)
├── src/
│   ├── components/             # Componentes modulares y reutilizables
│   │   ├── BillingView.tsx     # Historial de cobros y facturación
│   │   ├── CustomersView.tsx   # Directorio de suscriptores y modal
│   │   ├── Header.tsx          # Barra superior, búsqueda y notificaciones
│   │   ├── OverviewView.tsx    # Dashboard ejecutivo y gráfico de ingresos
│   │   ├── SettingsView.tsx    # Ajustes generales, API keys y webhooks
│   │   ├── Sidebar.tsx         # Menú de navegación colapsable
│   │   └── Toast.tsx           # Sistema de feedback visual flotante
│   ├── context/
│   │   └── ThemeContext.tsx    # Contexto global para modo claro / oscuro
│   ├── data/
│   │   └── mockData.ts         # Dataset inicial con métricas realistas
│   ├── types/
│   │   └── index.ts            # Definiciones de tipos TypeScript
│   ├── App.css                 # Sistema de diseño, tokens y componentes
│   ├── App.tsx                 # Enrutamiento de estado principal
│   ├── index.css               # Variables CSS y reset tipográfico
│   └── main.tsx                # Punto de entrada de la aplicación
├── .env.example                # Plantilla de variables de entorno
├── index.html                  # HTML5 semántico con meta tags y SEO
├── package.json                # Dependencias y scripts de ejecución
└── tsconfig.json               # Configuración estricta de TypeScript
```

---

## ⚡ Instalación Rápida

Sigue estos sencillos pasos para ejecutar el proyecto en tu entorno local:

```bash
# 1. Clonar el repositorio
git clone https://github.com/YURIVIVIANAOCAMPO/saas-admin-hub.git

# 2. Entrar a la carpeta del proyecto
cd saas-admin-hub

# 3. Instalar dependencias
npm install --legacy-peer-deps

# 4. Iniciar el servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173` para interactuar con la aplicación.

### 📦 Compilación para Producción

Para compilar el proyecto optimizado para desplegar en plataformas como **Vercel**, **Netlify** o **Cloudflare Pages**:

```bash
npm run build
```

---

## 👩‍💻 Autora

Desarrollado con dedicación por **Viviana Ocampo**  
- GitHub: [@YURIVIVIANAOCAMPO](https://github.com/YURIVIVIANAOCAMPO)  
- Contacto: [darataz0402@gmail.com](mailto:darataz0402@gmail.com)

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.
