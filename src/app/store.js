import { configureStore } from "@reduxjs/toolkit";
import domainReducer from "./components/domains/domainSlice";

export default configureStore({
	reducer: {
		domains: domainReducer,
	},
});
