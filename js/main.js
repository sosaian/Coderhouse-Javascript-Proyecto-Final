// Simulador Tienda Havanna CLI
// Javascript | Coderhouse | PRE-ENTREGA 1 | Ian SOSA

// Este algoritmo representa una versión primitiva del proyecto final: recrear la tienda "Havanna" online.
// Intencionalmente aplico los conceptos que aprendimos hasta ahora en las clases
// (Condicionales; ciclos; funciones) ergo es probable que hayan formas más óptimas de escalar el código.

function seleccionarProducto() {
    let seguir_ciclando = false;
    let respuesta = 0;

    do {
        
        if (seguir_ciclando) {
            
            alert(`ERROR, por favor ingrese el número de opción entre los disponibles.`);
        }
        
        //Para este prompt uso backticks (`) considerando que hace más legible el código.

        respuesta = parseInt( prompt(`Estos son los productos disponibles ahora:
        \n  1: Alfajores 70% Cacao Puro x9 unidades - $16,500 (¡Hoy 25% off!)
        \n  2: Havannets de coco 70% Cacao x6 unidades - $6,700
        \n  3: Galletitas de limón x12 unidades - $9,000
        \nSeleccione el producto a comprar:`) );
        
        seguir_ciclando = respuesta !== 1 && respuesta !== 2 && respuesta!== 3;
    }
    while (seguir_ciclando);
    
    return respuesta;
}
 
function seleccionarCantidad() {
    let seguir_ciclando = false;
    
    let respuesta = 0;
    
    do {
        
        if (seguir_ciclando) {
            
            alert(`ERROR, por favor ingrese una cantidad de unidades mayor a cero.`);
        }
        
        respuesta = parseInt(prompt("Ingrese la cantidad de cajas que va a llevar del producto:"));
        
        seguir_ciclando = Number(respuesta) && respuesta < 1;
    }
    while (seguir_ciclando);
    
    return respuesta;
}

function calcularPrecioFinal(producto, cantidad) {
    //PRECIOS
    const PROD_1_PRECIO = 16500.00;
    const PROD_2_PRECIO = 6700.00;
    const PROD_3_PRECIO = 2500.00;

    //DESCUENTOS
    //Valores expresados en % (al usarse se opera convirtiendo a su expresión decimal)
    const PROD_1_DESCUENTO = 25;
    const PROD_2_DESCUENTO = 0;
    const PROD_3_DESCUENTO = 0;
    
    //IMPUESTOS
    //Valores expresados en % (al usarse se opera convirtiendo a su expresión decimal)
    const IVA = 21;

    let total = 0.0;
    
    switch (producto) {
        
        case 1: total += PROD_1_PRECIO * ((100 - PROD_1_DESCUENTO) / 100);
        break;
        
        case 2: total = PROD_2_PRECIO * ((100 - PROD_2_DESCUENTO) / 100);
        break;
        
        case 3: total = PROD_3_PRECIO * ((100 - PROD_3_DESCUENTO) / 100);
        break;
    }
    
    total *= cantidad;          //NOTA: NO contemplo casos del tipo "2da unidad al 50%" en este algoritmo.
    
    total *= 1 + (IVA / 100);   //Agrego impuestos (IVA).
    
    return total.toFixed(2);    //Redondeo a 2 decimales para expresar moneda.
}

function mostrarPrecioFinal(precio) {
    alert("El precio final es: $" + precio);
}

function simuladorHavannaCLI() {    
    let producto = seleccionarProducto();
    let cantidad = seleccionarCantidad();
    
    let total = calcularPrecioFinal(producto, cantidad);
    
    mostrarPrecioFinal(total);
}

simuladorHavannaCLI();