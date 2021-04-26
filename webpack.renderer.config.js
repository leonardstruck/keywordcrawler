const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const rules = require("./webpack.rules");
const isDevelopment = process.env.NODE_ENV === "development";

rules.push({
	test: /\.css$/,
	use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

module.exports = {
	// Put your normal webpack config below here
	module: {
		rules,
	},
	plugins: [
		// ... other plugins
		isDevelopment &&
			new ReactRefreshWebpackPlugin({ overlay: { sockIntegration: "whm" } }),
	].filter(Boolean),
	output: {
		publicPath: "./../",
	},
};
