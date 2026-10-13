// TecnoBlog: interactividad desarrollada con Vue 3.
// Vue administra las tarjetas, la búsqueda, los filtros, la lectura personal y el año del pie de página.

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
          estadoLectura: "Todos",
          estadosLectura: ["Todos", "Favoritos", "Leídos", "Pendientes"],
          ordenArticulos: "original",
          temaOscuro: false,
          favoritos: [],
          articulosLeidos: [],
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

          const articulosCoincidentes = this.articulos.filter(articulo => {
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
            const coincideEstado =
              this.estadoLectura === "Todos" ||
              (this.estadoLectura === "Favoritos" && this.esFavorito(articulo.id)) ||
              (this.estadoLectura === "Leídos" && this.estaLeido(articulo.id)) ||
              (this.estadoLectura === "Pendientes" && !this.estaLeido(articulo.id));

            return coincideCategoria && coincideBusqueda && coincideEstado;
          });

          return [...articulosCoincidentes].sort((primero, segundo) => {
            if (this.ordenArticulos === "titulo-asc") {
              return this.textoOrdenable(primero.titulo).localeCompare(this.textoOrdenable(segundo.titulo), "es");
            }
            if (this.ordenArticulos === "titulo-desc") {
              return this.textoOrdenable(segundo.titulo).localeCompare(this.textoOrdenable(primero.titulo), "es");
            }
            if (this.ordenArticulos === "categoria") {
              return primero.categoria.localeCompare(segundo.categoria, "es");
            }
            return primero.id - segundo.id;
          });
        },

        cantidadLeidos() {
          return this.articulosLeidos.length;
        },

        porcentajeLectura() {
          return this.articulos.length
            ? Math.round((this.cantidadLeidos / this.articulos.length) * 100)
            : 0;
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

        textoOrdenable(texto) {
          return this.normalizar(texto).replace(/^[^a-z0-9]+/i, "");
        },

        seleccionarCategoria(categoria) {
          this.categoriaActiva = categoria;
        },

        esFavorito(idArticulo) {
          return this.favoritos.includes(idArticulo);
        },

        estaLeido(idArticulo) {
          return this.articulosLeidos.includes(idArticulo);
        },

        alternarFavorito(idArticulo) {
          this.favoritos = this.alternarId(this.favoritos, idArticulo);
          this.guardarPreferencias();
        },

        alternarLeido(idArticulo) {
          this.articulosLeidos = this.alternarId(this.articulosLeidos, idArticulo);
          this.guardarPreferencias();
        },

        marcarLeido(idArticulo) {
          if (!this.estaLeido(idArticulo)) {
            this.articulosLeidos = [...this.articulosLeidos, idArticulo];
            this.guardarPreferencias();
          }
        },

        alternarTema() {
          this.temaOscuro = !this.temaOscuro;
          this.aplicarTema();
          this.guardarPreferencias();
        },

        aplicarTema() {
          document.body.classList.toggle("tema-oscuro", this.temaOscuro);
        },

        alternarId(lista, idArticulo) {
          return lista.includes(idArticulo)
            ? lista.filter(id => id !== idArticulo)
            : [...lista, idArticulo];
        },

        guardarPreferencias() {
          try {
            localStorage.setItem("tecnoblog-favoritos", JSON.stringify(this.favoritos));
            localStorage.setItem("tecnoblog-leidos", JSON.stringify(this.articulosLeidos));
            localStorage.setItem("tecnoblog-tema-oscuro", String(this.temaOscuro));
          } catch (error) {
            console.warn("No fue posible guardar las preferencias de lectura.", error);
          }
        },

        cargarPreferencias() {
          try {
            const idsValidos = this.articulos.map(articulo => articulo.id);
            const favoritosGuardados = JSON.parse(localStorage.getItem("tecnoblog-favoritos") || "[]");
            const leidosGuardados = JSON.parse(localStorage.getItem("tecnoblog-leidos") || "[]");
            this.temaOscuro = localStorage.getItem("tecnoblog-tema-oscuro") === "true";
            this.aplicarTema();

            this.favoritos = Array.isArray(favoritosGuardados)
              ? favoritosGuardados.filter(id => idsValidos.includes(id))
              : [];
            this.articulosLeidos = Array.isArray(leidosGuardados)
              ? leidosGuardados.filter(id => idsValidos.includes(id))
              : [];
          } catch (error) {
            this.favoritos = [];
            this.articulosLeidos = [];
            console.warn("No fue posible recuperar las preferencias de lectura.", error);
          }
        },

        limpiarBusqueda() {
          this.busqueda = "";
        },

        restablecerFiltros() {
          this.busqueda = "";
          this.categoriaActiva = "Todas";
          this.estadoLectura = "Todos";
        },

        filtrarDesdeCategorias(categoria) {
          this.categoriaActiva = categoria;
          this.busqueda = "";
          document.getElementById("articulos").scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      },

      mounted() {
        this.cargarPreferencias();
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
