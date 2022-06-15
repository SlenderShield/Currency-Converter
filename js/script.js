const apiKey = 'b3810ab020f3f8dc9fb85ea6'
const dropList = document.querySelectorAll(".drop-list select")
let fromCurrency = document.querySelector(".from select")
let toCurrency = document.querySelector(".to select")
const exchangeRateTxn = document.querySelector(".exchange-rate")

getButton = document.querySelector("form button")

for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_code) {
        // For selecting default currency of USD and INR
        let selected;
        if (i == 0) {
            selected = currency_code == "USD" ? "selected" : ""
        } else if (i == 1) {
            selected = currency_code == "INR" ? "selected" : ""
        }
        // For multiple currencies and country
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`
        // inserting optionTag inside the select in html
        dropList[i].insertAdjacentHTML("beforeend", optionTag)
    }
    dropList[i].addEventListener('change', event => {
        loadFlag(event.target) // calling loadFlag with element target as arugment
    })
}

function loadFlag(element) {
    for (let code in country_code) {
        if (code == element.value) {  // if code is same as option selected
            let imgTag = element.parentElement.querySelector(".flag")  // selecting img tag using the element
            imgTag.src = `https://countryflagsapi.com/png/${country_code[code]}`
        }
    }
}

// Get exchange rate on load of webpage
window.addEventListener('load', () => {
    getExchangeRate()
})

getButton.addEventListener('click', event => {
    event.preventDefault()  // prevent form from submitting
    getExchangeRate();
})


const exchangeIcon = document.querySelector(".drop-list .icon")
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);  // Call load flag after exchanging
    loadFlag(toCurrency);  // Call load flag after exchanging
    getExchangeRate()
})

function getExchangeRate() {
    const amount = document.querySelector(".amount input")
    let amountVal = amount.value
    // If invalid amount is given then 1 is set by default
    if (amountVal == "" || amountVal == "0") {
        amount.value = 1;
        amountVal = 1;
    }

    exchangeRateTxn.innerHTML = "Getting exchange rate..."
    // Call api and fetch all the rates and convert it into the js Object
    let url = ` https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value]

        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateTxn.innerHTML = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`
    }).catch(() => { // if user went offline or currency exchange not possible
        exchangeRateTxn.innerHTML = "Something went wrong";
    })
}
