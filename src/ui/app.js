// Para acceder a las funciones del main
const { ipcRenderer } = require('electron');

// Cojer los valores de los inputs con delegacion de eventos
const productContainer = document.getElementById('products-container')
const productForm = document.getElementById('productForm')
const productsContainer = document.getElementById('products-container')
const error = document.getElementsByClassName('error')[0]
const errorUpdate = document.getElementsByClassName('error-update')[0]
const updateModal = document.getElementById('update-modal')
const closeModal = document.getElementById('close-modal')
const updateForm = document.getElementById('updateProduct-form')
error.style.display = 'none'

// Esta linea de código nos permite juntar lo del proceso principal con lo del frontend (app.js con el main.js)
// const {remote} = require('electron')
// const main = remote.require('../main')
// main.createProduct()

updateModal.style.display = 'none'

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
                        window.location.reload()
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
            let item = '<div id="product-hover" class="product" product-id=' + result[i].id + '><h4 class="product" product-id=' + result[i].id + '>Name: ' + result[i].name + '</h4><br><p class="product" product-id=' + result[i].id + '>Price: ' + result[i].price + '€</p><br><p class="product" product-id=' + result[i].id + '>Description: ' + result[i].description + '</p><br><button class="delete-product" product-id=' + result[i].id + '>X</button></div>'
            productContainer.insertAdjacentHTML('beforeend', item)
        }
    })
    .catch((error) => {
        console.error('Error invoking get-products:', error);
    });


//---------------------------------------------------------------------------------------------------------------------
// UPDATE && DELETE

// Add and event listener to each product
productsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('product')) {
        // Show update modal
        updateModal.style.display = 'block'
        updateModal.setAttribute('product-id', event.target.getAttribute("product-id"))
    // DELETE
    } else if (event.target.classList.contains('delete-product')) {
        ipcRenderer.invoke('delete-product', parseInt(event.target.getAttribute('product-id')))
            .then((result) => {
                console.log('Product deleted successfully.');
                window.location.reload()
            })
            .catch((error) => {
                console.error('Error invoking delete-product:', error);
            });
    }
});

closeModal.addEventListener('click', (event) => {
    updateModal.style.display = 'none'
})

// Guardamos los valores de los inputs en las variables
updateForm.addEventListener('input', (event) => {
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

updateForm.addEventListener('click', (event) => {
    const target = event.target;
    // Miramos si lo que se ha clicado es el botón
    if (event.target.classList.contains('update-btn')) {
        event.preventDefault();
        // Make the update
        if (productName === undefined || productPrice === undefined || productDescription === undefined || productName === '' || productPrice === '' || productDescription === '') {
            // alert('Todos los campos deben de ser rellenados')
            errorUpdate.style.display = 'block'
        } else {
            errorUpdate.style.display = 'none'
            newProduct.name = productName
            newProduct.price = productPrice
            newProduct.description = productDescription
            // Funcion del main para crear un producto nuevo
            console.log(updateModal.getAttribute('product-id'));
            ipcRenderer.invoke('update-products', parseInt(updateModal.getAttribute('product-id')), newProduct)
                .then((result) => {
                    console.log('Product updated successfully.');
                    window.location.reload()
                })
                .catch((error) => {
                    console.error('Error invoking create-product:', error);
                });
        }
    }
});
