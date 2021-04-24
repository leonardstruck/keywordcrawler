import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const configurationSlice = createSlice({
	name: "keywords",
	initialState,
	reducers: {
		addKeyword: (state, action) => {
			state.push({ ...action.payload });
		},
		changeKeywords: (state, action) => action.payload,
	},
});

// Action creators are generated for each case reducer function
export const { addKeyword, changeKeywords } = configurationSlice.actions;

export default configurationSlice.reducer;
