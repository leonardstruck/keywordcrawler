import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { EuiButton } from "@elastic/eui";
import { changeRunningState } from "../configuration/crawlerSlice";

export const Controls = () => {
	const dispatch = useDispatch();
	const crawlerConfig = useSelector((state) => state.crawler);
	const keywords = useSelector((state) => state.keywords);
	const domains = useSelector((state) => state.domains);

	const handleButtonClick = () => {
		dispatch(changeRunningState(!crawlerConfig.running));
	};

	return (
		<EuiButton
			iconType={crawlerConfig.running ? "pause" : "play"}
			fill
			fullWidth
			color={crawlerConfig.running ? "warning" : "secondary"}
			onClick={handleButtonClick}
			disabled={(keywords.length === 0) | (domains.length === 0)}
		>
			{crawlerConfig.running ? "Stop crawling" : "Start crawling"}
		</EuiButton>
	);
};
