const products = {
    burger: {
        name: 'Hamburgesa',
        price: 500,
        ingredients: ['burgerBread', 'burgerMeat', 'lettuce', 'tomato', 'cheese']
    },
    hotdog: {
        name: 'Hot Dog',
        price: 350,
        ingredients: ['hotdogBread', 'sausage', 'ketchup', 'mustard']
    },
    sandwich: {
        name: 'Sandwich',
        price: 400,
        ingredients: ['sandwichBread', 'ham', 'lettuce', 'tomato', 'cheese']
    }
}

const baseIngredients = {
    burgerBread: {
        src: './imgs/burgerbread.webp',
        alt: 'Pan de hamburguesa',
    },
    hotdogBread: {
        src: './imgs/hotdogbread.png',
        alt: 'Pan de perrito caliente',
    },
    sandwichBread: {
        src: './imgs/slicedBread.png',
        alt: 'Pan de molde',
    },
    burgerMeat: {
        src: './imgs/patty.webp',
        alt: 'Carne de hamburguesa',
    },
    lettuce: {
        src: './imgs/lettuce.jpg',
        alt: 'Lechuga',
    },
    tomato: {
        src: './imgs/tomato.png',
        alt: 'Tomate',
    },
    cheese: {
        src: './imgs/cheese.png',
        alt: 'Queso',
    },
    sausage: {
        src: './imgs/sausage.png',
        alt: 'Salchicha',
    },
    ketchup: {
        src: './imgs/ketchup.png',
        alt: 'Ketchup',
    },
    mustard: {
        src: './imgs/mustard.webp',
        alt: 'Mostaza',
    },
    ham: {
        src: './imgs/ham.png',
        alt: 'Jamón',
    }
}

const extraIngredients = {
    bacon: {
        src: './imgs/bacon.webp',
        alt: 'Bacon',
    },
    caramonion: {
        src: './imgs/caramonion.png',
        alt: 'Cebolla Caramelizada',
    },
    friedEgg: {
        src: './imgs/friedegg.png',
        alt: 'Huevo frito',
    },
    mushrooms: {
        src: './imgs/mushroom.png',
        alt: 'Champiñones',
    },
    jalapeno: {
        src: './imgs/jalapeno.png',
        alt: 'Jalapeños',
    },
    mayo: {
        src: './imgs/mayo.png',
        alt: 'Mayonesa',
    }
}

const extras = {
    fries: {
        price: 200,
        alt: 'Patatas fritas'
    },
    salad: {
        price: 150,
        alt: 'Ensalada'
    },
    rings: {
        price: 250, 
        alt: 'Aros de cebolla' 
    },
    water: {
        price: 100,
        alt: 'Botella de agua'
    },
    coke: {
        price: 150,
        alt: 'Coca Cola'
    },
    beer: {
        price: 200,
        alt: 'Cerverza'
    }
}