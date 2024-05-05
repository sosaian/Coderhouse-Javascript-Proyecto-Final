// Simulador Tienda Havanna
// Javascript | Coderhouse | PROYECTO FINAL | Ian SOSA

// Este es el proyecto final del curso: recrear la tienda "Havanna" online.
// Intencionalmente aplico los conceptos que aprendimos hasta ahora en las clases...
// (Condicionales; ciclos; funciones; objetos; arrays; high-order functions;
// DOM; Eventos; localStorage; JSON; Sugar Syntax; Librerías; Asincronía; AJAX)
// ergo es probable que hayan formas más óptimas de escalar el código a futuro.

// LIBRERÍAS USADAS:
// SweetAlert2 - Documentación: https://sweetalert2.github.io/

// #region GLOBALES ---------------------------------------------------------------------
let productos = [];

let indicesSeleccionados = [];  //  Array con el que compruebo los productos que ya estén
                                //  en el carrito.

let carrito = [];   //  Array auxiliar para manipular el DOM correctamente.

//IMPUESTOS
//Valores expresados en % (al usarse se opera convirtiendo a su expresión decimal)
const IVA = 21;

// #region CARGA INICIAL ----------------------------------------------------------------
function cargarListadoProductos()
{
    const LISTADO_PRODUCTOS = document.getElementById("listadoProductos");
    LISTADO_PRODUCTOS.textContent = ""; //  Limpio el mensaje de error para cargar los
                                        //  productos (estoy asumiendo que siempre voy a
                                        //  tener productos disponibles para mostrar...)

    productos.forEach(producto => {
        const LI = document.createElement("li");
        
        const PRODUCTO_ID = productos.indexOf(producto);    //  Uso esta constante auxiliar
                                                            //  para asegurarme de no volver
                                                            //  a recorrer todo el array de
                                                            //  productos (escala mejor).
        
        LI.setAttribute("data-id", PRODUCTO_ID);    //  "data-id" lo uso para aprovechar que
                                                    //  PRODUCTOS es un array de objetos
                                                    //  indexado. Quizás a futuro use otra
                                                    //  forma de quizas no dejar expuesta
                                                    //  la ID del producto...

        const IMG = document.createElement("img");
        IMG.setAttribute("src", "https://placehold.co/75x100");

        const DIV_NOMBRE = document.createElement("div");
        DIV_NOMBRE.textContent = producto.nombre;
        
        const DIV_PRECIO = document.createElement("div");
        DIV_PRECIO.textContent = `$ ${producto.precio}`;

        const AGREGAR_AL_CARRITO = document.createElement("input");
        AGREGAR_AL_CARRITO.setAttribute("type", "button");
        AGREGAR_AL_CARRITO.setAttribute("value", "Agregar al carrito");

        AGREGAR_AL_CARRITO.addEventListener("click", () => agregarCarrito(PRODUCTO_ID));
        
        LI.appendChild(IMG);
        LI.appendChild(DIV_NOMBRE);
        LI.appendChild(DIV_PRECIO);
        LI.appendChild(AGREGAR_AL_CARRITO);
        LISTADO_PRODUCTOS.appendChild(LI);
    });
};

