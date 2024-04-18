// Simulador Tienda Havanna - Simple GUI
// Javascript | Coderhouse | PRE-ENTREGA 3 | Ian SOSA

// Este algoritmo representa una versión primitiva del proyecto final: recrear la tienda "Havanna" online.
// Intencionalmente aplico los conceptos que aprendimos hasta ahora en las clases...
// (Condicionales; ciclos; funciones; objetos; arrays; high-order functions;
// DOM; Eventos; localStorage; JSON; Sugar Syntax)
// ergo es probable que hayan formas más óptimas de escalar el código.

const PRODUCTOS = [
    {
        nombre: "Alfajores 70% Cacao Puro x9 unidades (¡Hoy 25% off!)",
        precio: 16500.00,
        descuento: 25 
        //Descuento expresado en % (al usarse se opera convirtiendo a su expresión decimal)
    },
    {
        nombre: "Havannets de coco 70% Cacao x6 unidades",
        precio: 6700.00,
        descuento: 0
    },
    {
        nombre: "Galletitas de limón x12 unidades",
        precio: 2500.00,
        descuento: 0
    }
];

let indicesSeleccionados = [];
let carrito = [];

function cargarListadoProductos()
{
    const LISTADO_PRODUCTOS = document.getElementById("listadoProductos");
    LISTADO_PRODUCTOS.textContent = ""; //  Limpio el mensaje de error para cargar los
                                        //  productos (estoy asumiendo que siempre voy a
                                        //  tener productos disponibles para mostrar...)

    PRODUCTOS.forEach(producto => {
        const LI = document.createElement("li");
        LI.textContent = producto.nombre;

        LI.setAttribute("data-id", PRODUCTOS.indexOf(producto));
        //  "data-id" lo uso para aprovechar que PRODUCTOS es un array de objetos indexado.
        //  Quizás a futuro use otra forma de quizas no dejar expuesto la ID del producto...
        
        LI.addEventListener("click", () => { agregarCarrito(LI) });

        LISTADO_PRODUCTOS.appendChild(LI);
    });
}

function agregarCarrito(ELEMENTO)
{   
    const CARRITO_PRODUCTOS = document.getElementById("carritoProductos");
    let producto_id = parseInt(ELEMENTO.getAttribute("data-id"));

    if (carrito.length === 0)
    {
        CARRITO_PRODUCTOS.textContent = "";
    }

    if (indicesSeleccionados.includes(producto_id))
    {
        carrito[carrito.findIndex((elemento_actual) => elemento_actual.id === producto_id)].cantidad += 1;

        const LI_PRODUCTO = document.getElementById(`carritoProducto${producto_id}`);
        
        let cantidadProducto = parseInt(LI_PRODUCTO.children[1].textContent);
        LI_PRODUCTO.children[1].textContent = cantidadProducto + 1;
    }
    else
    {
        indicesSeleccionados.push(producto_id);

        carrito.push(
            {
                //  Elijo intencionalmente qué propiedades cargar al carrito
                //  Para controlar qué información expongo al usuario...
                id: producto_id,
                cantidad: 1
            }
        );

        const LI = document.createElement("li");
        LI.id = `carritoProducto${producto_id}`;
        
        const DIV_NOMBRE = document.createElement("div");
        DIV_NOMBRE.textContent = PRODUCTOS[producto_id].nombre;
        
        const DIV_CANTIDAD = document.createElement("div");
        DIV_CANTIDAD.textContent = 1;

        const BUTTON_ELIMINAR = document.createElement("input");
        BUTTON_ELIMINAR.setAttribute("type", "button");
        BUTTON_ELIMINAR.setAttribute("value","❎");

        BUTTON_ELIMINAR.addEventListener("click", () => eliminarCarrito(producto_id));

        LI.appendChild(DIV_NOMBRE);
        LI.appendChild(DIV_CANTIDAD);
        LI.appendChild(BUTTON_ELIMINAR);

        CARRITO_PRODUCTOS.appendChild(LI);
    }
};

function eliminarCarrito(producto_id)
{
    const ELEMENTO = document.getElementById(`carritoProducto${producto_id}`);

    ELEMENTO.remove();

    indicesSeleccionados.splice(indicesSeleccionados.indexOf(producto_id), 1);

    const INDICE_CARRITO = carrito.findIndex((elemento_actual) => elemento_actual.id === producto_id);
    console.log(INDICE_CARRITO);
    carrito.splice(INDICE_CARRITO, 1);
}

function simuladorHavannaGUI()
{
    cargarListadoProductos();
}

simuladorHavannaGUI();