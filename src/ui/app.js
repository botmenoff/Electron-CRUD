// Para acceder a las funciones del main
const { ipcRenderer } = require('electron');

// Cojer los valores de los inputs con delegacion de eventos
const productContainer = document.getElementById('products-container')
const productForm = document.getElementById('productForm')
const error = document.getElementsByClassName('error')[0]
error.style.display = 'none'

// Esta linea de código nos permite juntar lo del proceso principal con lo del frontend (app.js con el main.js)
// const {remote} = require('electron')
// const main = remote.require('../main')
// main.createProduct()


//---------------------------------------------------------------------------------------------------------------------
// CREATE
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
            // Send an IPC message to the main process to call the createProduct function
            ipcRenderer.invoke('create-product', newProduct)
                .then((result) => {
                    if (result) {
                        // Se ha creado el producto
                        console.log('Product inserted successfully.');
                    } else {
                        // Ha havido un error al crear el producto
                        console.error('Failed to insert product.');
                    }
                })
                .catch((error) => {
                    console.error('Error invoking create-product:', error);
                });
        }
        //console.log("Resultados: [Nombre]: ", productName, "[Precio]: ", productPrice, "[Descripcion]: ", productDescription);
    }
});

//---------------------------------------------------------------------------------------------------------------------
// READ
ipcRenderer.invoke('get-products')
    .then((result) => {
        // Show them in the screen
        console.log(result);
        // Insert all the items of the list
        for (let i = 0; i < result.length; i++) {
            let item = '<div class="product"><h4>Name: '+result[i].name+'</h4><br><p>Price: '+result[i].price+'</p><br><p>Description: '+result[i].description+'</p></div>'
            productContainer.insertAdjacentHTML('beforeend', item)
        }
    })
    .catch((error) => {
        console.error('Error invoking get-products:', error);
    });