function cargarCarrito()
{
    const BACKUP_CARRITO = JSON.parse(localStorage.getItem("carrito"));
    
    if (BACKUP_CARRITO !== null)
    {   
        carrito = BACKUP_CARRITO;

        const CARRITO_PRODUCTOS = document.getElementById("carritoProductos");
        CARRITO_PRODUCTOS.textContent = "";
        CARRITO_PRODUCTOS.classList.toggle("carritoVacio");

        carrito.forEach((producto) => {
            indicesSeleccionados.push(producto.id);

            const LI = document.createElement("li");
            LI.id = `carritoProducto${producto.id}`;

            const IMG = document.createElement("img");
            IMG.setAttribute("src", "https://placehold.co/50x75");
            LI.appendChild(IMG);
            
            const DIV_NOMBRE = document.createElement("div");
            DIV_NOMBRE.textContent = productos[producto.id].nombre;
            LI.appendChild(DIV_NOMBRE);
            
            const DIV_CANTIDAD_LABEL = document.createElement("div");
            DIV_CANTIDAD_LABEL.textContent = "Cantidad: ";
            LI.appendChild(DIV_CANTIDAD_LABEL);
            
            const DIV_CANTIDAD_CONTAINER = document.createElement("div");

            const BUTTON_REDUCIR = document.createElement("input");
            BUTTON_REDUCIR.setAttribute("type", "button");
            BUTTON_REDUCIR.setAttribute("value","➖");
            BUTTON_REDUCIR.addEventListener("click", () => {
                let cantidad = parseInt(DIV_CANTIDAD.textContent);
                
                if (cantidad > 1)
                {
                    DIV_CANTIDAD.textContent = cantidad - 1;
                    carrito[indicesSeleccionados.indexOf(producto.id)].cantidad--;
                    calcularTotal();
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                };
            });
            DIV_CANTIDAD_CONTAINER.appendChild(BUTTON_REDUCIR);
            
            const DIV_CANTIDAD = document.createElement("div");
            DIV_CANTIDAD.textContent = carrito[indicesSeleccionados.indexOf(producto.id)].cantidad;
            DIV_CANTIDAD_CONTAINER.appendChild(DIV_CANTIDAD);

            const BUTTON_AUMENTAR = document.createElement("input");
            BUTTON_AUMENTAR.setAttribute("type", "button");
            BUTTON_AUMENTAR.setAttribute("value","➕");
            BUTTON_AUMENTAR.addEventListener("click", () => {
                let cantidad = parseInt(DIV_CANTIDAD.textContent);
                DIV_CANTIDAD.textContent = cantidad + 1;
                carrito[indicesSeleccionados.indexOf(producto.id)].cantidad++;
                calcularTotal();
                localStorage.setItem("carrito", JSON.stringify(carrito));
            });
            DIV_CANTIDAD_CONTAINER.appendChild(BUTTON_AUMENTAR);

            LI.appendChild(DIV_CANTIDAD_CONTAINER);
    
            const BUTTON_ELIMINAR = document.createElement("input");
            BUTTON_ELIMINAR.setAttribute("type", "button");
            BUTTON_ELIMINAR.setAttribute("value", "❎");
    
            BUTTON_ELIMINAR.addEventListener("click", () => eliminarCarrito(producto.id));
    
            LI.appendChild(BUTTON_ELIMINAR);
    
            CARRITO_PRODUCTOS.appendChild(LI);
        });

        calcularTotal();
    };
};

async function cargarProductos()
{
    const RESPONSE = await fetch("./data/productos.json");  //  Agarro JSON de productos.
    const DATA = await RESPONSE.json();                     //  Convierto en array de objetos,

    productos = DATA;                                       //  y lo cargo globalmente.
    
    cargarListadoProductos();                               //  Una vez terminado, ejecuto
    cargarCarrito();                                        //  las demás cargas iniciales.
};


