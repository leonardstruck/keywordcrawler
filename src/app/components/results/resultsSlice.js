import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const resultsSlice = createSlice({
	name: "results",
	initialState,
	reducers: {
		clearResults: () => initialState,
		deleteResult(state, action) {
			delete state[action.payload.id];
		},
		addResult(state, action) {
			if (state[action.payload.id]) {
				if (state[action.payload.id][action.payload.keyword.label]) {
					state[action.payload.id][action.payload.keyword.label].push(
						action.payload.location
					);
				} else {
					state[action.payload.id][action.payload.keyword.label] = [
						action.payload.location,
					];
				}
			} else {
				state[action.payload.id] = {
					[action.payload.keyword.label]: [action.payload.location],
				};
			}
		},
	},
});

export const { addResult, clearResults, deleteResult } = resultsSlice.actions;

export default resultsSlice.reducer;
