import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const domainSlice = createSlice({
	name: "domains",
	initialState,
	reducers: {
		addDomain: (state, action) => {
			state.unshift({ ...action.payload });
		},
		deleteDomain: (state, action) => {
			state.splice(
				state.findIndex(function (i) {
					return i.id === action.payload.id;
				}),
				1
			);
		},
		addBulkDomain: (state, action) => {
			state.push(...action.payload);
		},
		clearDomains: () => initialState,
	},
});

// Action creators are generated for each case reducer function
export const {
	addDomain,
	deleteDomain,
	addBulkDomain,
	clearDomains,
} = domainSlice.actions;

export default domainSlice.reducer;
