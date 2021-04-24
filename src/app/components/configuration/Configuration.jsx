import { EuiComboBox, EuiFormRow } from "@elastic/eui";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addKeyword, changeKeywords } from "./keywordsSlice";

export const Configuration = () => {
	const dispatch = useDispatch();
	const onCreateOption = (keyword) => {
		dispatch(addKeyword({ label: keyword }));
	};
	return (
		<EuiFormRow>
			<EuiComboBox
				noSuggestions
				placeholder="add keywords to search for"
				selectedOptions={useSelector((state) => state.keywords)}
				onCreateOption={onCreateOption}
				onChange={(event) => dispatch(changeKeywords(event))}
			/>
		</EuiFormRow>
	);
};
