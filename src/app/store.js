import { configureStore } from "@reduxjs/toolkit";
import domainReducer from "./components/domains/domainSlice";
import keywordReducer from "./components/configuration/keywordsSlice";
import crawlerReducer from "./components/configuration/crawlerSlice";

export default configureStore({
	reducer: {
		domains: domainReducer,
		keywords: keywordReducer,
		crawler: crawlerReducer,
	},
});
