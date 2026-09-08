const fs = require('fs');
// 192x192 transparent png
const png192 = "iVBORw0KGgoAAAANSUhEUgAAAMAAAADAAQMAAAD/f2OAAAAABlBMVEUAAAD///+l2Z/dAAAAEklEQVR42u3BAQ0AAADCIPunNsc3YAAAAABJRU5ErkJggg==";
// 512x512 transparent png
const png512 = "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAADOtka5AAAAA1BMVEUAAACnej3aAAAAI0lEQVR42u3BAQEAAACAkP6v7ggKAAAAAAAAAAAAAAAATgM7AAABtP/rQgAAAABJRU5ErkJggg==";

fs.writeFileSync('static/icons/icon-192.png', Buffer.from(png192, 'base64'));
fs.writeFileSync('static/icons/icon-512.png', Buffer.from(png512, 'base64'));
