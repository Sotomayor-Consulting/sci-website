/* LLC Data */
export const dataLLC = {
  categoria: "LLC",
  titulo: "Company Formation in the U.S.",
  descripcion:
    "We support you in the creation of your Limited Liability Company (LLC) in the United States and provide all the ongoing services you may need. With our incorporation service, we guide you through every stage of the process. Our team of experts is ready to offer tailored solutions.",

  /* Features */
  titulofeatures: "What can our plans include?",
  descripcionfeatures: "Everything you need to launch your company in the U.S.",

  /* Features Cards */

  TarjetasFeatures: [
    {
      icono: "mingcute:document-2-line",
      titulo: "Complete Legal Structure",
      descripcion: "Foundational documents for your company",
      lista: [
        "Articles of Organization (official state document)",
        "Operating Agreement (internal operating rules)",
      ],
    },
    {
      icono: "mingcute:safe-shield-2-fill",
      titulo: "Tax Identification and Compliance",
      descripcion: "Tax support",
      lista: [
        "EIN application before the IRS",
        "BE-13 Exemption Request before the BEA",
        "Required for bank accounts and contracts",
      ],
    },
    {
      icono: "mingcute:location-line",
      titulo: "Address and Registered Agent",
      descripcion: "Legal presence in the U.S.",
      lista: [
        "Business address for official correspondence",
        "Registered Agent included for the first year",
        "Annual renewal: $200 USD",
      ],
    },
  ],

  /* Pricing */

  titulopricing: "Choose the advisory plan for your LLC",
  descripcionpricing:
    "Choose the plan that best fits your business and start operating in the U.S. with legal and tax support.",
  planes: [
    {
      categoria: "normal",
      titulo: "Basic Plan",
      descripcion: "Form your LLC with the essentials to operate legally.",
      precio: "350",
      boton: "Get the basic package",
      icono: "mingcute:check-fill",
      lista: [
        "Management of your LLC registration with the State.",
        "Support with the EIN application before the IRS.",
        "Registered Agent for one year.",
      ],
      link: "https://app.sotomayorconsulting.com/start",
    },
    {
      categoria: "popular",
      titulo: "Business Plan",
      descripcion:
        "Complete tax and legal strategy for your LLC. Ideal for doing things right from the start.",
      precio: "950",
      boton: "Get the Business Plan",
      icono: "mingcute:star-fill",
      anadido:
        "The benefits of the Basic Plan and the benefits of the Standard Plan, plus:",
      lista: [
        "Legal and tax planning and design.",
        "Banking support (Mercury or Relay + Stripe).",
        "Priority support with the EIN application before the IRS.",
      ],
      link: "https://app.sotomayorconsulting.com/start",
    },
    {
      categoria: "normal",
      titulo: "Standard Plan",
      descripcion: "Includes legal support and key documents to operate.",
      precio: "600",
      boton: "Get the standard plan",
      icono: "mingcute:check-fill",
      anadido: "The benefits of the Basic Plan plus:",
      lista: [
        "Preparation of the Operating Agreement.",
        "Unlimited consultations for one year.",
        "BE-13 Exemption Request",
      ],
      link: "https://app.sotomayorconsulting.com/start",
    },
    {
      categoria: "normal",
      titulo: "Design Plan - upgrade",
      descripcion:
        "Strategic planning and LLC design, ideal for those who want to go step by step.",
      precio: "350",
      boton: "Get the design/upgrade plan",
      icono: "mingcute:check-fill",
      lista: ["LLC planning and design"],
      link: "https://app.sotomayorconsulting.com/start",
    },
  ],
};
/* LLC Data */