// #region CARRITO ----------------------------------------------------------------------
function agregarCarrito(producto_id)
{   
    const CARRITO_PRODUCTOS = document.getElementById("carritoProductos");

    if (carrito.length === 0)
    {
        CARRITO_PRODUCTOS.textContent = "";
        CARRITO_PRODUCTOS.classList.toggle("carritoVacio");
    };

    if (indicesSeleccionados.includes(producto_id))
    {   
        const INDICE = carrito.findIndex((elemento_actual) => elemento_actual.id === producto_id);
        carrito[INDICE].cantidad += 1;

        const LI_PRODUCTO = document.getElementById(`carritoProducto${producto_id}`);
        
        let cantidadProducto = parseInt(LI_PRODUCTO.children[2].children[1].textContent);
        LI_PRODUCTO.children[2].children[1].textContent = cantidadProducto + 1;
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

        const IMG = document.createElement("img");
        IMG.setAttribute("src", "https://placehold.co/50x75");
        LI.appendChild(IMG);
        
        const DIV_NOMBRE = document.createElement("div");
        DIV_NOMBRE.textContent = productos[producto_id].nombre;
        LI.appendChild(DIV_NOMBRE);
        
        const DIV_CANTIDAD_LABEL = document.createElement("div");
        DIV_CANTIDAD_LABEL.textContent = "Cantidad: ";
        LI.appendChild(DIV_CANTIDAD_LABEL);

        const DIV_CANTIDAD_CONTAINER = document.createElement("div");

        const BUTTON_REDUCIR = document.createElement("input");
        BUTTON_REDUCIR.setAttribute("type", "button");
        BUTTON_REDUCIR.setAttribute("value","➖");
        BUTTON_REDUCIR.addEventListener("click", () => {
            let cantidad = parseInt(DIV_CANTIDAD.textContent);
            
            if (cantidad > 1)
            {
                DIV_CANTIDAD.textContent = cantidad - 1;
                carrito[indicesSeleccionados.indexOf(producto_id)].cantidad--;
                calcularTotal();
                localStorage.setItem("carrito", JSON.stringify(carrito));
            };
        });
        DIV_CANTIDAD_CONTAINER.appendChild(BUTTON_REDUCIR);
        
        const DIV_CANTIDAD = document.createElement("div");
        DIV_CANTIDAD.textContent = 1;
        DIV_CANTIDAD_CONTAINER.appendChild(DIV_CANTIDAD);

        const BUTTON_AUMENTAR = document.createElement("input");
        BUTTON_AUMENTAR.setAttribute("type", "button");
        BUTTON_AUMENTAR.setAttribute("value","➕");
        BUTTON_AUMENTAR.addEventListener("click", () => {
            let cantidad = parseInt(DIV_CANTIDAD.textContent);
            DIV_CANTIDAD.textContent = cantidad + 1;
            carrito[indicesSeleccionados.indexOf(producto_id)].cantidad++;
            calcularTotal();
            localStorage.setItem("carrito", JSON.stringify(carrito));
        });
        DIV_CANTIDAD_CONTAINER.appendChild(BUTTON_AUMENTAR);

        LI.appendChild(DIV_CANTIDAD_CONTAINER);

        const BUTTON_ELIMINAR = document.createElement("input");
        BUTTON_ELIMINAR.setAttribute("type", "button");
        BUTTON_ELIMINAR.setAttribute("value","❎");

        BUTTON_ELIMINAR.addEventListener("click", () => eliminarCarrito(producto_id));

        LI.appendChild(BUTTON_ELIMINAR);

        CARRITO_PRODUCTOS.appendChild(LI);
    }

    calcularTotal();
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

function eliminarCarrito(producto_id)
{
    const ELEMENTO = document.getElementById(`carritoProducto${producto_id}`);

    ELEMENTO.remove();

    indicesSeleccionados.splice(indicesSeleccionados.indexOf(producto_id), 1);

    const INDICE_CARRITO = carrito.findIndex((elemento_actual) => elemento_actual.id === producto_id);
    carrito.splice(INDICE_CARRITO, 1);

    if (carrito.length === 0)
    {
        const CARRITO_PRODUCTOS = document.getElementById("carritoProductos");
        CARRITO_PRODUCTOS.textContent = "¡Carrito vacío! Selecciona algún producto para comprar 😁";
        CARRITO_PRODUCTOS.classList.toggle("carritoVacio");
        localStorage.removeItem("carrito");
    }
    else
    {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    };

    calcularTotal();
};

function calcularTotal()
{
    const TOTAL = document.getElementById("totalCarrito");
    
    if (carrito.length === 0)
    {
        TOTAL.textContent = "0.00";
        return;
    };

    let precio_total = 0.0;
    
    carrito.forEach((producto) => {
        let subtotal = 0.0;
       
        let descuento = ((100 - productos[producto.id].descuento) / 100);

        subtotal = productos[producto.id].precio * descuento;
        
        subtotal *= producto.cantidad;   //NOTA: NO contemplo casos del tipo "2da unidad al 50%" en este algoritmo.

        precio_total += subtotal;
    });

    precio_total *= 1 + (IVA / 100);   //Agrego impuestos (IVA).

    TOTAL.textContent = precio_total;
};

// #region COMPRA -----------------------------------------------------------------------
function iniciarCompra()
{
    const TOTAL = document.getElementById("totalCarrito");

    Swal.fire({
        title: '¿Continuar con la compra?',
        text: `El costo total es de $${parseFloat(TOTAL.textContent)}`,
        icon: 'question',
        showDenyButton: 'true',
        denyButtonText: 'No, continuar comprando',
        confirmButtonText: 'Si, terminar compra'
    }).then((respuesta) => {
        if (respuesta.isConfirmed)
        {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
            });
            
            Toast.fire({
                icon: "success",
                title: "¡Compra realizada con éxito!"
            });

            vaciarCarrito();
        };
    });
};

function vaciarCarrito()
{
    const CARRITO_PRODUCTOS = document.getElementById("carritoProductos");

    for (elemento of CARRITO_PRODUCTOS.children)
    {
        elemento.remove();  //  Elimino todos los productos del carrito.
    };

    CARRITO_PRODUCTOS.textContent = "¡Carrito vacío! Selecciona algún producto para comprar 😁";
    CARRITO_PRODUCTOS.classList.toggle("carritoVacio");
    
    //  Vacío tanto el localStorage como los array indicesSeleccionados y carrito.
    localStorage.removeItem("carrito");
    indicesSeleccionados = [];
    carrito = [];

    //  Reinicio el valor de TOTAL en el carrito.
    const TOTAL = document.getElementById("totalCarrito");
    TOTAL.textContent = "0.00";
};

