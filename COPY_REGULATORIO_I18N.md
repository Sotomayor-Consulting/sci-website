# Revisión de copy regulatorio e i18n

Fecha: 2026-09-22

Este inventario resume las sustituciones aplicadas al contenido público. Las claves propuestas siguen `camelCase`; el proyecto conserva actualmente sus fuentes localizadas en español (`es`), inglés (`en`) y portugués (`pr`) en lugar de un catálogo i18n único.

## LLC: descripción y CTA

**Antes:** "Incorporación de LLCs" / "Adquiere tu LLC"

**Después:** "Acompañamiento para incorporar una LLC" / "Agenda tu asesoría"

**Label i18n:** `llcFormationGuidance` -> "Acompañamiento para incorporar una LLC" / "Guidance for LLC Formation" / "Acompanhamento para constituir uma LLC"

**Label i18n:** `scheduleLlcAdvisory` -> "Agenda tu asesoría" / "Schedule Your Advisory Session" / "Agende sua assessoria"

## LLC: registro, EIN y banca

**Antes:** "Constituimos tu LLC, obtenemos el EIN y te asesoramos en la apertura de tu cuenta bancaria en EE. UU. Recibes todos los documentos legales listos para operar."

**Después:** "Preparamos y apoyamos la presentación del registro de tu LLC ante el Estado y de la solicitud del EIN ante el IRS. También te orientamos en solicitudes bancarias; cada autoridad o proveedor decide la aprobación, emisión y plazos."

**Label i18n:** `llcEinApplicationSupport` -> "Preparamos y apoyamos la presentación del registro de tu LLC ante el Estado y de la solicitud del EIN ante el IRS. También te orientamos en solicitudes bancarias; cada autoridad o proveedor decide la aprobación, emisión y plazos." / "We prepare and support filing your LLC registration with the state and your EIN application with the IRS. We also guide you through banking applications; each authority or provider decides approval, issuance, and timing." / "Preparamos e apoiamos a apresentação do registro da sua LLC ao estado e da solicitação do EIN ao IRS. Também orientamos você em solicitações bancárias; cada autoridade ou provedor decide a aprovação, emissão e os prazos."

## Timeline del proceso

**Antes:** "Recibirás tu número de identificación fiscal del IRS en unos días" y "servicios de EIN exprés".

**Después:** "Te acompañamos en la solicitud de tu número de identificación fiscal ante el IRS" y aclaración de que el IRS decide la emisión y el tiempo de procesamiento.

**Label i18n:** `einApplicationAccompaniment` -> "Te acompañamos en la solicitud de tu número de identificación fiscal ante el IRS." / "We support you with your tax identification number application to the IRS." / "Acompanhamos você na solicitação do seu número de identificação fiscal ao IRS."

**Label i18n:** `authorityControlsIssuanceAndTiming` -> "La autoridad competente decide la aprobación, emisión y plazos." / "The appropriate authority decides approval, issuance, and timing." / "A autoridade competente decide a aprovação, a emissão e os prazos."

## Artículos educativos sobre EIN

**Antes:** "Obtener el EIN del IRS (gratuito, 1-4 semanas para extranjeros)" y servicios de "obtención de EIN".

**Después:** "Solicitar el EIN ante el IRS"; el IRS decide la emisión y el tiempo de procesamiento. Las listas de servicios describen apoyo para presentar la solicitud.

**Label i18n:** `applyForEinWithIrs` -> "Solicitar el EIN ante el IRS" / "Apply for the EIN with the IRS" / "Solicitar o EIN ao IRS"

## Documentos corporativos

**Antes:** "Todos los documentos operativos de la empresa están listos."

**Después:** "Preparamos los documentos corporativos privados incluidos. No sustituyen certificados ni documentos oficiales emitidos por el Estado."

**Label i18n:** `privateCorporateDocumentsDisclaimer` -> "Preparamos los documentos corporativos privados incluidos. No sustituyen certificados ni documentos oficiales emitidos por el Estado." / "We prepare the included private corporate documents. They do not replace certificates or official documents issued by the state." / "Preparamos os documentos corporativos privados incluídos. Eles não substituem certificados ou documentos oficiais emitidos pelo estado."

## Holdings y otras jurisdicciones

**Antes:** "Nos encargamos de la complejidad regulatoria y legal" y "finalización de los trámites".

**Después:** "Te orientamos sobre los pasos identificados, preparamos la documentación incluida y coordinamos su presentación"; las autoridades y terceros deciden el resultado.