/* Banking Data */
export const dataBanking = {
  categoria: "Banking",
  titulo: "Banking and payments for your company in the U.S.",
  descripcion:
    "Connect your company to the world's most solid financial infrastructure and charge global clients securely and efficiently.",

  /* Features */
  titulofeatures: "What can our plans include?",
  descripcionfeatures: "Everything you need to launch your company in the U.S.",

  /* Features Cards */

  TarjetasFeatures: [
    {
      pocision: "left",
      svg: "relay",
      icono: "mingcute:check-circle-fill",
      titulo: "Payment processor with Relay",
      titulo2: "Relay Activation",
      descripcion:
        "Relay is a payment platform that allows your company to charge clients anywhere in the world by credit and debit card quickly, securely, and professionally.",
      precio: "200",
      boton: "Talk to an advisor",
      lista: [
        "Up to 20 separate checking accounts on one platform",
        "Individual debit cards for each account",
        "Expense control by team/department",
        "Approvals for ACH transfers and payments",
        "Integration with QuickBooks, Gusto, and payroll tools",
      ],
      link: "https://wa.link/a2589f",
    },
    {
      pocision: "left",
      svg: "mercury",
      icono: "mingcute:check-circle-fill",
      titulo: "Business bank account at Mercury Bank",
      titulo2: "Mercury Account Opening",
      descripcion:
        "Mercury is a digital banking platform designed for modern companies. It lets you manage your money in the U.S. 100% online, securely, and without friction, ideal for international and non-resident companies.",
      precio: "200",
      boton: "Talk to an advisor",
      lista: [
        "U.S. bank account in your company's name",
        "No physical branches, 100% digital management",
        "ACH and Wire transfers",
        "Integration with Stripe and QuickBooks",
        "Modern and easy-to-use dashboard",
      ],
      link: "https://wa.link/trimy6",
    },
    {
      pocision: "right",
      svg: "stripe",
      icono: "mingcute:check-circle-fill",
      titulo: "Payment processor with Stripe",
      titulo2: "Stripe Activation",
      descripcion:
        "Stripe is one of the most widely used payment platforms in the world. It allows your company to charge clients anywhere in the world by credit and debit card quickly, securely, and professionally.",
      precio: "200",
      boton: "Talk to an advisor",
      lista: [
        "Charges with international cards",
        "Recurring payments and subscriptions",
        "Automatic invoicing",
        "High payment approval rate",
        "Integration with websites and digital platforms",
      ],
      link: "https://wa.link/vq453r",
    },
    
  ],

  /* Pricing */
};

/* Banking Data */

/* Accounting Data */

