import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	crawlSitemap: true,
	relativeCrawling: false,
	skipOnOccurance: false,
	limit: true,
	maxRequestLimit: 100,
};

export const crawlerSlice = createSlice({
	name: "crawlerConfig",
	initialState,
	reducers: {
		changeConfig: (state, action) => {
			return { ...state, ...action.payload };
		},
		changeLimit: (state, action) => {
			state.maxRequestLimit = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { changeConfig, changeLimit } = crawlerSlice.actions;

export default crawlerSlice.reducer;
