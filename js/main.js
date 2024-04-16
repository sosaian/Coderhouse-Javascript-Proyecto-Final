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
    let producto_id = parseInt(ELEMENTO.getAttribute("data-id"));

    if (indicesSeleccionados.includes(producto_id))
    {
        carrito[producto_id].cantidad += 1;
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
    }

    console.log(carrito);
};

function simuladorHavannaGUI()
{
    cargarListadoProductos();
}

simuladorHavannaGUI();