import {
	EuiBadge,
	EuiCallOut,
	EuiDataGrid,
	EuiEmptyPrompt,
	EuiLoadingSpinner,
	EuiSpacer,
} from "@elastic/eui";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ipcRenderer } from "electron";
import { addResult } from "./resultsSlice";

export const Results = () => {
	const [filteredData, setFilteredData] = useState([]);
	const dispatch = useDispatch();
	useEffect(() => {
		ipcRenderer.on("keywordOccurance", (event, args) => {
			dispatch(addResult(args));
		});
		return () => {
			ipcRenderer.removeAllListeners("keywordOccurance");
		};
	});
	const keywords = useSelector((state) => state.keywords);

	const results = useSelector((state) => state.results);
	const domains = useSelector((state) => state.domains);
	const crawlerIsRunning = useSelector((state) => state.crawler.running);

	const filteredKeywords = ["kommunale"];

	useEffect(() => {
		const filteredDataToState = [];
		for (let key of Object.keys(results)) {
			for (let keyword of Object.keys(results[key])) {
				console.log(keyword);
			}
		}
	}, [results]);

	const numberPending = Object.keys(domains).filter(
		(domain) => domains[domain].status === "pending"
	).length;

	const noResultsAfterCrawl =
		Object.keys(domains).length !== 0 &&
		numberPending === 0 &&
		Object.keys(results).length === 0;

	if (Object.keys(results).length === 0 && crawlerIsRunning) {
		return (
			<EuiEmptyPrompt
				title={<>waiting for result</>}
				body={<EuiLoadingSpinner size="xl" />}
			/>
		);
	}

	if (noResultsAfterCrawl) {
		return (
			<EuiCallOut color="warning" iconType="search" title="Sorry,">
				The crawler couldn't find any keyword occurances on the provided
				domains. Try adding relative hyperlinks to the queue for better results.
			</EuiCallOut>
		);
	}

	return (
		<div style={{ height: 400 }}>
			<EuiSpacer size="m" />
			<EuiDataGrid
				rowCount={Object.keys(results).length}
				columns={[
					{
						id: "domain",
						actions: {
							showMoveLeft: false,
							showMoveRight: false,
							showHide: false,
						},
						isResizable: false,
					},
					{
						id: "keywords",
						actions: {
							showMoveLeft: false,
							showMoveRight: false,
							showHide: false,
						},
						isResizable: false,
					},
				]}
				toolbarVisibility={{
					showColumnSelector: false,
					showStyleSelector: false,
				}}
				columnVisibility={{
					visibleColumns: ["domain", "keywords"],
					setVisibleColumns: () => {},
				}}
				renderCellValue={({ rowIndex, columnId }) => {
					switch (columnId) {
						case "domain":
							return (
								<Fragment>
									{domains[Object.keys(results)[rowIndex]].domain}
								</Fragment>
							);
							break;
						case "keywords":
							return (
								<Fragment>
									{Object.keys(results[Object.keys(results)[rowIndex]]).map(
										(keyword) => {
											return <EuiBadge key={keyword}>{keyword}</EuiBadge>;
										}
									)}
								</Fragment>
							);
						default:
							return <h1>not configured</h1>;
							break;
					}
				}}
			/>
		</div>
	);
};
