var newEpisodes = document.getElementById('new-episodes');
var seenEpisodes = document.getElementById('seen-episodes');

window.addEventListener('click', function (event) {
  var t = event.target;
  if (t.className.contains('menu-item')) {
    self.port.emit('click-link', t.getAttribute('data'));
  }
}, false);

self.port.on('clean', function () {
  newEpisodes.innerHTML = "";
  seenEpisodes.innerHTML = "";
});

self.port.on('episode', function (series) {
  var newMenuItem = document.createElement('div');
  var newContent = document.createTextNode(series.title);
  newMenuItem.appendChild(newContent);
  newMenuItem.className = 'menu-item';
  newMenuItem.setAttribute('data', series.url);
  
  if (series.responseCode == 200) {
    newMenuItem.className += ' unseen';
    newEpisodes.appendChild(newMenuItem);
  } else if (series.responseCode == 404) {
    newMenuItem.className += ' seen';
    seenEpisodes.appendChild(newMenuItem);
  }
});