import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	EuiButton,
	EuiFlexGroup,
	EuiFlexItem,
	EuiProgress,
	EuiSpacer,
	EuiText,
} from "@elastic/eui";
import {
	changeRunningState,
	resetRunningState,
} from "../configuration/crawlerSlice";
import { ipcRenderer } from "electron";
import { changeStatus, resetStatus } from "../domains/domainSlice";
import ProgressTimer from "react-progress-timer";
import { clearResults, addResult } from "../results/resultsSlice";

export const Controls = () => {
	const dispatch = useDispatch();
	const crawlerConfig = useSelector((state) => state.crawler);
	const keywords = useSelector((state) => state.keywords);
	const domains = useSelector((state) => state.domains);
	const [currentCrawl, setCurrentCrawl] = useState("initializing crawler");
	useEffect(() => {
		let mounted = true;
		if (mounted) {
			ipcRenderer.on("currentCrawl", (event, args) => {
				setCurrentCrawl("crawling " + args.url);
				dispatch(
					changeStatus({
						id: args.id,
						newStatus: { step: args.step, status: args.status },
					})
				);
			});
		}
		return () => {
			mounted = false;
			ipcRenderer.removeAllListeners("currentCrawl");
		};
	});

	useEffect(() => {
		ipcRenderer.on("keywordOccurance", (event, args) => {
			dispatch(addResult(args));
		});
		return () => {
			ipcRenderer.removeAllListeners("keywordOccurance");
		};
	});

	const handleButtonClick = async () => {
		dispatch(changeRunningState(!crawlerConfig.running));
		if (crawlerConfig.running) {
			//handle stop
			setCurrentCrawl("initializing crawler");
			ipcRenderer
				.invoke("stopCrawler")
				.then((res) => console.log("result from main", res));
		} else {
			//handle start
			ipcRenderer
				.invoke("startCrawler", domains, crawlerConfig, keywords)
				.then((res) => {
					console.log("result from main", res);
				});
			ipcRenderer.once("crawlerDone", () => {
				dispatch(changeRunningState(false));
				setCurrentCrawl("initializing crawler");
			});
		}
	};

	const handleResetClick = () => {
		dispatch(resetStatus());
		dispatch(resetRunningState());
		dispatch(changeRunningState(!crawlerConfig.running));
		dispatch(clearResults());
		ipcRenderer
			.invoke("startCrawler", domains, crawlerConfig, keywords)
			.then((res) => {
				console.log("result from main", res);
			});
		ipcRenderer.once("crawlerDone", () => {
			dispatch(changeRunningState(false));
			setCurrentCrawl("initializing crawler");
		});
	};

	const queueLength = Object.keys(domains).length;
	const queueDone = Object.keys(domains).filter((key) => {
		return Object.keys(domains[key].status).length !== 0;
	}).length;
	const progressProps = {};
	if (queueDone > 0) {
		progressProps.value = queueDone;
		progressProps.max = queueLength;
	}

	return (
		<div>
			{crawlerConfig.running && (
				<div>
					<EuiText size="xs" textAlign="right">
						{queueDone > 0 ? (
							<ProgressTimer
								percentage={(queueDone / queueLength) * 100}
								initialText="calculating"
								calculateByAverage
							/>
						) : (
							"calculating"
						)}
					</EuiText>
					<EuiSpacer size="xs" />
					<EuiProgress size="xs" {...progressProps} />
					<EuiSpacer size="xs" />

					<EuiFlexGroup>
						<EuiFlexItem>
							<EuiText
								size="xs"
								style={{ width: 300, height: 60, verticalAlign: "bottom" }}
							>
								{currentCrawl}
							</EuiText>
						</EuiFlexItem>
						<EuiFlexItem>
							<EuiText size="xs" textAlign="right">
								{
									Object.keys(domains).filter((key) => {
										return Object.keys(domains[key].status).length !== 0;
									}).length
								}
								/{Object.keys(domains).length}
							</EuiText>
						</EuiFlexItem>
					</EuiFlexGroup>

					<EuiSpacer size="s" />
				</div>
			)}
			{(crawlerConfig.wasRunningBefore && !crawlerConfig.running && (
				<EuiButton
					iconType="refresh"
					fill
					fullWidth
					color="secondary"
					onClick={handleResetClick}
					disabled={!(keywords.length > 0 && Object.keys(domains).length > 0)}
				>
					Reset & Crawl again
				</EuiButton>
			)) || (
				<EuiButton
					iconType={crawlerConfig.running ? "cross" : "play"}
					fill
					fullWidth
					color={crawlerConfig.running ? "danger" : "secondary"}
					onClick={handleButtonClick}
					disabled={!(keywords.length > 0 && Object.keys(domains).length > 0)}
				>
					{crawlerConfig.running ? "Cancel" : "Start"}
				</EuiButton>
			)}
		</div>
	);
};
