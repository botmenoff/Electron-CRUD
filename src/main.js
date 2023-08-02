const { BrowserWindow, ipcMain } = require('electron')
const { getConnection } = require('./database')

async function createProduct(product) {
    const conn = await getConnection()
    // Guardamos el producto (hay que transformar el precio de string a float)
    product.price = parseFloat(product.price);
    console.log(product);
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

async function getProducts(){
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
    createWindow,
    createProduct,
    getProducts
}