import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	running: false,
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
		changeRunningState: (state, action) => {
			state.running = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	changeConfig,
	changeLimit,
	changeRunningState,
} = crawlerSlice.actions;

export default crawlerSlice.reducer;
