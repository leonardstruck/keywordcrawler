import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiTitle } from "@elastic/eui";

import React from "react";
import { Configuration } from "./configuration/Configuration.jsx";
import { Domains } from "./domains/Domains.jsx";

export const MainView = () => {
	const fullHeight = {
		height: "100%",
	};
	return (
		<EuiFlexGroup style={fullHeight}>
			<EuiFlexItem style={{ ...fullHeight, width: "65%" }} grow={false}>
				<EuiPanel>
					<Domains />
				</EuiPanel>
			</EuiFlexItem>
			<EuiFlexItem style={{ ...fullHeight, width: "35%" }} grow={false}>
				<EuiFlexGroup style={fullHeight} direction="column">
					<EuiFlexItem>
						<EuiPanel>
							<Configuration />
						</EuiPanel>
					</EuiFlexItem>
					<EuiFlexItem>
						<EuiPanel></EuiPanel>
					</EuiFlexItem>
				</EuiFlexGroup>
			</EuiFlexItem>
		</EuiFlexGroup>
	);
};
