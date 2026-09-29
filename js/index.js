// ==========================================================================
// Archivo: js/index.js
// Descripción: Lógica interactiva y mejoras de experiencia de usuario (UX)
//              para TecnoBlog utilizando la librería jQuery.
// ==========================================================================

// Esperamos a que el documento HTML esté completamente cargado antes de ejecutar jQuery
$(document).ready(function () {

    // ======================================================================
    // 1. GENERACIÓN DINÁMICA E INTERACTIVA DE CATEGORÍAS (jQuery UX)
    // ======================================================================
    // Lista de categorías temáticas del blog
    const categorias = ["HTML", "CSS", "JavaScript", "Jquery", "Programación", "Diseño web"];
    const $lista = $('#lista-categorias');
    $lista.empty(); // Limpiamos la lista para evitar elementos duplicados

    // Recorremos el arreglo de categorías y creamos cada elemento <li> con jQuery
    categorias.forEach(categoria => {
        // Creamos el elemento li, le asignamos el texto, accesibilidad y tooltip de ayuda
        const $li = $('<li></li>')
            .text(categoria)
            .attr('role', 'button')
            .attr('tabindex', '0')
            .attr('title', 'Filtrar artículos por: ' + categoria);

        // Agregamos el elemento generado al contenedor <ul> en el HTML
        $lista.append($li);
    });

    // ======================================================================
    // 2. FUNCIÓN AUXILIAR DE FILTRADO DE ARTÍCULOS
    // ======================================================================
    // Filtra las tarjetas de artículos según el texto ingresado o la categoría seleccionada
    function filtrarArticulos(termino) {
        const textoBusqueda = (termino || '').toLowerCase().trim();
        let articulosVisibles = 0;
        const totalArticulos = $('.tarjeta').length;

        // Recorremos cada tarjeta de artículo con jQuery .each()
        $('.tarjeta').each(function () {
            const $tarjeta = $(this);
            const titulo = $tarjeta.find('h3').text().toLowerCase();
            const descripcion = $tarjeta.find('p').text().toLowerCase();
            const categoriaData = ($tarjeta.attr('data-categoria') || '').toLowerCase();

            // Verificamos si el término coincide con el título, descripción o data-categoria
            const coincide = titulo.includes(textoBusqueda) ||
                descripcion.includes(textoBusqueda) ||
                categoriaData.includes(textoBusqueda);

            if (coincide) {
                // Si coincide, mostramos la tarjeta con una transición suave
                $tarjeta.stop(true, true).fadeIn(250);
                articulosVisibles++;
            } else {
                // Si no coincide, ocultamos la tarjeta suavemente
                $tarjeta.stop(true, true).fadeOut(250);
            }
        });

        // Actualizamos el contador dinámico de artículos visibles para feedback al usuario (UX)
        if (textoBusqueda === '') {
            $('#contador-articulos').text(`Mostrando ${articulosVisibles} de ${totalArticulos} artículos`);
            $('#btn-limpiar').fadeOut(150); // Ocultar botón de limpiar si no hay texto
        } else {
            $('#contador-articulos').text(`Mostrando ${articulosVisibles} de ${totalArticulos} artículos para "${termino}"`);
            $('#btn-limpiar').fadeIn(150); // Mostrar botón de limpiar cuando hay búsqueda
        }

        // Si ningún artículo coincide, mostramos el mensaje amigable de "sin resultados"
        if (articulosVisibles === 0) {
            $('#sin-resultados').stop(true, true).fadeIn(250);
        } else {
            $('#sin-resultados').stop(true, true).fadeOut(200);
        }
    }

    // 3. EVENTO DEL BUSCADOR EN TIEMPO REAL (jQuery UX)
    // Detectamos cuando el usuario escribe en el campo de texto (eventos input y keyup)
    $('#buscador').on('input keyup', function () {
        const busqueda = $(this).val();

        // Si el usuario escribe manualmente, quitamos la selección visual de las categorías
        $('#lista-categorias li').removeClass('categoria-activa');

        // Ejecutamos el filtro en tiempo real con jQuery
        filtrarArticulos(busqueda);
    });

    // 4. INTERACTIVIDAD EN LA LISTA DE CATEGORÍAS (jQuery UX)
    // Al hacer clic en una categoría generada dinámicamente
    $('#lista-categorias').on('click keypress', 'li', function (e) {
        // Permitir interacción con clic o con la tecla Enter (accesibilidad UX)
        if (e.type === 'keypress' && e.which !== 13) return;

        const $categoriaClic = $(this);
        const yaEstaActiva = $categoriaClic.hasClass('categoria-activa');

        // Quitamos la clase activa de todas las categorías
        $('#lista-categorias li').removeClass('categoria-activa');

        if (yaEstaActiva) {
            // Si la categoría ya estaba seleccionada, la desactivamos y mostramos todos los artículos
            $('#buscador').val('');
            filtrarArticulos('');
        } else {
            // Si no estaba activa, la marcamos visualmente como seleccionada
            $categoriaClic.addClass('categoria-activa');
            const nombreCategoria = $categoriaClic.text().trim();

            // Asignamos el nombre al campo de búsqueda y aplicamos el filtro con jQuery
            $('#buscador').val(nombreCategoria);
            filtrarArticulos(nombreCategoria);

            // Desplazamiento suave animado hacia la sección de artículos para facilitar la vista
            $('html, body').animate({
                scrollTop: $('#articulos').offset().top - 70
            }, 400);
        }
    });

    // 5. BOTÓN PARA LIMPIAR LA BÚSQUEDA Y BOTÓN DE RESTABLECER
    // Función reutilizable para restablecer el buscador y mostrar todos los artículos
    function restablecerFiltro() {
        $('#buscador').val('').focus();
        $('#lista-categorias li').removeClass('categoria-activa');
        filtrarArticulos('');
    }

    // Evento de clic en el botón con icono 'x' dentro de la barra de búsqueda
    $('#btn-limpiar').on('click', function () {
        restablecerFiltro();
    });

    // Evento de clic en el botón "Ver todos los artículos" cuando no hay resultados
    $('#btn-restablecer').on('click', function () {
        restablecerFiltro();
    });

    // 6. ACTUALIZACIÓN AUTOMÁTICA DEL AÑO EN EL PIE DE PÁGINA
    // Seleccionamos con jQuery la clase '.anio' y asignamos el año vigente
    $('.anio').text(new Date().getFullYear());

});