**Label i18n:** `internationalFormationCoordination` -> "Te guiamos en la planificación y preparación documental para solicitar la constitución de estructuras en distintas jurisdicciones." / "We guide you in planning and preparing documents to apply for the formation of structures in different jurisdictions." / "Orientamos você no planejamento e na preparação documental para solicitar a constituição de estruturas em diferentes jurisdições."

## Stripe

**Antes:** "Creación de Cuentas Stripe" y "Activación Rápida y Garantizada".

**Después:** "Acompañamiento para Solicitar y Configurar Stripe"; Stripe determina la verificación, activación y plazos.

**Label i18n:** `stripeApplicationAndSetupSupport` -> "Acompañamiento para solicitar y configurar Stripe" / "Guidance to apply for and configure Stripe" / "Acompanhamento para solicitar e configurar o Stripe"

**Label i18n:** `stripeControlsAccountDecision` -> "Stripe decide de forma independiente la verificación y aprobación de la cuenta." / "Stripe independently decides account verification and approval." / "O Stripe decide de forma independente a verificação e a aprovação da conta."

## Apostilla, DBA y certificados

**Antes:** "Legalización de documentos para uso internacional mediante la Apostilla de La Haya" y descripciones directas de registro o certificado.

**Después:** orientación y apoyo para preparar y presentar cada solicitud; la autoridad competente decide aceptación, emisión, alcance y plazo.

**Label i18n:** `apostilleApplicationSupport` -> "Te orientamos y apoyamos en la preparación y presentación de la solicitud de Apostilla de La Haya ante la autoridad competente." / "We guide and support you in preparing and filing a Hague Apostille request with the appropriate authority." / "Orientamos e apoiamos você na preparação e apresentação da solicitação da Apostila de Haia ao órgão competente."

**Label i18n:** `tradeNameApplicationSupport` -> "Te ayudamos a preparar y presentar la solicitud de registro de un nombre comercial." / "We help prepare and file an application to register a trade name." / "Ajudamos a preparar e apresentar a solicitação de registro de um nome comercial."

## Visas y residencias

**Antes:** "Te ayudamos a estructurar tu inversión de forma que te califique para visas que te permitan obtener la residencia."

**Después:** "Te orientamos sobre opciones de visa vinculadas a inversión y sobre la documentación de la solicitud. La autoridad migratoria decide si cumples los requisitos y si aprueba la residencia."

**Label i18n:** `visaApplicationGuidance` -> "Orientación y preparación documental para solicitudes de visas y residencias" / "Guidance and document preparation for visa and residency applications" / "Orientação e preparação documental para solicitações de vistos e residências"

**Label i18n:** `immigrationAuthorityDecision` -> "La autoridad migratoria determina la elegibilidad, aprobación y plazos." / "Immigration authorities determine eligibility, approval, and timing." / "A autoridade migratória determina a elegibilidade, a aprovação e os prazos."

## Cumplimiento fiscal y mantenimiento

**Antes:** "Te garantizamos el correcto cumplimiento" y "Cumplimiento garantizado".

**Después:** apoyo para identificar obligaciones, preparar documentos y coordinar presentaciones, sin garantizar resultados, aceptación, cumplimiento automático o ausencia de sanciones.

**Label i18n:** `taxComplianceSupportDisclaimer` -> "Te apoyamos para identificar obligaciones, preparar documentación y coordinar presentaciones, sin garantizar resultados ni ausencia de sanciones." / "We support identifying obligations, preparing documents, and coordinating filings without guaranteeing outcomes or the absence of penalties." / "Apoiamos a identificação de obrigações, a preparação de documentos e a coordenação de declarações, sem garantir resultados ou ausência de sanções."

## Aviso general

**Antes:** las aclaraciones estaban presentes solo en algunas landings y páginas legales.

**Después:** el contenido comercial y los datos estructurados aclaran la función privada de SCI y reservan las decisiones oficiales a la autoridad o proveedor correspondiente.

**Label i18n:** `privateAdvisoryNotGovernmentAgency` -> "SCI es una consultora privada e independiente, no una agencia gubernamental. Brindamos orientación, preparación documental y acompañamiento; las autoridades competentes deciden la emisión y los plazos." / "SCI is a private, independent consulting firm, not a government agency. We provide guidance, document preparation, and support; the appropriate authorities decide issuance and timing." / "A SCI é uma consultoria privada e independente, não um órgão governamental. Oferecemos orientação, preparação documental e acompanhamento; as autoridades competentes decidem a emissão e os prazos."
