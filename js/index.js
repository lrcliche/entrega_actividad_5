
// Este archivo contiene el código JavaScript que se ejecutará en la página de inicio del blog.
document.addEventListener('DOMContentLoaded', function() {
    // preparo la lista de categorías para que se muestre en el HTML
    const categorias = ["HTML", "CSS", "JavaScript","Jquery","Programación","Diseño web"];
    const lista = $('#lista-categorias');
    lista.empty(); // Limpiar la lista antes de agregar elementos
    
    // Agregar cada categoría como un elemento de lista utilizando jQuery
    categorias.forEach(categoria => {
        const li = $('<li></li>').text(categoria);
        lista.append(li);
    });
    // Actualizar el año en el footer -->
    $('.anio').text(new Date().getFullYear());
})