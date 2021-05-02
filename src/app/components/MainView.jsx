import {
	EuiFlexGroup,
	EuiFlexItem,
	EuiPanel,
	EuiTabs,
	EuiTab,
	EuiSpacer,
} from "@elastic/eui";

import React, { useEffect, useState } from "react";
import { Configuration } from "./configuration/Configuration.jsx";
import { Domains } from "./domains/Domains.jsx";
import { Controls } from "./controls/Controls.jsx";
import { Results } from "./results/Results.jsx";
import { useSelector } from "react-redux";

export const MainView = () => {
	const isCrawlerRunning = useSelector((state) => state.crawler.running);
	const results = useSelector((state) => state.results);
	const domains = useSelector((state) => state.domains);
	const numberPending = Object.keys(domains).filter(
		(domain) => Object.keys(domains[domain].status).length === 0
	).length;

	const noResultsAfterCrawl =
		Object.keys(domains).length !== 0 &&
		numberPending === 0 &&
		Object.keys(results).length === 0;
	const fullHeight = {
		height: "100%",
	};

	const [selectedTab, setSelectedTab] = useState("domains");
	useEffect(() => {
		let mounted = true;
		if (isCrawlerRunning) {
			mounted && setSelectedTab("results");
		} else if (!noResultsAfterCrawl) {
			Object.keys(results).length === 0 && setSelectedTab("domains");
		}
		return () => {
			mounted = false;
		};
	}, [isCrawlerRunning]);

	return (
		<EuiFlexGroup style={fullHeight}>
			<EuiFlexItem style={{ ...fullHeight, width: "55%" }} grow={false}>
				<EuiPanel>
					<EuiTabs>
						<EuiTab
							isSelected={selectedTab === "domains"}
							onClick={() => setSelectedTab("domains")}
						>
							Domains
						</EuiTab>
						<EuiTab
							isSelected={selectedTab === "results"}
							onClick={() => setSelectedTab("results")}
							disabled={
								!(
									Object.keys(results).length > 0 ||
									isCrawlerRunning ||
									noResultsAfterCrawl
								)
							}
						>
							Results
						</EuiTab>
					</EuiTabs>
					<EuiSpacer size="m" />
					{selectedTab === "domains" && <Domains />}
					{selectedTab === "results" && <Results />}
				</EuiPanel>
			</EuiFlexItem>
			<EuiFlexItem style={{ ...fullHeight, width: "45%" }} grow={false}>
				<EuiFlexGroup style={fullHeight} direction="column">
					<EuiFlexItem>
						<EuiPanel>
							<Configuration />
						</EuiPanel>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiPanel>
							<Controls />
						</EuiPanel>
					</EuiFlexItem>
				</EuiFlexGroup>
			</EuiFlexItem>
		</EuiFlexGroup>
	);
};
