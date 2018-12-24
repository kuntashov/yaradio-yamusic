const path = require('path');
const store = require('../store/store');
const { Menu, Tray, globalShortcut } = require('electron');

const iconPath = path.join(__dirname,'../../','media/icon','yaradio_16x16.png');

function ctxTpl(win, app) {
  return [
		{
			label: 'Play | Pause',
			click: function (e) { return win.send('play')	},
			accelerator: 'MediaPlayPause',
			registerAccelerator: false,
		},
		{
			label: 'Next Track',
			click: () => win.send('next'),
			accelerator: 'MediaStop',
			registerAccelerator: false,
		},
		{
			type: 'separator'
		},
		{
			label: 'Like', 
			click: () => win.send('like'),
			accelerator: 'MediaNextTrack',
			registerAccelerator: false,
		},
		{
			label: 'Dislike', 
			click: () => win.send('dislike'),
			accelerator: 'MediaPreviousTrack',
			registerAccelerator: false,
		},
		{
			type: 'separator'
		},
		{
			label: 'Show App', click: function () {
				win.show();
			}
		},
		{
			label: 'Quit', click: function () {		        	
				app.quit();
			}
		}
  ]
}

exports.create = (win, app) => {
	const tplMenu = ctxTpl(win, app);
	const ctxMenu = Menu.buildFromTemplate(tplMenu);
	const appIcon = new Tray(iconPath);

	tplMenu.forEach((item) => { 
		if (item.accelerator) {
			globalShortcut.register(item.accelerator, item.click) 
		}
	})

	appIcon.setContextMenu(ctxMenu);	
	appIcon.addListener('click', (e)=>{		
		e.preventDefault();
		if (win.isVisible()){
			win.hide();
		} else {
			win.show();
		}
	})

	win.on('show', function () {
		appIcon.setHighlightMode('always')
	})
	
	app.on('will-quit', () => {
		// Unregister all shortcuts.
		globalShortcut.unregisterAll()
	})

}