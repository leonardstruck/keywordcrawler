import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	running: false,
	wasRunningBefore: false,
	crawlSitemap: false,
	relativeCrawling: false,
	limit: true,
	maxRequestLimit: 10,
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
			state.wasRunningBefore = true;
		},
		resetRunningState: (state, action) => {
			state.wasRunningBefore = false;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	changeConfig,
	changeLimit,
	changeRunningState,
	resetRunningState,
} = crawlerSlice.actions;

export default crawlerSlice.reducer;
