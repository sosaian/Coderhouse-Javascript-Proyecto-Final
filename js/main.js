// Simulador Tienda Havanna CLI
// Javascript | Coderhouse | PRE-ENTREGA 2 | Ian SOSA

// Este algoritmo representa una versión primitiva del proyecto final: recrear la tienda "Havanna" online.
// Intencionalmente aplico los conceptos que aprendimos hasta ahora en las clases...
// (Condicionales; ciclos; funciones; objetos; arrays; high-order functions)
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
]

//IMPUESTOS
//Valores expresados en % (al usarse se opera convirtiendo a su expresión decimal)
const IVA = 21;

function seleccionarProducto() {
    let seguir_ciclando = false;
    let respuesta = 0;

    do {
        
        if (seguir_ciclando) {
            
            alert(`ERROR: Por favor, ingrese el número correspondiente al producto que desea comprar (1, 2 o 3).`);
        }
        
        //Para este prompt uso backticks (`) considerando que hace más legible el código.

        respuesta = parseInt( prompt(`Estos son los productos disponibles ahora:
        \n  1: Alfajores 70% Cacao Puro x9 unidades - $16,500 (¡Hoy 25% off!)
        \n  2: Havannets de coco 70% Cacao x6 unidades - $6,700
        \n  3: Galletitas de limón x12 unidades - $9,000
        \nSeleccione el producto a comprar:`) );
        
        seguir_ciclando = !respuesta || respuesta < 1 || respuesta > PRODUCTOS.length;
    }
    while (seguir_ciclando);
    
    return respuesta;
}
 
function seleccionarCantidad() {
    let seguir_ciclando = false;
    
    let respuesta = "Cualquier cosa"; //Aprovecho las variables de TIPO DINAMICO de JS mejorar legibilidad.
    
    do {
        
        if (seguir_ciclando) {
            
            alert("ERROR\nLa cantidad ingresada debe ser un número entero mayor que cero.\nPor favor, ingrese nuevamente");
        }
        
        respuesta = parseInt(prompt("Ingrese la cantidad de cajas que va a llevar del producto"));
        
        seguir_ciclando = isNaN(respuesta) || respuesta < 0;
    }
    while (seguir_ciclando);
    
    return respuesta;
}

function calcularPrecioFinal(carrito) {
    let total = 0.0;
    let subtotal = 0.0;

    //Se asume que producto y cantidad ya fueron validados antes de invocarse esta función.

    for (producto of carrito)
    {
        subtotal = PRODUCTOS[producto.id].precio * ((100 - PRODUCTOS[producto.id].descuento) / 100);
        
        subtotal *= producto.cantidad;   //NOTA: NO contemplo casos del tipo "2da unidad al 50%" en este algoritmo.

        total += subtotal;
    }
    
    total *= 1 + (IVA / 100);   //Agrego impuestos (IVA).
    
    return total.toFixed(2);    //Redondeo a 2 decimales para expresar moneda.
}

function mostrarPrecioFinal(precio) {
    alert("El precio final es: $" + precio);
}

function simuladorHavannaCLI() {    
    let producto_id = 0;
    let cantidad = 0;
    let carrito = [];
    let indicesSeleccionados = [];
    let agregar_mas_productos = false;

    do {
        producto_id = seleccionarProducto();
        cantidad = seleccionarCantidad();
        
        if (agregar_mas_productos && indicesSeleccionados.includes(producto_id))
        {
            carrito[producto_id - 1].cantidad += cantidad;
        }
        else
        {
            indicesSeleccionados.push(producto_id);

            carrito.push(
                {
                    //  Elijo intencionalmente qué propiedades cargar al carrito
                    //  Para controlar qué información expongo al usuario...
                    id: producto_id - 1,
                    cantidad: cantidad
                }
            );
        }

        let mensajeCarrito = "CARRITO:\n";

        for (let producto of carrito)
        {
            mensajeCarrito += "x" + producto.cantidad + " " + PRODUCTOS[producto.id].nombre + "\n";
        }

        mensajeCarrito += "\n¿Quieres agregar más productos?";

        agregar_mas_productos = confirm(mensajeCarrito) ? true : false;
    }
    while(agregar_mas_productos);
    
    let total = calcularPrecioFinal(carrito);
    
    mostrarPrecioFinal(total);
}

simuladorHavannaCLI();