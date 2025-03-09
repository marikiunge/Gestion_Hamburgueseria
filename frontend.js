const
ogIngredientsDisplay = document.getElementById('originalIngredients'),
progressList = document.querySelector('#stateView table'),
ticket = document.querySelector('.ovTicket table')

// document.getElementById("orderNumber").innerText = String(order.number).padStart(3, "0");

// KIOSK ACTIONS
    function selectMain(which, pos) {
        data.currentOrder.mainProduct = which   
        
        let mainCourses = document.querySelectorAll('.ovProduct div')
        mainCourses.forEach(div => div.className = '');
        mainCourses[pos].className = 'selected'

        
        renderIngredients(which)
    }

    function renderIngredients(which) {
        ogIngredientsDisplay.innerHTML = ''
        for (ingredient in products[which].ingredients) {
            let img = document.createElement('img')
            img.classList.add('selected')
            img.src = baseIngredients[products[which].ingredients[ingredient]].src
            img.alt = baseIngredients[products[which].ingredients[ingredient]].alt
            img.onclick = function() { toggleIngredient(this) }
            ogIngredientsDisplay.appendChild(img)
        }

        document.querySelectorAll('#additionalIngredients img').forEach (
            img => img.classList.remove('selected')
        )

        document.querySelectorAll('.stepper p').forEach (
            p => p.innerHTML = 0
        )
    }

    function toggleIngredient(which, extra = false) {
        if (extra) {
            if(which.className == 'selected') which.className = ''
            else which.className = 'selected'
        } else {
            if(which.className == 'selected') which.className = 'removed'
            else which.className = 'selected'
        }
    }

    document.querySelectorAll('.stepper').forEach(stepper => {
        let buttons = stepper.querySelectorAll('button')
        buttons[0].addEventListener('click', function() { manageStepper(this, false) })
        buttons[1].addEventListener('click', function() { manageStepper(this, true) })
    })

    function manageStepper(which, increasing) {
        let node = which.parentNode.querySelector('p')
        let value = parseInt(node.innerHTML)

        if (increasing) value = Math.min(value + 1, 50)
        else value = Math.max(value - 1, 0)

        node.innerHTML = value
    }