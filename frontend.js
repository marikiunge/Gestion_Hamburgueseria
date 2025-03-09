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

// FOR EACH EXTRA PRODUCT (BOTH EXTRAS AND DRINKS) ADD LISTENERS
// TO UP AND DOWN THE STEPPER

// FOR EACH INGREDIENT ADD EVENT LISTENERS

// FOR EACH EXTRA INGREDIENT ADD EVENT LISTENERS