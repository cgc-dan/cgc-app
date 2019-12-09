'use strict'

var {ipcRenderer, remote, screen, webContents} = require('electron')

var title = document.querySelector("#logo").innerHTML;
document.querySelector("#titleshown").innerHTML = title;

var minimize = document.querySelector("#minimize");
var maximize = document.querySelector("#maximize");
var quit = document.querySelector("#quit");
var offapp = document.querySelector("#offapp");

minimize.addEventListener("click", () => {
	var window = remote.BrowserWindow.getFocusedWindow();
  window.minimize();
});

maximize.addEventListener("click", () => {
	var window = remote.getCurrentWindow();
  window.setFullScreen(!window.isFullScreen());
});

quit.addEventListener("click", () => {
	var window = remote.getCurrentWindow();
  window.close();
});
offapp.addEventListener("click", () => {
	var window = remote.getCurrentWindow();
  window.close();
});

document.onreadystatechange = function () {
          if (document.readyState == "complete") {
               init(); 
          }};
		  
// Notifications
const path = require('path')

const notification = {
  title: 'App Notification',
  body: 'You are using the latest version of this App.       No updates requiered.' + '  Thank you!',
  icon: path.join('file://', __dirname, '/assets/images/favicon/wicon.png')
}
const notificationButton = document.getElementById('advanced-noti')

notificationButton.addEventListener('click', () => {
  const myNotification = new window.Notification(notification.title, notification)

  myNotification.onclick = () => {
    console.log('Notification clicked')
  }
})

//Open Links
 let shell = require('electron').shell
  document.addEventListener('click', function (event) {
   if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
     event.preventDefault()
    shell.openExternal(event.target.href)
   }
 });