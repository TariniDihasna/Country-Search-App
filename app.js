const autoCompleteInput = document.querySelector('.autocompleteInput')
const submitBtn = document.querySelector('.submitBtn')
const formContainer = document.querySelector('.form_container')
const countryInfoContainer = document.querySelector('.countryInfoContainer')

autoCompleteInput.addEventListener('input', onInputChange)
getCountryData()
let countryNames = []
async function getCountryData() {
    const countryResource = await fetch('https://restcountries.com/v3.1/all')
    const data = await countryResource.json()

    countryNames = data.map((country) => {
        return country.name.common
    })
}

function onInputChange() {
    removeAutoCompleteDropdown()
    const value = autoCompleteInput.value.toLowerCase()
    if(value.length !== 0){
        submitBtn.classList.remove('active')
    }
    else{
        submitBtn.classList.add('active')
        return
    }
    const filteredNames = []
    countryNames.forEach((countryName) => {
        if(countryName.substr(0, value.length).toLowerCase() === value)
        filteredNames.push(countryName)
    })
    createAutoCompleteDropdown(filteredNames)
}
function createAutoCompleteDropdown(list) {
    ul = document.createElement('ul')
    ul.id = "autoCompleteList"
    list.forEach(country => {
        const li = document.createElement('li')
        const countryBtn = document.createElement('button')
        countryBtn.innerHTML = country

        countryBtn.addEventListener('click', onCountryButtonClik)

        li.appendChild(countryBtn)
        ul.appendChild(li)
    })
    formContainer.appendChild(ul)
}
function removeAutoCompleteDropdown(){
    const listEl = document.getElementById('autoCompleteList')
    if(listEl) listEl.remove()
}
function onCountryButtonClik(e) {
    const buttonEl = e.target
    autoCompleteInput.value = buttonEl.innerHTML
    removeAutoCompleteDropdown()
}

submitBtn.addEventListener('click', (e)=> {
    e.preventDefault()
    removeAutoCompleteDropdown()
    var countryInfoURL = `https://restcountries.com/v3.1/name/${autoCompleteInput.value}?fullText=true`
    fetch(countryInfoURL)
    .then((response) => {
        if(!response.ok){
            if(response.status === 404){
                throw new Error('Enter a valid country name.')
            }
            else{
                throw new Error('Network error')
            }
        }
        return response.json()
    })
    .then((data) => {
        console.log(data);
        countryInfoContainer.innerHTML = `<img class="card-img-top" src="${data[0].flags.svg}" alt="">
        <div class="card" style="width: 18rem;">
        <div class="card-body">
        <h5 class="card-title">${data[0].name.common}</h5>
        <p class="card-text">Capital :${data[0].capital[0]}</p>
        <p class="card-text">Region :${data[0].continents[0]}</p>
        <p class="card-text">Population :${data[0].population}</p>
        <a href="#" class="btn btn-primary">View On Google Maps</a>
        </div>
        </div>`
    })
    .catch( error => {
        countryInfoContainer.innerHTML = `<h3>${'Error:', error.message}</h3>`
    })
})