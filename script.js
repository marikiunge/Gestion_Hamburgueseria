// Definimos los productos y sus precios
const products = [
    { name: "Hamburguesa", price: 5.00, baseIngredients: ["Pan", "Carne", "Lechuga", "Tomate", "Queso"] },
    { name: "Perrito caliente", price: 3.50, baseIngredients: ["Pan", "Salchicha", "Ketchup", "Mostaza"] },
    { name: "Sandwich", price: 4.00, baseIngredients: ["Pan", "Jamón", "Queso", "Tomate"] }
];

const ingredients = [
    { name: "Champiñones", price: 0.50 },
    { name: "Bacon", price: 0.50 },
    { name: "Huevo", price: 0.50 },
    { name: "Cebolla caramelizada", price: 0.50 },
    { name: "Jalapeños", price: 0.50 },
    { name: "Mayonesa especial", price: 0.50 }
];

const baseIngredients = [
    { name: "Tomate" },
    { name: "Queso" },
    { name: "Lechuga" },
    { name: "Mostaza" },
    { name: "Ketchup" }
];

const extras = [
    { name: "Patatas fritas", price: 2.00 },
    { name: "Ensalada", price: 1.50 },
    { name: "Aros de cebolla", price: 2.50 },
    { name: "Agua", price: 1.00 },
    { name: "Coca cola", price: 1.50 },
    { name: "Cerveza", price: 2.00 }
];

// Obtenemos el último número de pedido del almacenamiento local
let lastOrder = localStorage.getItem("lastOrder");
let orderNumber = lastOrder ? parseInt(lastOrder) + 1 : 1; // Si no hay pedidos, el número de pedido es 1

let order = { 
    number: orderNumber,
    products: [],
    extras: [],
    total: 0
};

// Actualiza el número de pedido en la interfaz
document.getElementById("orderNumber").innerText = String(order.number).padStart(3, "0");

// Función para agregar un producto al pedido
function addProduct(product) {
    // Limitar la cantidad de productos a 50
    if (order.products.length >= 50) {
        return;
    }
    product.extras = []; // Lista de extras
    product.extraPrices = {}; // Precios de los extras
    product.baseIngredients = product.baseIngredients.slice(); // Copia de los ingredientes base
    product.basePrice = product.price; // Precio base del producto
    order.products.push(product); 
    updateTotal();
    localStorage.setItem("lastOrder", order.number);
}

