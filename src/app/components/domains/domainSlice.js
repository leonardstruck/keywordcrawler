import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const domainSlice = createSlice({
	name: "domains",
	initialState,
	reducers: {
		addDomain: (state, action) => {
			return { ...state, [action.payload.id]: action.payload };
		},
		deleteDomain: (state, action) => {
			delete state[action.payload.id];
		},
		addBulkDomain: (state, action) => {
			return { ...action.payload, ...state };
		},
		clearDomains: () => initialState,
		changeStatus: (state, action) => {
			state[action.payload.id].status = action.payload.newStatus;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	addDomain,
	deleteDomain,
	addBulkDomain,
	clearDomains,
	changeStatus,
} = domainSlice.actions;

export default domainSlice.reducer;
