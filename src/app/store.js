import { configureStore } from "@reduxjs/toolkit";
import domainReducer from "./components/domains/domainSlice";
import keywordReducer from "./components/configuration/keywordsSlice";

export default configureStore({
	reducer: {
		domains: domainReducer,
		keywords: keywordReducer,
	},
});
