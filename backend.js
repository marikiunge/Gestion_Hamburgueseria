const data = {
    orderCount: 0,
    currentOrder: null,
    orderHistory: [],

    newOrder() {
        data.currentOrder = new Order()
    },

    makeOrder() {
        if(data.currentOrder.mainProduct == null) return
        let order = structuredClone(data.currentOrder)
        data.orderHistory.push(order)
        data.orderCount++
        data.newOrder()
        drawTicket()
        clearSelections()
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