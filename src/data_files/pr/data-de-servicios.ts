/* Datos de LLC */
export const dataLLC = {
  categoria: "LLC",
  titulo: "Abertura de Empresa nos EUA.",
  descripcion:
    "Acompanhamos você na criação da sua Limited Liability Company (LLC) nos Estados Unidos e oferecemos todos os serviços posteriores que você possa precisar. Com nosso serviço de incorporação, orientamos você em cada etapa do processo. Nossa equipe de especialistas está pronta para oferecer soluções sob medida.",

  /* Features */
  titulofeatures: "O que nossos planos podem incluir?",
  descripcionfeatures: "Tudo o que você precisa para lançar sua empresa nos EUA.",

  /* Tarjeta Features */

  TarjetasFeatures: [
    {
      icono: "mingcute:document-2-line",
      titulo: "Estrutura Legal Completa",
      descripcion: "Documentos fundacionais da sua empresa",
      lista: [
        "Articles of Organization (documento oficial do estado)",
        "Operating Agreement (regras internas de funcionamento)",
      ],
    },
    {
      icono: "mingcute:safe-shield-2-fill",
      titulo: "Identificação Fiscal e Conformidade",
      descripcion: "Acompanhamento fiscal",
      lista: [
        "Solicitação do EIN junto ao IRS",
        "Solicitação de Isenção BE-13 junto ao BEA",
        "Necessário para contas bancárias e contratos",
      ],
    },
    {
      icono: "mingcute:location-line",
      titulo: "Endereço e Agente Registrado",
      descripcion: "Presença legal nos EUA.",
      lista: [
        "Endereço comercial para correspondência oficial",
        "Agente Registrado incluído no primeiro ano",
        "Renovação anual: $200 USD",
      ],
    },
  ],

  /* Pricing */

  titulopricing: "Escolha o plano de assessoria para sua LLC",
  descripcionpricing:
    "Escolha o plano de consultoria que melhor se adapta ao seu negócio. Os preços correspondem a honorários profissionais; as taxas oficiais aplicáveis são cobradas separadamente.",
  planes: [
    {
      categoria: "normal",
      titulo: "Plano Básico",
      descripcion: "Receba apoio documental para solicitar a constituição da sua LLC.",
      precio: "350",
      boton: "Obtenha o pacote básico",
      icono: "mingcute:check-fill",
      lista: [
        "Preparação e apoio para apresentar o registro da sua LLC ao Estado.",
        "Acompanhamento na solicitação do EIN junto ao IRS.",
        "Agente Registrado por um ano.",
      ],
      link: "https://app.sotomayorconsulting.com/start",
    },
    {
      categoria: "popular",
      titulo: "Plano Business",
      descripcion:
        "Estratégia tributária e jurídica completa para sua LLC. Ideal para fazer as coisas certas desde o início.",
      precio: "950",
      boton: "Obtenha o plano Business",
      icono: "mingcute:star-fill",
      anadido:
        "Os benefícios do Plano Básico e os benefícios do Plano Padrão, mais:",
      lista: [
        "Planejamento e design legal-tributário.",
        "Apoio para solicitações à Mercury ou Relay e configuração do Stripe.",
        "Acompanhamento prioritário na solicitação do EIN junto ao IRS.",
      ],
      link: "https://app.sotomayorconsulting.com/start",
    },
    {
      categoria: "normal",
      titulo: "Plano Padrão",
      descripcion: "Inclui suporte jurídico e documentos essenciais para operar.",
      precio: "600",
      boton: "Obtenha o plano padrão",
      icono: "mingcute:check-fill",
      anadido: "Os benefícios do Plano Básico mais:",
      lista: [
        "Elaboração do Acordo de Operação.",
        "Consultas ilimitadas por um ano.",
        "Solicitação de Isenção BE-13",
      ],
      link: "https://app.sotomayorconsulting.com/start",
    },
    {
      categoria: "normal",
      titulo: "Plano Design - upgrade",
      descripcion:
        "Planejamento estratégico e design da LLC, ideal para quem quer ir passo a passo.",
      precio: "350",
      boton: "Obtenha o plano design/upgrade",
      icono: "mingcute:check-fill",
      lista: ["Planejamento e design de LLC"],
      link: "https://app.sotomayorconsulting.com/start",
    },
  ],
};
/* Datos de LLC */

