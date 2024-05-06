// #region GLOBALES ---------------------------------------------------------------------
let productos = [];

let indicesSeleccionados = [];  //  Array con el que compruebo los productos que ya estén
                                //  en el carrito.

let carrito = [];   //  Array auxiliar para manipular el DOM correctamente.

//IMPUESTOS
//Valores expresados en % (al usarse se opera convirtiendo a su expresión decimal)
const IVA = 21;

// #region CARGA INICIAL ----------------------------------------------------------------
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
    const RESPONSE = await fetch("./data/productos.json");
    const DATA = await RESPONSE.json();
    productos = DATA;
    cargarCarrito();
};

// #region CARRITO ----------------------------------------------------------------------
function eliminarCarrito(producto_id)
{
    if (carrito.length === 1)   //  CONDICIÓN ADICIONAL SOLO PARA CHECKOUT
    {
        Swal.fire({
            title: '¿Vaciar carrito?',
            text: `Al vaciar el carrito volverás a la tienda`,
            icon: 'question',
            showDenyButton: 'true',                             //  Invertí los textos para
            denyButtonText: 'Si, vaciar y volver a la tienda',  //  aprovechar UX del alert
            confirmButtonText: 'No, continuar la compra'        //  (botón rojo en "deny" sin
        }).then((respuesta) => {                                //  agregar CSS específico)
            if (!respuesta.isConfirmed)
            {
                localStorage.removeItem("carrito"); //  Elimino el carrito en localStorage
                
                //  Y llevo al usuario de vuelta a la tienda

                let ID_PAGINA = "index.html";
        
                const LINK = new URL(`/${ID_PAGINA}`, window.location.origin);
        
                window.location.href = LINK;
            };
        });
    }
    else
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
    
        const Toast = Swal.mixin({
            toast: true,
            position: "bottom-start",
            showConfirmButton: false,
            showCloseButton: true,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
        });
        
        Toast.fire({
            icon: "success",
            title: "¡Producto eliminado del carrito!"
        });
    }
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

// #region SimuladorHavanna -------------------------------------------------------------
function simuladorHavannaCheckout()
{
    cargarProductos();

    const VACIAR_BUTTON = document.getElementById("vaciarCarrito");

    VACIAR_BUTTON.addEventListener("click", () => {
        Swal.fire({
            title: '¿Vaciar carrito?',
            text: `Al vaciar el carrito volverás a la tienda`,
            icon: 'question',
            showDenyButton: 'true',                             //  Invertí los textos para
            denyButtonText: 'Si, vaciar y volver a la tienda',  //  aprovechar UX del alert
            confirmButtonText: 'No, continuar la compra'        //  (botón rojo en "deny" sin
        }).then((respuesta) => {                                //  agregar CSS específico)
            if (!respuesta.isConfirmed)
            {
                localStorage.removeItem("carrito"); //  Elimino el carrito en localStorage
                
                //  Y llevo al usuario de vuelta a la tienda
                let ID_PAGINA = "index.html";
        
                const LINK = new URL(`/${ID_PAGINA}`, window.location.origin);
        
                window.location.href = LINK;
            };
        });
    });
};

simuladorHavannaCheckout();