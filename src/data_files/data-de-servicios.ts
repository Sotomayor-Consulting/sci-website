/* Datos de LLC*/
export const dataLLC = {
  categoria: "LLC",
  titulo: "Apertura de Empresa en EE.UU.",
  descripcion:
    "Te acompañamos en la creación de tu Limited Liability Company (LLC) en los Estados Unidos y te brindamos todos los servicios posteriores que puedes necesitar. Con nuestro servicio de incorporación, te guiamos a través de cada etapa del proceso. Nuestro equipo de expertos está listo para ofrecerte soluciones a la medida.",

  /* Features */
  titulofeatures: "¿Que puede incluir nuestros planes?",
  descripcionfeatures: "Todo lo que necesitas para lanzar tu empresa en EE.UU.",

  /* Tarjeta Features */

  TarjetasFeatures: [
    {
      icono: "mingcute:document-2-line",
      titulo: "Estructura Legal Completa",
      descripcion: "Documentos fundacionales de tu empresa",
      lista: [
        "Artículos de Organización (documento oficial del estado)",
        "Operating Agreement (reglas internas de funcionamiento)",
      ],
    },
    {
      icono: "mingcute:safe-shield-2-fill",
      titulo: "Identificación Fiscal y Cumplimiento",
      descripcion: "Acompañamiento fiscal",
      lista: [
        "Solicitud del EIN ante el IRS",
        "Solicitud de Exención BE-13 ante el BEA",
        "Necesario para cuentas bancarias y contratos",
      ],
    },
    {
      icono: "mingcute:location-line",
      titulo: "Dirección y Agente Registrado",
      descripcion: "Presencia legal en EE.UU.",
      lista: [
        "Dirección comercial para correspondencia oficial",
        "Agente Registrado incluido el primer año",
        "Renovación anual: $200 USD",
      ],
    },
  ],

  /* Pricing */

  titulopricing: "Elige el plan de asesoría para tu LLC",
  descripcionpricing:
    "Elige el plan de consultoría que mejor se adapta a tu negocio. Los precios corresponden a honorarios profesionales; las tasas oficiales aplicables se cobran por separado.",
  planes: [
    {
      categoria: "normal",
      titulo: "Plan Básico",
      descripcion: "Recibe apoyo documental para solicitar la constitución de tu LLC.",
      precio: "350",
      boton: "Obtén el paquete básico",
      icono: "mingcute:check-fill",
      lista: [
        "Preparación y apoyo para presentar el registro de tu LLC ante el Estado.",
        "Acompañamiento en la solicitud del EIN ante el IRS.",
        "Agente Residente por un año.",
      ],
      link: "https://app.sotomayorconsulting.com/start",
    },
    {
      categoria: "popular",
      titulo: "Plan Business",
      descripcion:
        "Estrategia fiscal y legal completa para tu LLC. Ideal para hacer las cosas bien desde el inicio.",
      precio: "950",
      boton: "Obtén el plan Business",
      icono: "mingcute:star-fill",
      anadido:
        "Los beneficios del Plan Básico y los beneficios del plan estándar, más:",
      lista: [
        "Planificación y diseño legal-tributario.",   
        "Acompañamiento para solicitudes con Mercury o Relay y configuración de Stripe.",
        "Acompañamiento prioritario en la solicitud del EIN ante el IRS.",
      ],
      link: "https://app.sotomayorconsulting.com/start",
    },
    {
      categoria: "normal",
      titulo: "Plan Estándar",
      descripcion: "Incluye soporte legal y documentos clave para operar.",
      precio: "600",
      boton: "Obtén el plan estándar",
      icono: "mingcute:check-fill",
      anadido: "Los beneficios del Plan Básico más:",
      lista: [
        "Elaboración del Acuerdo de Operación.",
        "Consultas ilimitadas por un año.",
        "Solicitud de Exención BE-13",
      ],
      link: "https://app.sotomayorconsulting.com/start",
    },
    {
      categoria: "normal",
      titulo: "Plan Diseño - upgrade",
      descripcion:
        "Planificación estratégica y de diseño de la LLC, ideal para aquellos que quieren ir paso a paso.",
      precio: "350",
      boton: "Obtén el plan diseño/upgrade",
      icono: "mingcute:check-fill",
      lista: ["Planificación y diseño de LLC"],
      link: "https://app.sotomayorconsulting.com/start",
    },
  ],
};
/* Datos de LLC*/

