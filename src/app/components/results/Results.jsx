import {
	EuiBadge,
	EuiButton,
	EuiCallOut,
	EuiCheckbox,
	EuiDataGrid,
	EuiEmptyPrompt,
	EuiFlexGroup,
	EuiFlexItem,
	EuiLink,
	EuiLoadingSpinner,
	EuiPanel,
	EuiSpacer,
	EuiText,
} from "@elastic/eui";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ipcRenderer } from "electron";
import { addResult } from "./resultsSlice";
import { createObjectCsvWriter } from "csv-writer";

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
	const [filteredKeywords, setFilteredKeywords] = useState([]);

	useEffect(() => {
		const filteredDataToState = [];
		if (filteredKeywords.length === 0) {
			Object.keys(results).map((result) => {
				filteredDataToState.push({ id: result, keywords: results[result] });
			});
		} else if (filteredKeywords.length === 1) {
			Object.keys(results).map((result) => {
				if (Object.keys(results[result]).includes(filteredKeywords[0])) {
					filteredDataToState.push({ id: result, keywords: results[result] });
				}
			});
		} else if (filteredKeywords.length > 1) {
			Object.keys(results).map((result) => {
				let addToState = true;
				filteredKeywords.map((keyword) => {
					if (!Object.keys(results[result]).includes(keyword)) {
						addToState = false;
					}
				});
				if (addToState) {
					filteredDataToState.push({ id: result, keywords: results[result] });
				}
			});
		}
		setFilteredData(filteredDataToState);
	}, [results, filteredKeywords]);

	const numberPending = Object.keys(domains).filter(
		(domain) => domains[domain].status === "pending"
	).length;

	const noResultsAfterCrawl =
		Object.keys(domains).length !== 0 &&
		numberPending === 0 &&
		Object.keys(results).length === 0;

	const handleExportButton = () => {
		ipcRenderer.invoke("getSavePath").then((res) => {
			if (res.canceled) {
				return;
			} else {
				const keywordsArray = [];
				keywords.map((keyword) =>
					keywordsArray.push({ id: keyword.label, title: keyword.label })
				);
				const csv = createObjectCsvWriter({
					path: res.filePath,
					header: [
						{
							id: "domain",
							title: "DOMAIN",
						},
						...keywordsArray,
					],
				});
				const records = [];
				filteredData.map((entity) => {
					const keywordsInfo = {};
					keywordsArray.map((keyword) => {
						keywordsInfo[keyword.id] = results[entity.id][keyword.id]
							? "true"
							: "false";
					});
					records.push({ domain: domains[entity.id].domain, ...keywordsInfo });
				});
				csv.writeRecords(records).then(() => {
					console.log("...Done");
				});
			}
		});
	};

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
		<div>
			<EuiFlexGroup>
				<EuiFlexItem>
					<EuiPanel style={{ height: 100, overflowY: "scroll" }}>
						{keywords.map((keyword) => (
							<EuiCheckbox
								key={keyword.label}
								label={keyword.label}
								id={keyword.label}
								checked={filteredKeywords.includes(keyword.label)}
								onChange={(e) => {
									if (e.currentTarget.checked) {
										setFilteredKeywords([
											...filteredKeywords,
											e.currentTarget.id,
										]);
									} else {
										const filteredKeywordsToState = [...filteredKeywords];
										const index = filteredKeywordsToState.indexOf(
											e.currentTarget.id
										);
										if (index > -1) {
											filteredKeywordsToState.splice(index, 1);
										}
										setFilteredKeywords(filteredKeywordsToState);
									}
								}}
							/>
						))}
					</EuiPanel>
				</EuiFlexItem>
				<EuiFlexItem>
					<EuiButton
						iconType="exportAction"
						size="m"
						onClick={handleExportButton}
						disabled={filteredData.length === 0 || crawlerIsRunning}
						color="secondary"
					>
						{filteredData.length === 0 && "Nothing to export"}
						{filteredData.length === 1 && "Export 1 result"}
						{filteredData.length > 1 &&
							"Export " + filteredData.length + " results"}
					</EuiButton>
				</EuiFlexItem>
			</EuiFlexGroup>
			<EuiSpacer size="m" />

			<EuiPanel style={{ height: 400 }}>
				<EuiDataGrid
					rowCount={filteredData.length}
					columns={[
						{
							id: "domain",
							actions: {
								showMoveLeft: false,
								showMoveRight: false,
								showHide: false,
							},
							cellActions: [
								({ rowIndex, columnId, Component }) => {
									return (
										<Component
											onClick={() =>
												ipcRenderer.send(
													"openUrl",
													"http://" + domains[filteredData[rowIndex].id].domain
												)
											}
											iconType="link"
											aria-label="open domain in browser"
										>
											Open in Browser
										</Component>
									);
								},
							],
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
										{domains[filteredData[rowIndex].id].domain}
									</Fragment>
								);
								break;
							case "keywords":
								return (
									<Fragment>
										{Object.keys(filteredData[rowIndex].keywords).map(
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
			</EuiPanel>
		</div>
	);
};