/* Datos de banking */
export const dataBanking = {
  categoria: "Banking",
  titulo: "Banking e cobranças para sua empresa nos EUA.",
  descripcion:
    "Oferecemos orientação e preparação documental para solicitações a provedores financeiros e de pagamentos terceiros. Cada provedor avalia e decide a aprovação de forma independente.",

  /* Features */
  titulofeatures: "O que nossos planos podem incluir?",
  descripcionfeatures: "Tudo o que você precisa para lançar sua empresa nos EUA.",

  /* Tarjeta Features */

  TarjetasFeatures: [
    {
      pocision: "left",
      svg: "relay",
      icono: "mingcute:check-circle-fill",
      titulo: "Processador de pagamentos com Relay",
      titulo2: "Apoio para solicitação ao Relay",
      descripcion:
        "O Relay oferece serviços financeiros empresariais sujeitos aos seus requisitos. Apoiamos a preparação documental e o onboarding; o Relay decide a aprovação e os prazos.",
      precio: "200",
      boton: "Falar com um assessor",
      lista: [
        "Acesso às funções disponíveis conforme o plano aprovado pelo Relay",
        "Opções de cartões de débito sujeitas à elegibilidade",
        "Controle de despesas por equipe/departamento",
        "Aprovações para transferências ACH e pagamentos",
        "Integração com QuickBooks, Gusto e ferramentas de folha de pagamento",
      ],
      link: "https://wa.link/a2589f",
    },
    {
      pocision: "left",
      svg: "mercury",
      icono: "mingcute:check-circle-fill",
      titulo: "Solicitação de conta empresarial com a Mercury",
      titulo2: "Apoio para solicitação à Mercury",
      descripcion:
        "A Mercury é uma plataforma financeira para empresas. Orientamos e preparamos a documentação para o onboarding; a Mercury e seus provedores bancários decidem a elegibilidade, a aprovação e os prazos.",
      precio: "200",
      boton: "Falar com um assessor",
      lista: [
        "Solicitação de conta empresarial nos EUA",
        "Sem agências físicas, gestão 100% digital",
        "Transferências ACH e Wire",
        "Integração com Stripe e QuickBooks",
        "Dashboard moderno e fácil de usar",
      ],
      link: "https://wa.link/trimy6",
    },
    {
      pocision: "right",
      svg: "stripe",
      icono: "mingcute:check-circle-fill",
      titulo: "Processador de pagamentos com Stripe",
      titulo2: "Apoio para configuração do Stripe",
      descripcion:
        "O Stripe é uma plataforma de pagamentos de terceiros. Apoiamos a preparação e a configuração da solicitação; o Stripe determina a disponibilidade, a verificação e a ativação da conta.",
      precio: "200",
      boton: "Falar com um assessor",
      lista: [
        "Cobranças com cartões internacionais",
        "Pagamentos recorrentes e assinaturas",
        "Faturamento automático",
        "Ferramentas do Stripe para gestão e otimização de pagamentos",
        "Integração com sites e plataformas digitais",
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
  titulo: "Contabilidade para sua empresa.",
  descripcion:
    "Apoie a conformidade fiscal da sua empresa nos Estados Unidos. Nossa equipe prepara declarações conforme o escopo contratado e orienta você sobre obrigações e opções tributárias.",

  /* Features */
  titulofeatures: "O que inclui nosso serviço de contabilidade?",

  /* Tarjeta Features */

  TarjetasFeatures: [
    {
      estado: "active",
      icono: "ant-design:file-protect-outlined",
      titulo: "Declarações Fiscais",
      descripcion: "Form 5472, 1120, e relatórios estaduais exigidos",
      imagen:
        "https://images.unsplash.com/photo-1764231467848-dc20e066cde2?q=80&w=706&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      estado: "inactive",
      icono: "ant-design:folder-open-filled",
      titulo: "Bookkeeping Mensal",
      descripcion: "Registro de transações e livros atualizados.",
      imagen:
        "https://images.unsplash.com/photo-1764231467896-73f0ef4438aa?q=80&w=666&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      estado: "inactive",
      icono: "ant-design:schedule-outlined",
      titulo: "Relatórios Financeiros",
      descripcion: "Análise trimestral da saúde do seu negócio.",
      imagen:
        "https://images.unsplash.com/photo-1518976024611-28bf4b48222e?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      estado: "inactive",
      icono: "mingcute:safe-shield-2-fill",
      titulo: "Apoio em comunicações com o IRS",
      descripcion: "Orientamos e apoiamos respostas ao IRS conforme o escopo contratado e as autorizações aplicáveis.",
      imagen:
        "https://images.unsplash.com/photo-1567449303183-ae0d6ed1498e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],

  tablapr: [
    {
      descripcion: "Formulário 1120 Informativo",
      cantidad: "1",
      valor: "200,00",
      total: "200,00",
    },
    {
      descripcion: "Formulário 5472",
      cantidad: "1",
      valor: "150,00",
      total: "150,00",
    },
  ],

  tablacondicional: [
    {
      data: "inputsformsa",
      descripcion: "Formulário 1120 Informativo",
      cantidad: "1",
      valor: "200,00",
      total: "200,00",
    },
    {
      data: "inputsformsa",
      descripcion: "Formulário 5472",
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
  titulo: "Assessoria para seu ITIN",
  descripcion:
    "Oferecemos orientação, preparação documental e apoio na apresentação da sua solicitação de ITIN. O IRS decide a emissão e o prazo de processamento; quando aplicável, revisamos com você as alternativas aceitas para comprovar identidade sem enviar o passaporte original.",

  /* Features */
  titulofeatures: "O que é o ITIN?",
  descripcionfeatures:
    "O ITIN (Individual Taxpayer Identification Number) é um número emitido pelo IRS para pessoas que não se qualificam para um Social Security Number, mas que precisam cumprir obrigações fiscais nos Estados Unidos.",

  /* Tarjeta Features */

  listaitin: [
    "Permite declarar impostos pessoais nos EUA.",
    "Requisito para sócios ou membros de LLCs",
    "Facilita a conformidade fiscal perante o IRS",
    "Orientação sobre as opções aceitas para comprovar identidade",
  ],

  titulopricingitin: "Custo da assessoria ITIN",
  precioitin: "400",
  tiempoitin: "Prazo",
  tiempoitin2: "Definido pelo IRS",
};

/* Datos de itin*/

/* Datos de servicios legales*/

export const dataLegales = {
  categoria: "legales",
  titulo: "Serviços Legais",
  descripcion:
    "Preparamos documentos corporativos privados conforme suas necessidades e o escopo contratado, como Operating Agreement, resoluções e emendas. Os documentos oficiais são emitidos pela autoridade competente.",

  listadelegales: [
    {
      icono: "mingcute:document-2-line",
      titulo: "OPERATING AGREEMENT",
      descripcion:
        "Documento legal fundamental que estabelece a estrutura, regras de operação e distribuição de lucros da sua LLC.",
      pregunta: "Para que preciso de um Operating Agreement?",
      respuesta:
        "Protege sua responsabilidade limitada, define claramente os papéis de cada membro e evita conflitos futuros. É essencial para o funcionamento interno e a proteção legal da sua empresa.",
    },
    {
      icono: "mingcute:file-certificate-line",
      titulo: "W-9",
      descripcion:
        "Formulário do IRS exigido para reportar informações fiscais e receber pagamentos de clientes americanos.",
      pregunta: "Quando preciso do formulário W-9?",
      respuesta:
        "É obrigatório quando você trabalha com clientes americanos ou empresas que pagarão mais de $600 por ano. Sem este formulário, seus clientes poderiam reter 30% dos seus pagamentos.",
    },
    {
      icono: "mingcute:shield-shape-line",
      titulo: "BE-13 (CLAIM FOR EXEMPTION)",
      descripcion:
        "Solicitação de isenção junto ao Bureau of Economic Analysis (BEA) dos EUA que permite a investimentos estrangeiros qualificados não apresentar o relatório completo do BE-12, evitando cargas administrativas desnecessárias.",
      pregunta: "O que acontece se eu não apresentar a Solicitação de Isenção BE-13?",
      respuesta:
        "Não apresentar a BE-13 quando exigida pode gerar multas de até $4.603 por infração (ajustadas pela inflação), além de sanções civis e da obrigação de apresentar relatórios completos retroativos. O BEA exige este formulário para investimentos estrangeiros diretos qualificados.",
    },
    {
      icono: "mingcute:seal-line",
      titulo: "APOSTILAMENTO",
      descripcion:
        "Orientamos e apoiamos você na preparação e apresentação da solicitação da Apostila de Haia ao órgão competente, que decide a emissão e o prazo.",
      pregunta: "Quais documentos preciso apostilar?",
      respuesta:
        "Geralmente é exigido para o Operating Agreement, certificados de good standing e documentos de constituição quando você precisa abrir contas bancárias ou realizar trâmites fora dos Estados Unidos.",
    },
    {
      icono: "mingcute:building-2-line",
      titulo: "DBA (DOING BUSINESS AS)",
      descripcion:
        "Ajudamos a preparar e apresentar a solicitação de registro de um nome comercial; o órgão competente decide sua aceitação.",
      pregunta: "Quando devo registrar um DBA?",
      respuesta:
        "Quando você quer operar com um nome diferente do nome legal da sua LLC, precisa abrir uma conta bancária com o nome comercial ou está criando uma linha de produtos com marca própria.",
    },
    {
      icono: "mingcute:paper-line",
      titulo: "RESELLER CERTIFICATE",
      descripcion:
        "Orientamos você na preparação da solicitação do certificado aplicável a compras para revenda; a autoridade fiscal decide sua emissão e alcance.",
      pregunta: "Quanto posso economizar com o Reseller Certificate?",
      respuesta:
        "Você pode evitar pagar o sales tax nas suas compras de estoque, o que representa uma economia média de 6-10% em cada compra. É essencial para negócios de revenda ou dropshipping.",
    },
    {
      icono: "mingcute:file-star-line",
      titulo: "D-U-N-S NUMBER",
      descripcion:
        "Identificador empresarial emitido pela Dun & Bradstreet, necessário para construir histórico de crédito e acessar financiamento e contratos corporativos.",
      pregunta: "Por que preciso de um número D-U-N-S?",
      respuesta:
        "É obrigatório para trabalhar com grandes corporações, acessar programas Apple Developer, vender para o governo federal e construir seu histórico de crédito empresarial nos EUA.",
    },
    {
      icono: "mingcute:laurel-wreath-line",
      titulo: "CERTIFICATE OF GOOD STANDING",
      descripcion:
        "Acompanhamos você na solicitação do Certificate of Good Standing, que é emitido pelo Estado. Confirma que a empresa está ativa, em dia com suas obrigações e autorizada a operar legalmente.",
      pregunta: "Quando me pedem o Certificate of Good Standing?",
      respuesta:
        "Geralmente é solicitado por bancos para abrir contas, clientes corporativos para contratos, e quando você precisa apostilar documentos ou fazer negócios com o governo.",
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
  titulo: "Desenvolvimento Web",
  descripcion:
    "Sites profissionais, modernos e otimizados para converter visitantes em clientes.",

  features: [
    {
      estado: "activo",
      icono: "mingcute:device-line",
      titulo: "Design 100% Responsivo",
      descripcion:
        "Visualização perfeita em celulares, tablets e computadores.",
      image: imagenweb1,
    },
    {
      estado: "inactivo",
      icono: "mingcute:code-line",
      titulo: "Otimização SEO Básica",
      descripcion:
        "Meta tags, estrutura de títulos e velocidade de carregamento otimizada.",
      image: imagenweb2,
    },
    {
      estado: "inactivo",
      icono: "mingcute:web-fill",
      titulo: "Estrutura Corporativa",
      descripcion: "Home, Serviços, Sobre, Contato e Políticas.",
      image: imagenweb3,
    },
    {
      estado: "inactivo",
      icono: "mingcute:earth-2-line",
      titulo: "Hospedagem e Domínio",
      descripcion: "Gestão completa do primeiro ano de hospedagem e domínio.",
      image: imagenweb4,
    },
  ],

  preciostitulo: "Desenvolvimento de página web",
  preciossubtitulo: "Um único investimento",
  precio: "350",
  link: "https://wa.link/0k0sf6",

  listamini: [
    {
      icono: "mingcute:refresh-2-fill",
      titulo: "Custo Recorrente",
      descripcion: "Domínio e Hospedagem: $85 USD / ano",
    },
    {
      icono: "mingcute:time-line",
      titulo: "Tempo estimado",
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
  descripcion: "Gerencie todo o seu negócio em um único software",

  features: [
    {
      estado: "activo",
      icono: "mingcute:classify-2-line",
      titulo: "Aplicações empresariais",
      descripcion:
        "Cada aplicação simplifica um processo e capacita mais pessoas.",
      image: videoOdoo1,
      tipo: "video",
    },
    {
      estado: "inactivo",
      icono: "mingcute:brush-3-line",
      titulo: "Personalização sem limites",
      descripcion:
        "Aplicações adicionais com boa infraestrutura e serviços profissionais.",
      image: imagen2,
      tipo: "imagen",
      features2: [
        {
          titulo: "Personalização orientada ao que você precisa",
          descripcion:
            "Usamos o aplicativo Studio do Odoo para automatizar ações, personalizar telas e elaborar seus próprios relatórios e webhooks.",
          lista: [
            "Configuração básica para o modelo de negócio",
            "Personalização de telas e visualizações",
            "Configuração e conexão com outras plataformas",
          ],
        },
      ],
    },
    {
      estado: "inactivo",
      icono: "mingcute:mind-map-line",
      titulo: "Assessoria na implementação",
      descripcion:
        "Analisamos suas necessidades, seu modelo de negócio e definimos o roteiro.",
      image: imagen3,
      tipo: "imagen",
      features2: [
        {
          titulo: "Assessoria na implementação e uso",
          descripcion:
            "Acompanhamos você durante todo o processo de adoção do Odoo. Analisamos suas necessidades, definimos o roteiro e orientamos você com boas práticas para maximizar a escalabilidade.",
          lista: [
            "Análise de processos e diagnóstico",
            "Plano de implementação personalizado",
            "Recomendações de boas práticas",
            "Acompanhamento pós-implementação",
          ],
        },
      ],
    },
    {
      estado: "inactivo",
      icono: "mingcute:earth-2-line",
      titulo: "Capacitação",
      descripcion: "Capacitação no uso do Odoo para sua equipe",
      image: imagen4,
      tipo: "imagen",
      features2: [
        {
          titulo: "Capacitação para equipes especializadas",
          descripcion:
            "Treinamos sua equipe para dominar o Odoo e integrá-lo eficazmente no dia a dia. Desenhamos workshops sob medida conforme o perfil de cada equipe.",
          lista: [
            "Workshops práticos in-company",
            "Material didático e guias de uso",
            "Capacitação em módulos específicos",
          ],
        },
      ],
    },
  ],

  tituloForm: "Agende uma reunião conosco",
  descripcionForm:
    "Descubra como transformar o Odoo no motor digital do seu negócio. Orientamos você passo a passo para que aproveite ao máximo cada módulo sem complicações.",
  preguntaForm: "Como podemos ajudar você?",
  listaForm: [
    "Personalizamos o Odoo sob medida para você.",
    "Desenhamos a rota de implementação ideal conforme seu modelo de negócio",
    "Capacitamos sua equipe para que usem o Odoo com confiança e autonomia",
  ],
};

/* Datos de Partner de odoo*/
