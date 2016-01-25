var menu = document.getElementById('menu');

window.addEventListener('click', function (event) {
  var t = event.target;
  if (t.className == 'menu-item') {
    self.port.emit('click-link', t.textContent);
  }
}, false);

self.port.on('episode', function (data) {
  //console.log(data);
  var newMenuItem = document.createElement('div');
  var newContent = document.createTextNode(data.title);
  newMenuItem.appendChild(newContent);
  newMenuItem.className = 'menu-item';
  
  menu.appendChild(newMenuItem);
});