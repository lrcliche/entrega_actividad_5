
document.addEventListener('DOMContentLoaded', function() {
    const categorias = ["HTML", "CSS", "JavaScript","Jquery","Programación","Diseño web"];
    const lista = $('#lista-categorias');
    lista.empty(); // Limpiar la lista antes de agregar elementos
    categorias.forEach(categoria => {
        const li = $('<li></li>').text(categoria);
        lista.append(li);
    });

})