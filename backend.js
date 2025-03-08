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
    this.ingredients = []
    this.extras = []
    this.total = 0
}

const localStorage = {
    read() {
        let savedCount = localStorage.getItem("orderCount");
        data.orderCount = savedCount ? parseInt(savedCount.orderCount) : 0;
    },

    write() {
        localStorage.setItem("orderCount", data.orderCount);
    }
}

window.onload = function() {
    localStorage.read()
    data.newOrder()
};