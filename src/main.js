const { BrowserWindow, ipcMain } = require('electron')
const { getConnection } = require('./database')

async function createProduct(product) {
    const conn = await getConnection()
    // Guardamos el producto (hay que transformar el precio de string a float)
    product.price = parseFloat(product.price);
    try {
        // Es como un prepare stmt
        const resultado = await conn.query('INSERT INTO productos SET ?', product);
        // Cuando se inserte indicarlo al usuario
        return true
    } catch (error) {
        console.error(error);
        return false
    } finally {
        // Cerrar la conexion cuando se acaba de usar
        conn.release();
    }
}

async function getProducts() {
    const conn = await getConnection()
    try {
        const resultado = await conn.query('SELECT * FROM productos')
        return resultado
    } catch (error) {
        console.error(error);
        return false
    } finally {
        conn.release();
    }
}

async function updateProduct(productId, updatedProduct) {
    const conn = await getConnection()
    // Guardamos el producto (hay que transformar el precio de string a float)
    updatedProduct.price = parseFloat(updatedProduct.price);
    try {
        const [rowsAffected] = await conn.query('UPDATE productos SET ? WHERE id = ?', [updatedProduct, productId]);
        if (rowsAffected > 0) {
            console.log('Product updated successfully.');
            return true;
        } else {
            console.log('No product found with the given ID.');
            return false;
        }
    } catch (error) {
        console.error('Error updating product:', error);
        return false;
    }
}

async function deleteProduct(productId) {
    try {
        // Delete the product from the 'productos' table
        const [rowsAffected] = await conn.query('DELETE FROM productos WHERE id = ?', productId);

        // 'rowsAffected' will contain the number of rows deleted
        if (rowsAffected > 0) {
            console.log('Product deleted successfully.');
            return true;
        } else {
            console.log('No product found with the given ID.');
            return false;
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

// Escuchar al IPC para del app.js
ipcMain.handle('create-product', async (event, product) => {
    const result = await createProduct(product);
    return result;
});

// Escuchar al IPC para del app.js
ipcMain.handle('get-products', async (event) => {
    const result = await getProducts();
    return result;
});

// Escuchar al IPC para del app.js
ipcMain.handle('update-products', async (event, productId, updatedProduct) => {
    const result = await updateProduct(productId, updatedProduct);
    return result;
});

// Escuchar al IPC para del app.js
ipcMain.handle('delete-product', async (event, productId) => {
    const result = await deleteProduct(productId);
    return result;
});


let window

function createWindow() {
    // Creamos una ventana
    window = new BrowserWindow({
        width: 800,
        height: 700,
        // Esto lo que hace es indicarle que vamos a utilizar modulos de node
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    window.loadFile('src/ui/index.html')
}



// Exportamos la funcion
module.exports = {
    createWindow
}