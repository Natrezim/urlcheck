/**
 * Mozilla Firefox extension for checking available series episodes.
 * @author Natrezim
 */

// Addon-sdk imports
var buttons = require('sdk/ui/button/toggle');
var tabs = require("sdk/tabs");
var notifications = require("sdk/notifications");
var panels = require("sdk/panel");
var self = require("sdk/self");
var request = require("sdk/request").Request;
var ss = require("sdk/simple-storage");
//var {Cc, Ci} = require("chrome");
//var parser = Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser);

// extension button
var button = buttons.ToggleButton({
  id: "url-checker",
  label: "Check for new episodes",
  badge: "",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  badgeColor: "#00aaaa",
  onClick: handleClick
});

var fetchAndProcess = function (link, panel) {
  request({
    url: link.url,
    onComplete: function (response) {
      //console.log(link.title + " = " + String(response.status));
      link.responseCode = response.status;
      panel.port.emit('episode', link);
    }
  }).get();
};

initDatabase();
var panel = initPanel();
fillPanel();

/**
 * Initiate addons main panel.
 * @returns returns new panel object
 */
function initPanel() {
  var newPanel = panels.Panel({
    width: 250,
    contentScriptFile: "./script.js",
    //contentStyle: "./panel.css",
    contentURL: "./panel.html",
    //onShow: fillPanel,
    onHide: handleHide
  });

  function handleHide() {
    button.state('window', {checked: false});
  }
  
  // panel listener for 'click-link' event
  newPanel.port.on("click-link", function (elementContent) {
    console.log(elementContent);
    button.badge == "" ? button.badge = 1 : button.badge++;
  });
  
  return newPanel;
}

/**
 * Fill the panel with series stored in simple-storage.
 */
function fillPanel() {
  // clean the panel
  panel.port.emit('clean');
  
  for (var i of ss.storage.series) {
    fetchAndProcess(i, panel);
  }
}

/**
 * Initialize simple-storage database.
 */
function initDatabase() {
  if (!ss.storage.series) {
    ss.storage.series = [];
  }

  var links = self.data.load("links.json");
  var json = JSON.parse(links);

  for (var link of json) {
    ss.storage.series.push(link);
  }

  // test database content
  //for (var i = 0; i < ss.storage.series.length; i++) {
  //  console.log(ss.storage.series[i]);
  //}
}

/**
 * Default action for extension button
 */
function handleClick(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

//var notifUser = function (link) {
//  console.log(link.title);
//  notifications.notify({
//    title: link.title,
//    text: link.url,
//    data: link.url,
//    onClick: function (data) {
//      tabs.open(data);
//    }
//  });
//};
//var dom = parser.parseFromString(panelContent, "text/html");
//dom.getElementById("menu").innerHTML = 
//    "<div class=\"menu-item\">" + ss.storage.series[0].title + "</div>";
