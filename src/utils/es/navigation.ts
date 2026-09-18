// An array of links for navigation bar
const navBarLinks = [
  { name: "Inicio", url: "/" },
  { name: "Planes", url: "/#precios" },
  { name: "Servicios", url: "/services" },
  { name: "Nosotros", url: "/about" },
  { name: "Contactos", url: "/contact" },
  { name: "Soporte", url: "/support"},
  { name: "Blog", url: "/blog" },
];
// An array of links for footer
const footerLinks = [
  {
    section: "Políticas",
    links: [
      { name: "Políticas de privacidad", url: "/politicas" },
      { name: "Términos y condiciones", url: "/terminos" },
    ],
  },
  {
    section: "Compañía",
    links: [
      { name: "Servicios", url: "/services" },
      { name: "Blog", url: "/blog" },
      { name: "Contáctanos", url: "/contact" },
    ],
  },
];
// An object of links for social icons
const socialLinks = {
  facebook: "https://www.facebook.com/",
  x: "https://twitter.com/",
  github: "https://github.com/mearashadowfax/ScrewFast",
  google: "https://www.google.com/",
  slack: "https://slack.com/",
};

const mensajes = {
  banco:
    "Sotomayor Consulting International no es un banco, entidad financiera ni presta servicios de crédito directo. Somos una empresa de consultoría que brinda asesoría y acompañamiento en constitución de empresas, apertura de cuentas y servicios tecnológicos. No es una entidad del Gobierno: los documentos oficiales los emiten las autoridades competentes.",
  experiencia: "",
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
  mensajes,
};
