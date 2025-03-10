const data = {
    orderCount: 0,
    currentOrder: null,
    orderHistory: [],

    newOrder() {
        data.orderCount++
        data.currentOrder = new Order()
    }
}

function Order() { 
    this.id = data.orderCount
    this.mainProduct = null
    this.eliminatedIngredients = []
    this.extraIngredients = []
    this.extras = {
        fries: 0,
        salad: 0,
        rings: 0,
        water: 0,
        coke: 0,
        beer: 0,
    }
    this.total = 0
}

const storage = {
    read() {
        // LOCALSTORAGE IS NOT A FUNCTION ????
        let savedCount = localStorage.getItem('orderCount');
        data.orderCount = savedCount ? parseInt(savedCount.orderCount) : 0;
    },

    write() {
        localStorage.setItem("orderCount", data.orderCount);
    }
}

window.onload = function() {
    storage.read()
    data.newOrder()
};