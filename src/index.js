const {createWindow} = require('./main')
const {app} = require('electron')

// Como un nodemon
require('electron-reload')(__dirname)

// Database
require('./database')

// El index lo inicia todo
// Para prevenir el error inicial tenemos que utilizar este método de app
app.whenReady().then(createWindow)
