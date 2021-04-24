import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiTitle } from "@elastic/eui";

import React from "react";
import { Domains } from "../domains/Domains.jsx";

export const Configuration = () => {
	const fullHeight = {
		height: "100%",
	};
	return (
		<EuiFlexGroup style={fullHeight}>
			<EuiFlexItem style={{ ...fullHeight, width: "70%" }} grow={false}>
				<EuiPanel>
					<Domains />
				</EuiPanel>
			</EuiFlexItem>
			<EuiFlexItem style={{ ...fullHeight, width: "30%" }} grow={false}>
				<EuiFlexGroup style={fullHeight} direction="column">
					<EuiFlexItem>
						<EuiPanel>
							<EuiTitle size="xs">
								<h1>configuration</h1>
							</EuiTitle>
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
