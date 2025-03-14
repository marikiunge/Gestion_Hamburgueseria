const
ogIngredientsDisplay = document.getElementById('originalIngredients'),
progressList = document.querySelector('#stateView table'),
pvPanel = document.querySelector('.pvFull'),
ticket = document.querySelector('.ovTicket table')


// KIOSK ACTIONS

    function updateOrderNumber(){
        document.getElementById("orderNumber").innerText = String(data.orderCount + 1).padStart(3, "0");
    }

    function selectMain(which, pos) {
        data.currentOrder.mainProduct = which   
        
        let mainCourses = document.querySelectorAll('.ovProduct div')
        mainCourses.forEach(div => div.className = '');
        mainCourses[pos].className = 'selected'

        data.currentOrder.eliminatedIngredients = []
        data.currentOrder.extraIngredients = []
        data.currentOrder.extras = {
            fries: 0,
            salad: 0,
            rings: 0,
            water: 0,
            coke: 0,
            beer: 0,
        }
        renderIngredients(which)
        drawTicket()
    }

    function renderIngredients(which) {
        ogIngredientsDisplay.innerHTML = ''
        for (ingredient in products[which].ingredients) {
            let img = document.createElement('img')
            img.classList.add('selected')
            img.src = baseIngredients[products[which].ingredients[ingredient]].src
            img.alt = baseIngredients[products[which].ingredients[ingredient]].alt
            img.id = 'baseIng' + ingredient
            img.onclick = function() { toggleIngredient(this) }
            ogIngredientsDisplay.appendChild(img)
        }

        document.querySelectorAll('#additionalIngredients img').forEach (
            img => img.classList.remove('selected')
        )

        document.querySelectorAll('.stepper p').forEach (
            p => p.innerHTML = 0
        )
        drawTicket()
    }

    function toggleIngredient(which, extra = false) {
        if (extra) {
            if(which.className == 'selected') {
                let prod = parseInt(which.id.replace('extraIng_', ''))
                data.currentOrder.extraIngredients.splice(data.currentOrder.extraIngredients.indexOf(prod), 1)
                which.className = ''
            } else {
                let prod = which.id.replace('extraIng_', '')
                data.currentOrder.extraIngredients.push(prod)
                which.className = 'selected'
            }
        } else {
            if(which.className == 'selected') {
                let id = parseInt(which.id.replace('baseIng', ''))
                let prod = products[data.currentOrder.mainProduct].ingredients[id]
                data.currentOrder.eliminatedIngredients.push(prod)
                which.className = 'removed'
            } else {
                let id = parseInt(which.id.replace('baseIng', ''))
                let prod = products[data.currentOrder.mainProduct].ingredients[id]
                data.currentOrder.eliminatedIngredients.splice(data.currentOrder.eliminatedIngredients.indexOf(prod), 1)
                which.className = 'selected'
            }
        }
        drawTicket()
    }

    document.querySelectorAll('.stepper').forEach(stepper => {
        let buttons = stepper.querySelectorAll('button')
        buttons[0].addEventListener('click', function() { manageStepper(this, false) })
        buttons[1].addEventListener('click', function() { manageStepper(this, true) })
    })

    function manageStepper(which, increasing) {
        let node = which.parentNode.querySelector('p')
        let item = which.parentNode.id.replace('step_', '')
        let value = parseInt(node.innerHTML)

        if (increasing) value = Math.min(value + 1, 50)
        else value = Math.max(value - 1, 0)

        data.currentOrder.extras[item] = value

        node.innerHTML = value
        drawTicket()
    }


// REDRAW THE TICKET WITH PROPER PRICES
function drawTicket() {
    ticket.innerHTML = ''
    
    // Main product
    if (data.currentOrder.mainProduct != null) {
        let tr = document.createElement('tr')
        let item = document.createElement('td')
        let price = document.createElement('td')

        item.innerText = products[data.currentOrder.mainProduct].name
        price.innerText = (products[data.currentOrder.mainProduct].price / 100).toFixed(2)
        price.innerText += '€'

        tr.appendChild(item)
        tr.appendChild(price)
        ticket.appendChild(tr)
    }

    // Removed base ingredients
    for (i in data.currentOrder.eliminatedIngredients) {
        let tr = document.createElement('tr')
        let item = document.createElement('td')
        let price = document.createElement('td')

        item.innerText = 'Sin '
        item.innerText += (baseIngredients[data.currentOrder.eliminatedIngredients[i]].alt).toLowerCase().substring(0, 20)
        price.innerText = '0.00€'

        tr.appendChild(item)
        tr.appendChild(price)
        ticket.appendChild(tr)
    }

    // Extra ingredients
    for (i in data.currentOrder.extraIngredients) {
        let tr = document.createElement('tr')
        let item = document.createElement('td')
        let price = document.createElement('td')

        item.innerText = 'Extra '
        item.innerText += (extraIngredients[data.currentOrder.extraIngredients[i]].alt).toLowerCase().substring(0, 17)
        price.innerText = '0.50€'

        tr.appendChild(item)
        tr.appendChild(price)
        ticket.appendChild(tr)
    }

    // Extras
    for (key in data.currentOrder.extras) {
        if(data.currentOrder.extras[key] > 0) {
            let tr = document.createElement('tr')
            let item = document.createElement('td')
            let price = document.createElement('td')
    
            item.innerText = data.currentOrder.extras[key]
            item.innerText += 'x '
            item.innerText += extras[key].alt.substring(0,17)
            price.innerText = (data.currentOrder.extras[key]*(extras[key].price / 100)).toFixed(2)
            price.innerText += '€'
    
            tr.appendChild(item)
            tr.appendChild(price)
            ticket.appendChild(tr)
        }
    }

    // Price
    let totalPrice = 0
    ticket.querySelectorAll('tr td:last-child').forEach(td => {
        totalPrice += parseFloat(td.innerText)
    })
    document.querySelector('.billPrice span').innerText = totalPrice.toFixed(2)
}

