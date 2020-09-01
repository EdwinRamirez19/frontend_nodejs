let token = localStorage.getItem('_token'),
    productos = [],
    url = '',
    method = ''

function init() {
    cargarProductos(token)

}

function cargarProductos(token) {
    $.ajax({
        url: 'http://localhost:3000/productos',
        method: 'GET',
        headers: { authorization: token }
    }).then((res) => {
        productos = res;
        cargarDatatable(res)
    }).catch(err => {
        console.log(err)
    })
}



function cargarDatatable(response) {
    if ($.fn.DataTable.isDataTable('#table-productos')) {
        $('#table-productos').dataTable().fnClearTable();
        $('#table-productos').dataTable().fnDestroy();
        $('#table-productos thead').empty()
    } else {
        $('#table-productos thead').empty()
    }


    if (response.length != 0) {

        let my_columns = []
        $.each(response[0], function(key, value) {
            var my_item = {};
            // my_item.class = "filter_C";
            my_item.data = key;
            if (key == 'id') {

                my_item.title = 'Acción';

                my_item.render = function(data, type, row) {

                    return `<a class="edit btn btn-success" type="button" onclick="editarProductos(${row.id})">Editar</a>
                    <a class="edit btn btn-danger" type="button" onclick="eliminarProductos(${row.id})">Eliminar</a>`;
                }
                my_columns.push(my_item);
            } else if (key == 'nombre') {

                my_item.title = 'Nombre';

                my_item.render = function(data, type, row) {
                    return `  <div'> 
                                ${row.nombre}
                            </div>`
                }
                my_columns.push(my_item);
            } else if (key == 'descripcion') {

                my_item.title = 'Descripcion';

                my_item.render = function(data, type, row) {
                    return `  <div'> 
                                ${row.descripcion}
                            </div>`
                }
                my_columns.push(my_item);
            } else if (key == 'stock') {

                my_item.title = 'Cantidad';

                my_item.render = function(data, type, row) {
                    return `  <div'> 
                                ${row.stock}
                            </div>`
                }
                my_columns.push(my_item);
            } else if (key == 'imagen') {

                my_item.title = 'imagen';

                my_item.render = function(data, type, row) {
                    return `  <div > 
                                <img src="http://localhost:3000/download/${ row.imagen}" width ="90px" heigth="90px">
                            </div>`
                }
                my_columns.push(my_item);
            }
        })




        $('#table-productos').DataTable({
            "destroy": true,
            responsive: true,
            data: response,
            "columns": my_columns,
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No hay datos registrados",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Productos   ",
                "infoEmpty": "No hay Productos     registrados",
                "infoFiltered": "(Filtrado de _MAX_    )",
                "lengthMenu": "_MENU_   ",
                "search": "Buscar:",
                "zeroRecords": "No se han encontrado registros"
            },

            "order": [
                [0, 'asc']
            ],

            // "columnDefs": [
            //     { "width": "30%", "targets": 2 }
            // ],

            "lengthMenu": [
                [3, 10, 15, 20, -1],
                [3, 10, 15, 20, "Todos"]
            ]
        });
    }
}



function crearProductos(url, method) {

    let nombre = $("#nombre").val(),
        descripcion = $("#descripcion").val(),
        stock = $("#stock").val(),
        imagen = $("#path_imagen").val();
    console.log(imagen)


    if (nombre != "" && descripcion != "" && stock != "" && imagen != undefined) {
        nombre = nombre.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        descripcion = descripcion.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        stock = stock.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        $.ajax({
            url: url,
            method: method,
            headers: { authorization: token },
            data: {
                nombre,
                descripcion,
                stock,
                imagen: imagen
            }
        }).then(res => {

            cargarProductos(token)
            clear()
            $("#productos-modal").modal('hide')
        }).catch(err => {
            console.log(err)
        })
    } else {
        swal({
            title: "¡Error!",
            text: "Todos los campos son requeridos",
            icon: "warning",
        });
    }
}
$("#open-modal").on('click', function() {
    url = 'http://localhost:3000/productos';
    method = 'POST';
    console.log(url, method)
    $("#productos-modal").modal('show')
})

function editarProductos(id) {
    let producto = productos.filter(p => p.id == id);
    url = 'http://localhost:3000/productos/' + id;
    method = 'POST';

    if (producto.length != 0) {
        $("#nombre").val(producto[0].nombre)
        $("#descripcion").val(producto[0].descripcion)
        $("#stock").val(producto[0].stock)
        $("#imagen_cargada").attr('src', 'http://localhost:3000/download/' + producto[0].imagen)
        $("#path_imagen").val(producto[0].imagen)
        $("#productos-modal").modal('show')

    }
}

function eliminarProductos(id) {
    swal({
            title: "¿Estas Seguro que deseas eliminar el resgitro?",
            text: "Despues de aceptar no hay nada que hacer!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((Delete) => {
            if (Delete) {
                $.ajax({
                    url: 'http://localhost:3000/productos/' + id,
                    method: 'delete',
                    headers: { authorization: token }
                }).then(res => {
                    console.log(res)
                    cargarProductos(token)
                    swal("Registro Eliminado Exitosamenete", {
                        icon: "success",
                    });
                }).catch(err => {
                    swal("No se Pudo Eliminar el Registro, vuelve a Intentarlo", {
                        icon: "warning",
                    });

                })

            } else {
                swal("OK el Registro se Conserva");
            }
        });

}

$("#imagen").on('change', function() {
    let imagen = $(this)[0].files[0]
    let formData = new FormData()
    if (imagen != undefined) {
        formData.append('imagen', imagen)
        $.ajax({
            url: 'http://localhost:3000/upload',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
        }).then(res => {
            console.log(res)
            $("#imagen_cargada").attr('src', 'http://localhost:3000/download/' + res.pathImagen)
            $("#path_imagen").val(res.pathImagen)
        }).catch(err => {
            console.log(err)
        })
    }
})

$("#guardar").on('click', function(params) {
    crearProductos(url, method)
})

function clear() {
    $("#nombre").val('')
    $("#descripcion").val('')
    $("#stock").val('')
    $("#imagen").val('')
    $("#path_imagen").val('')
    $("#imagen_cargada").val('')
}



function logout() {
    localStorage.clear()
    window.location.href = '../login.html';

}


init();