export const dataContabilidad = {
  categoria: "contabilidad",
  titulo: "Accounting for your company.",
  descripcion:
    "Keep your company compliant with U.S. tax regulations. Our specialized accountants prepare your returns and advise you on tax optimization strategies.",

  /* Features */
  titulofeatures: "What does our accounting service include?",

  /* Features Cards */

  TarjetasFeatures: [
    {
      estado: "active",
      icono: "ant-design:file-protect-outlined",
      titulo: "Tax Returns",
      descripcion: "Form 5472, 1120, and required state reports",
      imagen:
        "https://images.unsplash.com/photo-1764231467848-dc20e066cde2?q=80&w=706&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      estado: "inactive",
      icono: "ant-design:folder-open-filled",
      titulo: "Monthly Bookkeeping",
      descripcion: "Transaction recording and up-to-date books.",
      imagen:
        "https://images.unsplash.com/photo-1764231467896-73f0ef4438aa?q=80&w=666&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      estado: "inactive",
      icono: "ant-design:schedule-outlined",
      titulo: "Financial Reports",
      descripcion: "Quarterly analysis of your business's health.",
      imagen:
        "https://images.unsplash.com/photo-1518976024611-28bf4b48222e?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      estado: "inactive",
      icono: "mingcute:safe-shield-2-fill",
      titulo: "IRS Representation",
      descripcion: "We represent you before the IRS if necessary.",
      imagen:
        "https://images.unsplash.com/photo-1567449303183-ae0d6ed1498e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],

  tablapr: [
    {
      descripcion: "Informative Form 1120",
      cantidad: "1",
      valor: "200,00",
      total: "200,00",
    },
    {
      descripcion: "Form 5472",
      cantidad: "1",
      valor: "150,00",
      total: "150,00",
    },
  ],

  tablacondicional: [
    {
      data: "inputsformsa",
      descripcion: "Informative Form 1120",
      cantidad: "1",
      valor: "200,00",
      total: "200,00",
    },
    {
      data: "inputsformsa",
      descripcion: "Form 5472",
      cantidad: "1",
      valor: "150,00",
      total: "150,00",
    },
  ],
};

/* Accounting Data */

/* ITIN Data */

export const dataitin = {
  categoria: "itin",
  titulo: "Advisory for your ITIN",
  descripcion:
    "We support you in your ITIN application before the IRS, which is the agency that issues it, without sending physical documents. The deadline is set by the IRS.",

  /* Features */
  titulofeatures: "What is the ITIN?",
  descripcionfeatures:
    "The ITIN (Individual Taxpayer Identification Number) is a number issued by the IRS for people who do not qualify for a Social Security Number but need to meet tax obligations in the United States.",

  /* Features Cards */

  listaitin: [
    "Allows you to file personal taxes in the U.S.",
    "Requirement for partners or members of LLCs",
    "Facilitates tax compliance before the IRS",
    "Guided process without sending a physical passport",
  ],

  titulopricingitin: "Cost of the ITIN advisory",
  precioitin: "400",
  tiempoitin: "Deadline",
  tiempoitin2: "Set by the IRS",
};

/* ITIN Data */

/* Legal Services Data */

export const dataLegales = {
  categoria: "legales",
  titulo: "Legal Services",
  descripcion:
    "We prepare all the legal documents your company needs to operate correctly in the United States. Operating Agreement, corporate resolutions, amendments, and more.",

  listadelegales: [
    {
      icono: "mingcute:document-2-line",
      titulo: "OPERATING AGREEMENT",
      descripcion:
        "Fundamental legal document that establishes the structure, operating rules, and profit distribution of your LLC.",
      pregunta: "Why do I need an Operating Agreement?",
      respuesta:
        "It protects your limited liability, clearly defines each member's roles, and prevents future conflicts. It is essential for the internal operation and legal protection of your company.",
    },
    {
      icono: "mingcute:file-certificate-line",
      titulo: "W-9",
      descripcion:
        "IRS form required to report tax information and receive payments from U.S. clients.",
      pregunta: "When do I need Form W-9?",
      respuesta:
        "It is mandatory when you work with U.S. clients or companies that will pay you more than $600 per year. Without this form, your clients could withhold 30% of your payments.",
    },
    {
      icono: "mingcute:shield-shape-line",
      titulo: "BE-13 (CLAIM FOR EXEMPTION)",
      descripcion:
        "Exemption request before the U.S. Bureau of Economic Analysis (BEA) that allows qualifying foreign investments not to file the full BE-12 report, avoiding unnecessary administrative burdens.",
      pregunta: "What happens if I don't file the BE-13 Exemption Request?",
      respuesta:
        "Not filing the BE-13 when required can generate fines of up to $4,603 per violation (adjusted for inflation), in addition to civil penalties and the obligation to file complete retroactive reports. The BEA requires this form for qualifying direct foreign investments.",
    },
    {
      icono: "mingcute:seal-line",
      titulo: "APOSTILLE",
      descripcion:
        "Legalization of documents for international use through the Hague Apostille, valid in more than 100 countries.",
      pregunta: "What documents do I need to apostille?",
      respuesta:
        "It is usually required for the Operating Agreement, certificates of good standing, and incorporation documents when you need to open bank accounts or carry out procedures outside the United States.",
    },
    {
      icono: "mingcute:building-2-line",
      titulo: "DBA (DOING BUSINESS AS)",
      descripcion:
        "Trade name registration that allows your company to operate under a name different from the registered legal name.",
      pregunta: "When should I register a DBA?",
      respuesta:
        "When you want to operate under a name different from your LLC's legal name, you need to open a bank account with the trade name, or you are creating a product line with its own brand.",
    },
    {
      icono: "mingcute:paper-line",
      titulo: "RESELLER CERTIFICATE",
      descripcion:
        "Tax exemption certificate for wholesale purchases intended for commercial resale.",
      pregunta: "How much can I save with the Reseller Certificate?",
      respuesta:
        "You can avoid paying sales tax on your inventory purchases, which represents an average savings of 6-10% on each purchase. It is essential for resale or dropshipping businesses.",
    },
    {
      icono: "mingcute:file-star-line",
      titulo: "D-U-N-S NUMBER",
      descripcion:
        "Business identifier issued by Dun & Bradstreet, necessary to build credit history and access financing and corporate contracts.",
      pregunta: "Why do I need a D-U-N-S number?",
      respuesta:
        "It is mandatory to work with large corporations, access Apple Developer programs, sell to the federal government, and build your business credit history in the U.S.",
    },
    {
      icono: "mingcute:laurel-wreath-line",
      titulo: "CERTIFICATE OF GOOD STANDING",
      descripcion:
        "We support you in requesting the Certificate of Good Standing, which is issued by the State. It confirms that the company is active, up to date with its obligations, and authorized to operate legally.",
      pregunta: "When am I asked for the Certificate of Good Standing?",
      respuesta:
        "It is generally requested by banks to open accounts, by corporate clients for contracts, and when you need to apostille documents or do business with the government.",
    },
  ],
};

/* Legal Services Data */

/* Web Development Data */
import imagenweb1 from "src/images/imagen-web-1.png";
import imagenweb2 from "src/images/imagen-web-2.png";
import imagenweb3 from "src/images/imagen-web-3.png";
import imagenweb4 from "src/images/imagen-web-4.png";
export const dataWeb = {
  categoria: "paginas-web",
  titulo: "Web Development",
  descripcion:
    "Professional, modern websites optimized to turn visitors into customers.",

  features: [
    {
      estado: "activo",
      icono: "mingcute:device-line",
      titulo: "100% Responsive Design",
      descripcion:
        "Perfect display on mobile phones, tablets, and computers.",
      image: imagenweb1,
    },
    {
      estado: "inactivo",
      icono: "mingcute:code-line",
      titulo: "Basic SEO Optimization",
      descripcion:
        "Meta tags, heading structure, and optimized loading speed.",
      image: imagenweb2,
    },
    {
      estado: "inactivo",
      icono: "mingcute:web-fill",
      titulo: "Corporate Structure",
      descripcion: "Home, Services, About, Contact, and Policies.",
      image: imagenweb3,
    },
    {
      estado: "inactivo",
      icono: "mingcute:earth-2-line",
      titulo: "Hosting and Domain",
      descripcion: "Complete management of the first year of hosting and domain.",
      image: imagenweb4,
    },
  ],

  preciostitulo: "Website development",
  preciossubtitulo: "A one-time investment",
  precio: "350",
  link: "https://wa.link/0k0sf6",

  listamini: [
    {
      icono: "mingcute:refresh-2-fill",
      titulo: "Recurring Cost",
      descripcion: "Domain and Hosting: $85 USD / year",
    },
    {
      icono: "mingcute:time-line",
      titulo: "Estimated time",
      descripcion: "2 weeks",
    },
  ],
};

/* Web Development Data */

/* Odoo Partner Data */
import videoOdoo1 from "src/images/video_homepage.webm";
import imagen2 from "@images/Captura de pantalla 2026-02-11 124947.png";
import imagen3 from "@images/capacitacionOdoo.webp";
import imagen4 from "@images/imagenodoo.gif";
export const dataOdoo = {
  categoria: "partner-odoo",
  titulo: "Business software",
  descripcion: "Manage your entire business from a single software",

  features: [
    {
      estado: "activo",
      icono: "mingcute:classify-2-line",
      titulo: "Business applications",
      descripcion:
        "Each application simplifies a process and empowers more people.",
      image: videoOdoo1,
      tipo: "video",
    },
    {
      estado: "inactivo",
      icono: "mingcute:brush-3-line",
      titulo: "Limitless customization",
      descripcion:
        "Additional applications with solid infrastructure and professional services.",
      image: imagen2,
      tipo: "imagen",
      features2: [
        {
          titulo: "Customization oriented to what you need",
          descripcion:
            "We use Odoo's Studio app to automate actions, customize screens, and build your own reports and webhooks.",
          lista: [
            "Basic configuration for the business model",
            "Customization of screens and views",
            "Configuration and connection with other platforms",
          ],
        },
      ],
    },
    {
      estado: "inactivo",
      icono: "mingcute:mind-map-line",
      titulo: "Implementation advisory",
      descripcion:
        "We analyze your needs and your business model and define the roadmap.",
      image: imagen3,
      tipo: "imagen",
      features2: [
        {
          titulo: "Advisory on implementation and use",
          descripcion:
            "We support you throughout the entire Odoo adoption process. We analyze your needs, define the roadmap, and guide you with best practices to maximize scalability.",
          lista: [
            "Process analysis and diagnosis",
            "Customized implementation plan",
            "Best practice recommendations",
            "Post-implementation support",
          ],
        },
      ],
    },
    {
      estado: "inactivo",
      icono: "mingcute:earth-2-line",
      titulo: "Training",
      descripcion: "Odoo usage training for your team",
      image: imagen4,
      tipo: "imagen",
      features2: [
        {
          titulo: "Training for specialized teams",
          descripcion:
            "We train your staff to master Odoo and integrate it effectively into daily work. We design tailored workshops according to each team's profile.",
          lista: [
            "Practical in-company workshops",
            "Teaching materials and usage guides",
            "Training on specific modules",
          ],
        },
      ],
    },
  ],

  tituloForm: "Schedule an appointment with us",
  descripcionForm:
    "Discover how to transform Odoo into the digital engine of your business. We guide you step by step so you can make the most of every module without complications.",
  preguntaForm: "How can we help you?",
  listaForm: [
    "We customize Odoo to your needs.",
    "We design the ideal implementation roadmap according to your business model",
    "We train your team so they use Odoo with confidence and autonomy",
  ],
};

/* Odoo Partner Data */