function clearSelections(){
    // Main product
    let mainCourses = document.querySelectorAll('.ovProduct div')
    mainCourses.forEach(div => div.className = '');

    // Base ingredients
    ogIngredientsDisplay.innerHTML = ''

    // Extra ingredients
    document.querySelectorAll('#additionalIngredients img').forEach (
        img => img.classList.remove('selected')
    )

    // Steppers
    document.querySelectorAll('.stepper').forEach(stepper => {
        stepper.querySelector('p').innerText = 0
    })

    // Ticket
    drawTicket()

}


function drawPickUp(order){
    let object = data.orderHistory[order]
    console.log(object.id)
    // Order number
        pvPanel.innerHTML = ''
        let p = document.createElement('p')
        p.className = 'pvOrder'
        p.innerText = 'Pedido ' + (String(object.id+1).padStart(3, '0'))
        pvPanel.appendChild(p)
        let hr = document.createElement('hr')
        pvPanel.appendChild(hr)

    // Main product
        let pvMain = document.createElement('div')
        pvMain.className = 'pvMain'
        let pvMainImg = document.createElement('img')
        pvMainImg.className = 'pvMainImg'
        pvMainImg.src = products[object.mainProduct].src
        let pvAll = document.createElement('div')

        // Removed ingredients
            let indiv1 = document.createElement('div')
            let id1P = document.createElement('p')
            indiv1.appendChild(id1P)
            if (object.eliminatedIngredients.length > 0) {
                id1P.innerText = 'Sin: '
                object.eliminatedIngredients.forEach(item => {
                    let img = document.createElement('img')
                    img.src = baseIngredients[item].src
                    indiv1.appendChild(img)
                });    
            } else {
                id1P.innerText = 'Con todo'
            }
            
        // Extra ingredients
            let indiv2 = document.createElement('div')
            let id2P = document.createElement('p')
            indiv2.appendChild(id2P)
            if (object.extraIngredients.length > 0) {
                id2P.innerText = 'Extra: '
                object.extraIngredients.forEach(item => {
                    let img = document.createElement('img')
                    img.src = extraIngredients[item].src
                    indiv2.appendChild(img)
                });
            } else {
                id2P.innerText = 'Sin extras'
            }

        // Total price
            let mainP = document.createElement('p')
            mainP.className = 'pvMainPrice'
            mainP.innerText = (
                (products[object.mainProduct].price/100) + (0.5 * object.extraIngredients.length)
            ).toFixed(2) + '€'

    pvAll.appendChild(indiv1)
    pvAll.appendChild(indiv2)
    pvAll.appendChild(mainP)
    pvMain.appendChild(pvMainImg)
    pvMain.appendChild(pvAll)
    pvPanel.appendChild(pvMain)

    let hr2 = document.createElement('hr')
    pvPanel.appendChild(hr2)

    // Extras
    let table = document.createElement('table')
    for (key in object.extras) {
        if (object.extras[key] > 0){
            let tr = document.createElement('tr')
            let tdImg = document.createElement('td')
            let tdName = document.createElement('td')
            let tdPrice = document.createElement('td')

            let img = document.createElement('img')
            img.src = extras[key].src
            tdImg.appendChild(img)

            tdName.innerText = object.extras[key] + 'x ' + extras[key].alt  

            tdPrice.innerText = (extras[key].price / 100 * object.extras[key]).toFixed(2) + '€'

            tr.appendChild(tdImg)
            tr.appendChild(tdName)
            tr.appendChild(tdPrice)
            table.appendChild(tr)
        }
    }

    if (table.querySelectorAll('tr').length === 0) {
        let tr = document.createElement('tr')
        let td = document.createElement('td')
        td.colSpan = 3
        td.style.textAlign = 'center'
        td.innerText = 'Sin extras ni bebida'
        tr.appendChild(td)
        table.appendChild(tr)
    }

    pvPanel.appendChild(table)

    // Price and button
    let hr3 = document.createElement('hr')
    pvPanel.appendChild(hr3)

    let pvPrice = document.createElement('div')
    pvPrice.className = 'pvPrice'
    let pvpP = document.createElement('p')
    pvpP.innerText = (object.total/100).toFixed(2) + '€'
    let pvpB = document.createElement('button')
    pvpB.onclick = clearPickUp
    pvpB.innerText = 'Listo!'

    pvPrice.appendChild(pvpP)
    pvPrice.appendChild(pvpB)
    pvPanel.appendChild(pvPrice)
}

function clearPickUp() {
    pvPanel.innerHTML = ''
}