/* Datos de banking*/
export const dataBanking = {
  categoria: "Banking",
  titulo: "Banking y cobros para tu empresa en EE. UU.",
  descripcion:
    "Te orientamos y preparamos la documentación para solicitar servicios financieros y de cobro de terceros. Cada proveedor evalúa y decide la aprobación de forma independiente.",

  /* Features */
  titulofeatures: "¿Que puede incluir nuestros planes?",
  descripcionfeatures: "Todo lo que necesitas para lanzar tu empresa en EE.UU.",

  /* Tarjeta Features */

  TarjetasFeatures: [
    {
      pocision: "left",
      svg: "relay",
      icono: "mingcute:check-circle-fill",
      titulo: "Procesador de pagos con Relay",
      titulo2: "Apoyo de solicitud para Relay",
      descripcion:
        "Relay ofrece servicios financieros empresariales sujetos a sus requisitos. Te apoyamos con la preparación documental y el onboarding; Relay decide la aprobación y los tiempos.",
      precio: "200",
      boton: "Hablar con un asesor",
      lista: [
        "Acceso a las funciones disponibles según el plan aprobado por Relay",
        "Opciones de tarjetas de débito sujetas a elegibilidad",
        "Control de gastos por equipo/departamento",
        "Aprobaciones para transferencias ACH y pagos",
        "Integración con QuickBooks, Gusto y herramientas de nómina",
      ],
      link: "https://wa.link/a2589f",
    },
    {
      pocision: "left",
      svg: "mercury",
      icono: "mingcute:check-circle-fill",
      titulo: "Solicitud de cuenta empresarial con Mercury",
      titulo2: "Apoyo de solicitud para Mercury",
      descripcion:
        "Mercury es una plataforma financiera para empresas. Te orientamos y preparamos la documentación para su proceso de onboarding; Mercury y sus proveedores bancarios deciden la elegibilidad, aprobación y tiempos.",
      precio: "200",
      boton: "Hablar con un asesor",
      lista: [
        "Solicitud de cuenta empresarial en EE. UU.",
        "Sin sucursales físicas, gestión 100% digital",
        "Transferencias ACH y Wire",
        "Integración con Stripe y QuickBooks",
        "Dashboard moderno y fácil de usar",
      ],
      link: "https://wa.link/trimy6",
    },
    {
      pocision: "right",
      svg: "stripe",
      icono: "mingcute:check-circle-fill",
      titulo: "Procesador de pagos con Stripe",
      titulo2: "Apoyo de configuración de Stripe",
      descripcion:
        "Stripe es una plataforma de pagos de terceros. Te apoyamos con la preparación y configuración de la solicitud; Stripe determina la disponibilidad, verificación y activación de la cuenta.",
      precio: "200",
      boton: "Hablar con un asesor",
      lista: [
        "Cobros con tarjetas internacionales",
        "Pagos recurrentes y suscripciones",
        "Facturación automática",
        "Herramientas de gestión y optimización de pagos de Stripe",
        "Integración con sitios web y plataformas digitales",
      ],
      link: "https://wa.link/vq453r",
    },
    
  ],

  /* Pricing */
};

/* Datos de banking */

/* Datos de contabilidad*/