// Función para agregar o quitar ingredientes de un producto
function toggleExtra(productName, extraName, extraPrice) {
    // Buscar el último producto del mismo tipo en el pedido
    for (let i = order.products.length - 1; i >= 0; i--) {
        if (order.products[i].name == productName) {
            let product = order.products[i];

            // Verificar si el extra ya está en la lista
            let extraIndex = product.extras.indexOf(extraName);
            if (extraIndex > -1) {
                // Eliminar extra
                product.extras.splice(extraIndex, 1);
                delete product.extraPrices[extraName];
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

// Función para agregar o quitar ingredientes base de un producto
function toggleBaseIngredient(productName, ingredientName) {
    // Buscar el último producto del mismo tipo en el pedido
    for (let i = order.products.length - 1; i >= 0; i--) {
        if (order.products[i].name == productName) {
            let product = order.products[i];

            // Verificar si el ingrediente base ya está en la lista
            let ingredientIndex = product.baseIngredients.indexOf(ingredientName);
            if (ingredientIndex > -1) {
                // Eliminar ingrediente base
                product.baseIngredients.splice(ingredientIndex, 1);
            } else {
                // Agregar ingrediente base
                product.baseIngredients.push(ingredientName);
            }
            updateTotal();
            return;
        }
    }
}

// Función para cambiar la cantidad de un extra
function updateExtra(extraName, quantity) {
    // Limitar la cantidad de extras a 50
    if (quantity > 50) {
        quantity = 50;
    }
    // Buscar el extra en el pedido
    for (let i = 0; i < order.extras.length; i++) {
        if (order.extras[i].name == extraName) {
            if (quantity > 0) {
                // Actualizar la cantidad
                order.extras[i].quantity = quantity;
            } else {
                // Eliminar el extra si la cantidad es 0
                order.extras.splice(i, 1);
            }
            updateTotal();
            return;
        }
    }
    // Si el extra no está en el pedido y la cantidad es mayor que 0, agregarlo
    if (quantity > 0) {
        let extra = extras.find(function(extra) {
            return extra.name == extraName;
        });
        if (extra) {
            order.extras.push({ name: extraName, price: extra.price, quantity: quantity });
            updateTotal();
        }
    }
}

// Función para calcular y mostrar el total del pedido
function updateTotal() {
    let total = 0;
    let ticket = document.querySelector(".ovTicket table");
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
            extrasList += "<tr><td>Extra " + extraName + "</td><td>€" + product.extraPrices[extraName].toFixed(2) + "</td></tr>";
        }
        
        // Mostrar el producto en el ticket
        total += productTotal;
        ticket.innerHTML += "<tr><td>" + product.quantity + "x " + product.name + "</td><td>€" + product.basePrice.toFixed(2) + "</td></tr>" + extrasList;
    }
    
    // Calcular el total y mostrar los extras en el ticket
    for (let i = 0; i < order.extras.length; i++) {
        let extra = order.extras[i];
        if (extra.quantity > 0) {
            let extraTotal = extra.price * extra.quantity;
            total += extraTotal;
            ticket.innerHTML += "<tr><td>" + extra.quantity + "x " + extra.name + "</td><td>€" + extraTotal.toFixed(2) + "</td></tr>";
        }
    }
    
    // Mostrar el total
    order.total = total;
    document.querySelector(".billPrice").innerText = "€" + total.toFixed(2);
}

// Función para confirmar y enviar el pedido
function confirmOrder() {
    // No se puede enviar un pedido vacío
    if (order.products.length == 0 && order.extras.length == 0) {
        return;
    }

    // Guardar el pedido en el almacenamiento local
    let orders = JSON.parse(localStorage.getItem("orders")) || []; // Si no hay pedidos, crea un array vacío
    orders.push(order); // Añade el pedido al array
    localStorage.setItem("orders", JSON.stringify(orders)); // Guarda el array en el almacenamiento local

    // Mostrar en la zona de estado
    let stateView = document.getElementById("stateView"); // Zona de estado
    let orderHTML = "<tr><td>" + String(order.number).padStart(3, "0") + "</td><td><button>¡Recoger!</button></td></tr>";
    stateView.querySelector("table").innerHTML += orderHTML;

    // Incrementar el número de pedido y reiniciar el pedido
    localStorage.setItem("lastOrder", order.number + 1);

    order = {
        number: order.number + 1,
        products: [],
        extras: [],
        total: 0
    };

    document.getElementById("orderNumber").innerText = String(order.number).padStart(3, "0"); 
    document.querySelector(".ovTicket table").innerHTML = "";
    document.querySelector(".billPrice").innerText = "€0.00";

    // Restablecer los ingredientes base a su estado original
    let baseIngredientElements = document.querySelectorAll("#originalIngredients img");
    for (let i = 0; i < baseIngredientElements.length; i++) {
        baseIngredientElements[i].classList.remove("removed");
    }

    // Restablecer los ingredientes adicionales a su estado original
    let ingredientElements = document.querySelectorAll("#additionalIngredients img");
    for (let i = 0; i < ingredientElements.length; i++) {
        ingredientElements[i].classList.remove("selected");
    }

    // Restablecer los extras a su estado original
    let extraElements = document.querySelectorAll(".extraProduct");
    for (let i = 0; i < extraElements.length; i++) {
        extraElements[i].querySelector(".stepper p").innerText = "0";
        extraElements[i].querySelector(".stepper button:nth-child(3)").disabled = false;
    }

}

// Manejadores de eventos para los productos
let productElements = document.querySelectorAll(".ovProduct div");
for (let i = 0; i < productElements.length; i++) {
    // Agregar el producto al pedido al hacer clic
    productElements[i].addEventListener("click", function () {
        // Obtener el nombre del producto
        let name = this.querySelector("img").alt;
        let product = products.find(function(p) {
            return p.name === name;
        });
        product = {
            name: product.name,
            price: product.price,
            baseIngredients: product.baseIngredients.slice(),
            quantity: 1,
            extras: [],
            extraPrices: {},
            basePrice: product.price
        };
        
        addProduct(product);
    });
}

// Manejadores de eventos para los ingredientes base
let baseIngredientElements = document.querySelectorAll("#originalIngredients img");
for (let i = 0; i < baseIngredientElements.length; i++) {
    // Agregar o quitar el ingrediente base al producto al hacer clic
    baseIngredientElements[i].addEventListener("click", function () {
        let ingredientName = this.alt; // Nombre del ingrediente base
        // Si hay productos en el pedido, añade el ingrediente base al último producto
        if (order.products.length > 0) {
            toggleBaseIngredient(order.products[order.products.length - 1].name, ingredientName);
            this.classList.toggle("removed"); // Añade o quita la clase "removed" al hacer clic
        }
    });
}

// Manejadores de eventos para los ingredientes adicionales
let ingredientElements = document.querySelectorAll("#additionalIngredients img");
for (let i = 0; i < ingredientElements.length; i++) {
    // Agregar o quitar el ingrediente adicional al producto al hacer clic
    ingredientElements[i].addEventListener("click", function () {
        let extraName = this.alt; // Nombre del ingrediente adicional
        let extra = ingredients.find(function(e) {
            return e.name == extraName;
        });
        // Si hay productos en el pedido, añade el ingrediente adicional al último producto
        if (order.products.length > 0) {
            toggleExtra(order.products[order.products.length - 1].name, extra.name, extra.price);
            this.classList.toggle("selected");
        }
        
    });
}

// Manejadores de eventos para los extras
let extraElements = document.querySelectorAll(".extraProduct");
for (let i = 0; i < extraElements.length; i++) {
    // Agregar o quitar el extra al hacer clic en los botones de + o -
    extraElements[i].querySelector(".stepper button:nth-child(1)").addEventListener("click", function () {
        let extraName = extraElements[i].querySelector("img").alt;
        let extra = extras.find(function(e) {
            return e.name == extraName;
        });
        let quantity = parseInt(extraElements[i].querySelector(".stepper p").innerText);
        if (quantity > 0) {
            quantity--;
            extraElements[i].querySelector(".stepper p").innerText = quantity;
            updateExtra(extra.name, quantity);
            // Habilitar el botón de incremento si la cantidad es menor que 50
            if (quantity < 50) {
                extraElements[i].querySelector(".stepper button:nth-child(3)").disabled = false;
            }
        }
    });
    extraElements[i].querySelector(".stepper button:nth-child(3)").addEventListener("click", function () {
        let extraName = extraElements[i].querySelector("img").alt;
        let extra = extras.find(function(e) {
            return e.name == extraName;
        });
        let quantity = parseInt(extraElements[i].querySelector(".stepper p").innerText);
        if (quantity < 50) {
            quantity++;
            extraElements[i].querySelector(".stepper p").innerText = quantity;
            updateExtra(extra.name, quantity);
            // Deshabilitar el botón de incremento si la cantidad es 50
            if (quantity == 50) {
                this.disabled = true;
            }
        }
    });
}

// Manejador de evento para el botón de "Realizar pedido"
document.querySelector(".ctaButton").addEventListener("click", confirmOrder);