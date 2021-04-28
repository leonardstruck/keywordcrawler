import React from "react";
import ReactDOM from "react-dom";

//fast refresh
if (module.hot) {
	module.hot.accept();
}

import { Provider } from "react-redux";
import store from "./store";
import { MainView } from "./components/MainView.jsx";
import { ipcRenderer } from "electron";

ipcRenderer
	.invoke("getDarkTheme")
	.then(async (result) => {
		if (result) {
			await import("@elastic/eui/dist/eui_theme_dark.css");
		} else {
			await import("@elastic/eui/dist/eui_theme_light.css");
		}
	})
	.then(() => {
		ReactDOM.render(
			<Provider store={store}>
				<MainView />
			</Provider>,
			document.getElementById("app")
		);
	});
