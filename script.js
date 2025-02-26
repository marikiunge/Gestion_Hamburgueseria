// Obtener el último número de pedido del almacenamiento local
let lastOrder = localStorage.getItem("lastOrder");
let orderNumber;
if (lastOrder) {
    orderNumber = parseInt(lastOrder) + 1;
} else {
    orderNumber = 1;
}

let order = {
    number: orderNumber,
    products: [],
    total: 0
};


// Actualiza el número de pedido en la interfaz (lo pongo así porque si no, no me deja poner 001, 002, etc)
document.getElementById("orderNumber").innerText = String(order.number).padStart(3, "0");


// Función para agregar un producto al pedido
function addProduct(product) {
    // Limitar la cantidad de productos a 50
    if (order.products.length >= 50) {
        return;
    }
    product.extras = []; // Lista de extras
    product.extraPrices = {}; // Precios de los extras
    product.basePrice = product.price; // Precio base del producto
    order.products.push(product); 
    updateTotal();
    localStorage.setItem("lastOrder", order.number);
}



// Función para agregar o quitar ingredientes de un producto
function toggleExtra(productName, extraName, extraPrice) {
    // Buscar el último producto del mismo tipo en el pedido
    for (let i = order.products.length - 1; i >= 0; i--) { // Busca desde el último producto al primero
        if (order.products[i].name == productName) {
            let product = order.products[i];

            // Verificar si el extra ya está en la lista
            let extraIndex = product.extras.indexOf(extraName);
            if (extraIndex > -1) {
                // Eliminar extra
                product.extras.splice(extraIndex, 1);
                product.extraPrices[extraName] = 0;
            } else {
                // Agregar extra
                product.extras.push(extraName);
                product.extraPrices[extraName] = extraPrice;
            }
            updateTotal();
            return;
        }
    }
}




// Función para cambiar la cantidad de un producto
function updateQuantity(productName, quantity) {
    // Buscar el producto en el pedido
    for (let i = 0; i < order.products.length; i++) { 
        if (order.products[i].name == productName) {
            // Actualizar la cantidad
            order.products[i].quantity = quantity;
            updateTotal();
            return;
        }
    }
}




// Función para calcular y mostrar el total del pedido
function updateTotal() {
    let total = 0;
    let ticket = document.querySelector(".ovTicket");
    ticket.innerHTML = ""; 
    
    // Calcular el total y mostrar los productos en el ticket
    for (let i = 0; i < order.products.length; i++) {
        let product = order.products[i];
        // Calcular el precio del producto
        let productTotal = product.basePrice * product.quantity;
        let extrasList = "";
        
        // Calcular el precio de los extras
        for (let j = 0; j < product.extras.length; j++) {
            let extraName = product.extras[j];
            productTotal += product.extraPrices[extraName] * product.quantity;
            extrasList += " + " + extraName + " (€" + product.extraPrices[extraName].toFixed(2) + ")";
        }
        
        // Mostrar el producto en el ticket
        total += productTotal;
        ticket.innerHTML += "<p>" + product.quantity + "x " + product.name + " (€" + product.basePrice.toFixed(2) + ") " + extrasList + "</p><br>";
    }
    
    // Mostrar el total
    order.total = total;
    ticket.innerHTML += "<p><strong>Total: €" + total.toFixed(2) + "</strong></p>";
}




// Función para confirmar y enviar el pedido
function confirmOrder() {
    // No se puede enviar un pedido vacío
    if (order.products.length == 0) {
        return;
    }

    // Guardar el pedido en el almacenamiento local
    let orders = JSON.parse(localStorage.getItem("orders")) || []; // Si no hay pedidos, crea un array vacío
    orders.push(order); // Añade el pedido al array
    localStorage.setItem("orders", JSON.stringify(orders)); // Guarda el array en el almacenamiento local

    // Mostrar en la zona de estado
    let stateView = document.getElementById("stateView"); // Zona de estado
    let orderHTML = "<div class='orderItem'><br><p><strong>Pedido #" + order.number + "</strong></p><br>";
    
    // Mostrar los productos del pedido
    for (let i = 0; i < order.products.length; i++) {
        let product = order.products[i];
        let extrasList = "";
        let productTotal = product.basePrice * product.quantity; 

        // Calcular el precio total del producto
        for (let j = 0; j < product.extras.length; j++) {
            let extraName = product.extras[j];
            productTotal += product.extraPrices[extraName] * product.quantity;
            extrasList += " + " + extraName + " (€" + product.extraPrices[extraName].toFixed(2) + ")"; // Mostrar los extras en el pedido
        }

        orderHTML += "<p>" + product.quantity + "x " + product.name + " (€" + product.basePrice.toFixed(2) + ") " + extrasList + "</p><br>";
    }

    orderHTML += "<p><strong>Total: €" + order.total.toFixed(2) + "</strong></p></div>";
    stateView.innerHTML += orderHTML;

    // Incrementar el número de pedido y reiniciar el pedido
    localStorage.setItem("lastOrder", order.number + 1);

    order = {
        number: order.number + 1,
        products: [],
        total: 0
    };

    document.getElementById("orderNumber").innerText = String(order.number).padStart(3, "0"); 
    document.querySelector(".ovTicket").innerHTML = "";
}





// Manejadores de eventos para los productos
let productElements = document.querySelectorAll(".mainProduct");
for (let i = 0; i < productElements.length; i++) {
    // Agregar el producto al pedido al hacer clic
    productElements[i].addEventListener("click", function () {
        // Obtener el nombre y precio del producto
        let name = this.querySelector("img").alt;
        let price = parseFloat(this.querySelector("p").innerHTML.replace("€", ""));
        let product = { name: name, price: price, quantity: 1, extras: [], extraPrices: {} };
        
        addProduct(product);
    });
}




// Manejadores de eventos para los extras
let extraElements = document.querySelectorAll(".extraProduct");
for (let i = 0; i < extraElements.length; i++) {
    // Agregar o quitar el extra al producto al hacer clic
    extraElements[i].addEventListener("click", function () {
        let extraName = this.querySelector("img").alt; // Nombre del extra
        let extraPrice = parseFloat(this.querySelector("p").innerHTML.replace("€", ""));
        // Si hay productos en el pedido, añade el extra al último producto
        if (order.products.length > 0) {
            toggleExtra(order.products[order.products.length - 1].name, extraName, extraPrice);
        }
    });
}