// #region BUSCADOR ---------------------------------------------------------------------

function chequearBuscador(nombre_producto)
{
    //  Uso "aux" para hacer más legible la línea de código donde cargo RESULTADO con los resultados
    //  de la búsqueda... filter realiza una BÚSQUEDA LINEAL, por lo que no escala bien, pero para
    //  este proyecto es correcto dada la poca cantidad de productos que uso.

    //  Uso toUpperCase() para no hacer la búsqueda case-sensitive; uso trim() para ignorar el padding.

    let aux = nombre_producto.toUpperCase().trim();

    const RESULTADO = productos.filter(producto => producto.nombre.toUpperCase().includes(aux));

    if(RESULTADO.length === 0)
    {
        console.log("No tenemos un producto con ese nombre... 😢");
        return;
    };

    vaciarListadoProductos();

    cargarListadoProductosBuscador(RESULTADO);
};

function vaciarListadoProductos()
{
    const LISTADO_PRODUCTOS = document.getElementById("listadoProductos");

    while (LISTADO_PRODUCTOS.firstChild)
    {
        LISTADO_PRODUCTOS.removeChild(LISTADO_PRODUCTOS.firstChild);
    };
}

function cargarListadoProductosBuscador(resultado_busqueda)
{
    const LISTADO_PRODUCTOS = document.getElementById("listadoProductos");

    resultado_busqueda.forEach(producto => {
        const LI = document.createElement("li");
        
        const PRODUCTO_ID = resultado_busqueda.indexOf(producto);    //  Uso esta constante auxiliar
                                                            //  para asegurarme de no volver
                                                            //  a recorrer todo el array de
                                                            //  resultado_busqueda (escala mejor).
        
        LI.setAttribute("data-id", PRODUCTO_ID);    //  "data-id" lo uso para aprovechar que
                                                    //  PRODUCTOS es un array de objetos
                                                    //  indexado. Quizás a futuro use otra
                                                    //  forma de quizas no dejar expuesta
                                                    //  la ID del producto...

        const IMG = document.createElement("img");
        IMG.setAttribute("src", "https://placehold.co/75x100");

        const DIV_NOMBRE = document.createElement("div");
        DIV_NOMBRE.textContent = producto.nombre;
        
        const DIV_PRECIO = document.createElement("div");
        DIV_PRECIO.textContent = `$ ${producto.precio}`;

        const AGREGAR_AL_CARRITO = document.createElement("input");
        AGREGAR_AL_CARRITO.setAttribute("type", "button");
        AGREGAR_AL_CARRITO.setAttribute("value", "Agregar al carrito");

        AGREGAR_AL_CARRITO.addEventListener("click", () => agregarCarrito(PRODUCTO_ID));
        
        LI.appendChild(IMG);
        LI.appendChild(DIV_NOMBRE);
        LI.appendChild(DIV_PRECIO);
        LI.appendChild(AGREGAR_AL_CARRITO);
        LISTADO_PRODUCTOS.appendChild(LI);
    });
}

// #region SimuladorHavanna -------------------------------------------------------------

function simuladorHavannaGUI()
{
    cargarProductos();

    const VACIAR_BUTTON = document.getElementById("vaciarCarrito");

    VACIAR_BUTTON.addEventListener("click", () => (carrito.length === 0) || vaciarCarrito());

    const COMPRAR_BUTTON = document.getElementById("comprarCarrito");

    COMPRAR_BUTTON.addEventListener("click", () => (carrito.length === 0) || iniciarCompra());

    const BUSCADOR_INPUT = document.getElementById('buscadorInput');

    BUSCADOR_INPUT.focus();
    
    BUSCADOR_INPUT.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" || BUSCADOR_INPUT.value.trim() === "")
            return;
        
        e.preventDefault();
        chequearBuscador(BUSCADOR_INPUT.value);
    });
    
    const BUSCADOR_BUTTON = document.getElementById('buscadorButton');

    BUSCADOR_BUTTON.addEventListener("click", () => chequearBuscador(BUSCADOR_INPUT.value));
};

simuladorHavannaGUI();