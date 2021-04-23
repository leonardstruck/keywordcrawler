import React from "react";
import ReactDOM from "react-dom";

//fast refresh
if (module.hot) {
	module.hot.accept();
}

import { Provider } from "react-redux";
import store from "./store";

export const App = () => {
	return <h1>Test</h1>;
};

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("app")
);
