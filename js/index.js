// TecnoBlog: interactividad desarrollada con Vue 3.
// Vue administra las tarjetas, la búsqueda, los filtros, las categorías y el año del pie de página.

(function () {
  function iniciarTecnoBlog() {
    if (!window.Vue) {
      console.error("No se pudo cargar Vue 3. Comprueba tu conexión a Internet.");
      return;
    }

    const { createApp } = Vue;

    createApp({
      data() {
        return {
          busqueda: "",
          categoriaActiva: "Todas",
          articulos: [
            {
              id: 1,
              numero: "01",
              titulo: "¿Qué es HTML5?",
              descripcion: "La base para escribir la estructura de una página web.",
              categoria: "HTML",
              imagen: "img/html5.svg",
              alt: "Ilustración del logotipo de HTML5",
              idResumen: "resumen-html",
              resumen: "HTML5 es la versión moderna del lenguaje que organiza el contenido de una página: títulos, párrafos, imágenes, menús y secciones como header, nav, main y footer."
            },
            {
              id: 2,
              numero: "02",
              titulo: "Aprende CSS",
              descripcion: "Colores, espacios y tamaños para que la página se vea ordenada.",
              categoria: "Diseño web",
              imagen: "img/css3.svg",
              alt: "Ilustración del logotipo de CSS3",
              idResumen: "resumen-css",
              resumen: "CSS controla la apariencia: colores, tipografía, márgenes y la forma en que se acomodan los elementos, incluso en pantallas pequeñas. Sus reglas permiten mantener una identidad visual coherente."
            },
            {
              id: 3,
              numero: "03",
              titulo: "JavaScript",
              descripcion: "El lenguaje que le da vida y respuesta a la página.",
              categoria: "Programación",
              imagen: "img/javascript.svg",
              alt: "Ilustración del logotipo de JavaScript",
              idResumen: "resumen-js",
              resumen: "JavaScript permite que la página reaccione a lo que hace la persona: validar formularios, mostrar mensajes o actualizar datos sin recargar. Frameworks como Vue ayudan a organizar esa interactividad."
            }
          ]
        };
      },

      computed: {
        categorias() {
          return [...new Set(this.articulos.map(articulo => articulo.categoria))];
        },

        articulosFiltrados() {
          const termino = this.normalizar(this.busqueda);

          return this.articulos.filter(articulo => {
            const coincideCategoria =
              this.categoriaActiva === "Todas" ||
              articulo.categoria === this.categoriaActiva;

            const textoArticulo = this.normalizar([
              articulo.titulo,
              articulo.descripcion,
              articulo.categoria,
              articulo.resumen
            ].join(" "));

            const coincideBusqueda = !termino || textoArticulo.includes(termino);
            return coincideCategoria && coincideBusqueda;
          });
        },

        anioActual() {
          return new Date().getFullYear();
        }
      },

      methods: {
        normalizar(texto) {
          return String(texto)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("es")
            .trim();
        },

        seleccionarCategoria(categoria) {
          this.categoriaActiva = categoria;
        },

        limpiarBusqueda() {
          this.busqueda = "";
        },

        restablecerFiltros() {
          this.busqueda = "";
          this.categoriaActiva = "Todas";
        },

        filtrarDesdeCategorias(categoria) {
          this.categoriaActiva = categoria;
          this.busqueda = "";
          document.getElementById("articulos").scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    }).mount("#app");
  }

  // Los scripts usan defer, por lo que el HTML estará analizado antes de iniciar Vue.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarTecnoBlog);
  } else {
    iniciarTecnoBlog();
  }
})();