export const dataContabilidad = {
  categoria: "contabilidad",
  titulo: "Contabilidad para tu empresa.",
  descripcion:
    "Apoya el cumplimiento fiscal de tu empresa en Estados Unidos. Nuestro equipo prepara declaraciones según el alcance contratado y te orienta sobre tus obligaciones y opciones tributarias.",

  /* Features */
  titulofeatures: "¿Qué incluye nuestro servicio de contabilidad?",

  /* Tarjeta Features */

  TarjetasFeatures: [
    {
      estado: "active",
      icono: "ant-design:file-protect-outlined",
      titulo: "Declaraciones Fiscales",
      descripcion: "Form 5472, 1120, y reportes estatales requeridos",
      imagen:
        "https://images.unsplash.com/photo-1764231467848-dc20e066cde2?q=80&w=706&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      estado: "inactive",
      icono: "ant-design:folder-open-filled",
      titulo: "Bookkeeping Mensual",
      descripcion: "Registro de transacciones y libros actualizados.",
      imagen:
        "https://images.unsplash.com/photo-1764231467896-73f0ef4438aa?q=80&w=666&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      estado: "inactive",
      icono: "ant-design:schedule-outlined",
      titulo: "Reportes Financieros",
      descripcion: "Análisis trimestral de la salud de tu negocio.",
      imagen:
        "https://images.unsplash.com/photo-1518976024611-28bf4b48222e?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      estado: "inactive",
      icono: "mingcute:safe-shield-2-fill",
      titulo: "Apoyo en comunicaciones con el IRS",
      descripcion: "Te orientamos y apoyamos en respuestas al IRS según el alcance contratado y las autorizaciones aplicables.",
      imagen:
        "https://images.unsplash.com/photo-1567449303183-ae0d6ed1498e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],

  tablapr: [
    {
      descripcion: "Formulario 1120 Informativo",
      cantidad: "1",
      valor: "200,00",
      total: "200,00",
    },
    {
      descripcion: "Formulario 5472",
      cantidad: "1",
      valor: "150,00",
      total: "150,00",
    },
  ],

  tablacondicional: [
    {
      data: "inputsformsa",
      descripcion: "Formulario 1120 Informativo",
      cantidad: "1",
      valor: "200,00",
      total: "200,00",
    },
    {
      data: "inputsformsa",
      descripcion: "Formulario 5472",
      cantidad: "1",
      valor: "150,00",
      total: "150,00",
    },
  ],
};

/* Datos de contabilidad*/

/* Datos de itin*/

export const dataitin = {
  categoria: "itin",
  titulo: "Asesoría para tu ITIN",
  descripcion:
    "Te orientamos, preparamos la documentación y apoyamos la presentación de tu solicitud de ITIN. El IRS decide su emisión y el tiempo de procesamiento; cuando corresponda, revisamos contigo las alternativas para acreditar identidad sin enviar el pasaporte original.",

  /* Features */
  titulofeatures: "¿Qué es el ITIN?",
  descripcionfeatures:
    "El ITIN (Individual Taxpayer Identification Number) es un número emitido por el IRS para personas que no califican para un Social Security Number, pero que necesitan cumplir con obligaciones fiscales en Estados Unidos.",

  /* Tarjeta Features */

  listaitin: [
    "Permite declarar impuestos personales en EE. UU.",
    "Requisito para socios o miembros de LLCs",
    "Facilita el cumplimiento fiscal ante el IRS",
    "Orientación sobre las opciones aceptadas para acreditar identidad",
  ],

  titulopricingitin: "Costo de la asesoría ITIN",
  precioitin: "400",
  tiempoitin: "Plazo",
  tiempoitin2: "Lo define el IRS",
};

/* Datos de itin*/

/* Datos de servicios legales*/

export const dataLegales = {
  categoria: "legales",
  titulo: "Servicios Legales",
  descripcion:
    "Preparamos documentos corporativos privados según las necesidades y el alcance contratado, como Operating Agreement, resoluciones y enmiendas. Los documentos oficiales los emite la autoridad competente.",

  listadelegales: [
    {
      icono: "mingcute:document-2-line",
      titulo: "OPERATING AGREEMENT",
      descripcion:
        "Documento legal fundamental que establece la estructura, reglas de operación y distribución de ganancias de tu LLC.",
      pregunta: "¿Para qué necesito un Operating Agreement?",
      respuesta:
        "Protege tu responsabilidad limitada, define claramente los roles de cada miembro y evita conflictos futuros. Es esencial para el funcionamiento interno y protección legal de tu empresa.",
    },
    {
      icono: "mingcute:file-certificate-line",
      titulo: "W-9",
      descripcion:
        "Formulario del IRS requerido para reportar información fiscal y recibir pagos de clientes estadounidenses.",
      pregunta: "¿Cuándo necesito el formulario W-9?",
      respuesta:
        "Es obligatorio cuando trabajas con clientes estadounidenses o empresas que te pagarán más de $600 al año. Sin este formulario, tus clientes podrían retener el 30% de tus pagos.",
    },
    {
      icono: "mingcute:shield-shape-line",
      titulo: "BE-13 (CLAIM FOR EXEMPTION)",
      descripcion:
        "Solicitud de exención ante la Oficina de Análisis Económico (BEA) de EE. UU. que permite a inversiones extranjeras calificadas no presentar el reporte completo del BE-12, evitando cargas administrativas innecesarias.",
      pregunta: "¿Qué pasa si no presento la Solicitud de Exención BE-13?",
      respuesta:
        "No presentar la BE-13 cuando es requerida puede generar multas de hasta $4,603 por infracción (ajustadas por inflación), además de sanciones civiles y la obligación de presentar reportes completos retroactivos. El BEA exige este formulario para inversiones extranjeras directas calificadas.",
    },
    {
      icono: "mingcute:seal-line",
      titulo: "APOSTILLAMIENTO",
      descripcion:
        "Te orientamos y apoyamos en la preparación y presentación de la solicitud de Apostilla de La Haya ante la autoridad competente, que decide su emisión y plazo.",
      pregunta: "¿Qué documentos necesito apostillar?",
      respuesta:
        "Usualmente se requiere para Operating Agreement, certificados de buena standing y documentos de constitución cuando necesitas abrir cuentas bancarias o realizar trámites fuera de Estados Unidos.",
    },
    {
      icono: "mingcute:building-2-line",
      titulo: "DBA (DOING BUSINESS AS)",
      descripcion:
        "Te ayudamos a preparar y presentar la solicitud de registro de un nombre comercial; la autoridad competente decide su aceptación.",
      pregunta: "¿Cuándo debo registrar un DBA?",
      respuesta:
        "Cuando quieres operar bajo un nombre diferente al legal de tu LLC, necesitas abrir una cuenta bancaria con el nombre comercial o estás creando una línea de productos con marca propia.",
    },
    {
      icono: "mingcute:paper-line",
      titulo: "RESELLER CERTIFICATE",
      descripcion:
        "Te orientamos en la preparación de la solicitud del certificado aplicable a compras para reventa; la autoridad fiscal decide su emisión y alcance.",
      pregunta: "¿Cuánto puedo ahorrar con el Reseller Certificate?",
      respuesta:
        "Puedes evitar pagar el sales tax en tus compras de inventario, lo que representa un ahorro promedio del 6-10% en cada compra. Es esencial para negocios de reventa o dropshipping.",
    },
    {
      icono: "mingcute:file-star-line",
      titulo: "D-U-N-S NUMBER",
      descripcion:
        "Identificador empresarial emitido por Dun & Bradstreet, necesario para construir historial crediticio y acceder a financiamiento y contratos corporativos.",
      pregunta: "¿Por qué necesito un número D-U-N-S?",
      respuesta:
        "Es obligatorio para trabajar con grandes corporaciones, acceder a programas de Apple Developer, vender al gobierno federal y construir tu historial crediticio empresarial en EE.UU.",
    },
    {
      icono: "mingcute:laurel-wreath-line",
      titulo: "CERTIFICATE OF GOOD STANDING",
      descripcion:
        "Te acompañamos en la solicitud del Certificate of Good Standing, que emite el Estado. Confirma que la empresa está activa, al día con sus obligaciones y autorizada para operar legalmente.",
      pregunta: "¿Cuándo me piden el Certificate of Good Standing?",
      respuesta:
        "Generalmente lo solicitan bancos para abrir cuentas, clientes corporativos para contratos, y cuando necesitas apostillar documentos o hacer negocios con el gobierno.",
    },
  ],
};

/* Datos de servicios legales*/

/* Datos de desarrollo web*/
import imagenweb1 from "src/images/imagen-web-1.png";
import imagenweb2 from "src/images/imagen-web-2.png";
import imagenweb3 from "src/images/imagen-web-3.png";
import imagenweb4 from "src/images/imagen-web-4.png";
export const dataWeb = {
  categoria: "paginas-web",
  titulo: "Desarrollo Web",
  descripcion:
    "Sitios web profesionales, modernos y optimizados para convertir visitantes en clientes.",

  features: [
    {
      estado: "activo",
      icono: "mingcute:device-line",
      titulo: "Diseño 100% Responsive",
      descripcion:
        "Visualización perfecta en móviles, tabletas y computadoras.",
      image: imagenweb1,
    },
    {
      estado: "inactivo",
      icono: "mingcute:code-line",
      titulo: "Optimización SEO Básica",
      descripcion:
        "Meta tags, estructura de títulos y velocidad de carga optimizada.",
      image: imagenweb2,
    },
    {
      estado: "inactivo",
      icono: "mingcute:web-fill",
      titulo: "Estructura Corporativa",
      descripcion: "Home, Servicios, Acerca de, Contacto y Políticas.",
      image: imagenweb3,
    },
    {
      estado: "inactivo",
      icono: "mingcute:earth-2-line",
      titulo: "Hosting y Dominio",
      descripcion: "Gestión completa del primer año de alojamiento y dominio.",
      image: imagenweb4,
    },
  ],

  preciostitulo: "Desarrollo de pagina web",
  preciossubtitulo: "Una única inversion",
  precio: "350",
  link: "https://wa.link/0k0sf6",

  listamini: [
    {
      icono: "mingcute:refresh-2-fill",
      titulo: "Costo Recurrente",
      descripcion: "Dominio y Hosting: $85 USD / año",
    },
    {
      icono: "mingcute:time-line",
      titulo: "Tiempo estimado",
      descripcion: "2 semanas",
    },
  ],
};

/* Datos de desarrollo web*/

/* Datos de Partner de odoo*/
import videoOdoo1 from "src/images/video_homepage.webm";
import imagen2 from "@images/Captura de pantalla 2026-02-11 124947.png";
import imagen3 from "@images/capacitacionOdoo.webp";
import imagen4 from "@images/imagenodoo.gif";
export const dataOdoo = {
  categoria: "partner-odoo",
  titulo: "Software empresarial",
  descripcion: "Gestiona todo tu negocio desde un solo software",

  features: [
    {
      estado: "activo",
      icono: "mingcute:classify-2-line",
      titulo: "Aplicaciones empresariales",
      descripcion:
        "Cada aplicación simplifica un proceso y empodera a más personas.",
      image: videoOdoo1,
      tipo: "video",
    },
    {
      estado: "inactivo",
      icono: "mingcute:brush-3-line",
      titulo: "Personalización sin límites",
      descripcion:
        "Aplicaciones adicionales con buena infraestructura y servicios profesionales.",
      image: imagen2,
      tipo: "imagen",
      features2: [
        {
          titulo: "Personalizacion orientada a lo que necesitas",
          descripcion:
            "Usamos la aplicación Studio de Odoo para automatizar acciones, personalizar pantallas y elaborar tus propios reportes y webhooks.",
          lista: [
            "Configuracion basica para el modelo de negocio",
            "Personalizacion de pantallas y vistas",
            "Configuracion y concexion con otras plataformas",
          ],
        },
      ],
    },
    {
      estado: "inactivo",
      icono: "mingcute:mind-map-line",
      titulo: "Asesoría en implementación",
      descripcion:
        "Analizamos tus necesidades, tu modelo de negocio y definimos la hoja de ruta.",
      image: imagen3,
      tipo: "imagen",
      features2: [
        {
          titulo: "Asesoría en implementación y uso",
          descripcion:
            "Te acompañamos durante todo el proceso de adopción de Odoo. Analizamos tus necesidades, definimos la hoja de ruta y te guiamos con buenas prácticas para maximizar la escalabilidad.",
          lista: [
            "Análisis de procesos y diagnóstico",
            "Plan de implementación personalizado",
            "Recomendaciones de buenas prácticas",
            "Acompañamiento post-implementación",
          ],
        },
      ],
    },
    {
      estado: "inactivo",
      icono: "mingcute:earth-2-line",
      titulo: "Capacitación",
      descripcion: "Capacitacion del uso de Odoo para tu equipo",
      image: imagen4,
      tipo: "imagen",
      features2: [
        {
          titulo: "Capacitación para equipos especializados",
          descripcion:
            "Formamos a tu personal para que dominen Odoo y lo integren eficazmente en el día a día. Diseñamos talleres a medida según el perfil de cada equipo.",
          lista: [
            "Talleres prácticos in-company",
            "Material didáctico y guías de uso",
            "Capacitación en módulos específicos",
          ],
        },
      ],
    },
  ],

  tituloForm: "Agenda una cita con nosotros",
  descripcionForm:
    "Descubre cómo transformar Odoo en el motor digital de tu negocio. Te guiamos paso a paso para que aproveches al máximo cada módulo sin complicaciones.",
  preguntaForm: "¿Cómo te ayudamos?",
  listaForm: [
    "Personalizamos Odoo a tu medida.",
    "Diseñamos la ruta de implementación ideal según tu modelo de negocio",
    "Capacitamos a tu equipo para que usen Odoo con confianza y autonomía",
  ],
};

/* Datos de Partner de odoo*/
