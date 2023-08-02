// Para acceder a las funciones del main
const { requireMain } = window.electronAPI;
const mainProcess = requireMain('../main.js');

// Cojer los valores de los inputs con delegacion de eventos
const productForm = document.getElementById('productForm')
const error = document.getElementsByClassName('error')[0]
error.style.display = 'none'

// Esta linea de código nos permite juntar lo del proceso principal con lo del frontend (app.js con el main.js)
// const {remote} = require('electron')
// const main = remote.require('../main')
// main.createProduct()

// Declaramos las variables para poder grardar el valor luego
let productName
let productPrice
let productDescription

const newProduct = {
    name,
    price,
    description
}

// Guardamos los valores de los inputs en las variables
productForm.addEventListener('input', (event) => {
    const target = event.target;

    switch (target.id) {
        case "name":
            productName = target.value
            break;
        case "price":
            productPrice = target.value
            break;
        case "description":
            productDescription = target.value
            break;
    }
});

// Cuando se le da click al formulario
productForm.addEventListener('click', (event) => {
    const target = event.target;
    // Miramos si lo que se ha clicado es el botón
    if (target.matches('button')) {
        event.preventDefault();
        if (productName === undefined || productPrice === undefined || productDescription === undefined || productName === '' || productPrice === '' || productDescription === '') {
            // alert('Todos los campos deben de ser rellenados')
            error.style.display = 'block'
        } else {
            error.style.display = 'none'
            newProduct.name = productName
            newProduct.price = productPrice
            newProduct.description = productDescription
            // Funcion del main para crear un producto nuevo
            const result = mainProcess.createProduct(newProduct);
            console.log(result);
            
        }
        //console.log("Resultados: [Nombre]: ", productName, "[Precio]: ", productPrice, "[Descripcion]: ", productDescription);
    }
});