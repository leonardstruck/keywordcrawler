import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiTitle } from "@elastic/eui";

import React from "react";
import { Configuration } from "./configuration/Configuration.jsx";
import { Domains } from "./domains/Domains.jsx";
import { Controls } from "./controls/Controls.jsx";

export const MainView = () => {
	const fullHeight = {
		height: "100%",
	};
	return (
		<EuiFlexGroup style={fullHeight}>
			<EuiFlexItem style={{ ...fullHeight, width: "55%" }} grow={false}>
				<EuiPanel>
					<Domains />
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
