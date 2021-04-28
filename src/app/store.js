import { configureStore } from "@reduxjs/toolkit";
import domainReducer from "./components/domains/domainSlice";
import keywordReducer from "./components/configuration/keywordsSlice";
import crawlerReducer from "./components/configuration/crawlerSlice";
import resultsReducer from "./components/results/resultsSlice";

export default configureStore({
	reducer: {
		domains: domainReducer,
		keywords: keywordReducer,
		crawler: crawlerReducer,
		results: resultsReducer,
	},
});
