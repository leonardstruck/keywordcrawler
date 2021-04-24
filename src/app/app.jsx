import React from "react";
import ReactDOM from "react-dom";

//fast refresh
if (module.hot) {
	module.hot.accept();
}

import { Provider } from "react-redux";
import store from "./store";
import { MainView } from "./components/MainView.jsx";

export const App = () => {
	return <h1>App</h1>;
};

ReactDOM.render(
	<Provider store={store}>
		<MainView />
	</Provider>,
	document.getElementById("app")
);
