const data = {
    orderCount: 0,
    currentOrder: null,
    orderHistory: [],

    newOrder() {
        data.currentOrder = new Order()
        updateOrderNumber()
    },

    makeOrder() {
        if(data.currentOrder.mainProduct == null) return
        let order = structuredClone(data.currentOrder)
        data.orderHistory.push(order)
        timer.start(data.orderCount, timer.getOrderTimer())
        data.newOrder()
        drawTicket()
        clearSelections()
        data.orderCount++
    }
}

const timer = {
    activeTimers: [],

    start(order, time){
        timer.activeTimers.push([order, time])
        timer.draw()
    },

    draw() {
        progressList.innerHTML = ''
        timer.activeTimers.forEach(array => {
            let tr = document.createElement('tr')
            let tdOrder = document.createElement('td')
            let tdTime = document.createElement('td')

            tdOrder.innerText = String(array[0] + 1).padStart(3, '0')

            if(array[1] != 0) {
                mins = Math.floor(array[1]/60)
                secs = String(Math.floor(array[1] % 60)).padStart(2, '0')
                tdTime.innerText = mins + ':' + secs
            } else {
                let button = document.createElement('button')
                button.textContent = 'Recoger'
                button.onclick = pickUpOrder(array[0])
                tdTime.appendChild(button)
            }

            tr.appendChild(tdOrder)
            tr.appendChild(tdTime)
            progressList.appendChild(tr)
        })
    },

    getOrderTimer() {
        let fries = data.currentOrder.extras.fries
        let salad = data.currentOrder.extras.salad
        let rings = data.currentOrder.extras.rings
        let extras = data.currentOrder.extraIngredients.length
    
        let items = fries + salad + rings + 1
        let timer = 0
        for (let i=0; i<items; i++) {
            timer += Math.random() * 20 + 20
        }
        for (let i=0; i<extras; i++){
            timer += Math.random() * 10 + 5
        }
        return Math.floor(timer)
    },

    tick() {
        timer.activeTimers.forEach(array => {
            if (array[1] > 0) array[1] = array[1] - 1
        });
        timer.draw()
    }
}

function pickUpOrder(order){

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
    setInterval(timer.tick, 1000)
};