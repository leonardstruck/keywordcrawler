import {
	EuiButtonEmpty,
	EuiDataGrid,
	EuiLink,
	EuiText,
	EuiToken,
	EuiToolTip,
	EuiConfirmModal,
} from "@elastic/eui";
import React, { useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDomain, clearDomains } from "./domainSlice";
import { clearResults, deleteResult } from "../results/resultsSlice";
import { resetRunningState } from "../configuration/crawlerSlice";

export const DomainTable = () => {
	const domains = Object.values(useSelector((state) => state.domains));
	const crawlerConfig = useSelector((state) => state.crawler);
	const dispatch = useDispatch();
	const [isModalVisible, setIsModalVisible] = useState(false);

	return (
		<Fragment>
			{isModalVisible && (
				<EuiConfirmModal
					onCancel={() => setIsModalVisible(false)}
					onConfirm={() => {
						dispatch(clearResults());
						dispatch(clearDomains());
						dispatch(resetRunningState());
						setIsModalVisible(false);
					}}
					title="Are you sure?"
					cancelButtonText="No, don't do it"
					confirmButtonText="Yes, do it"
					buttonColor="danger"
					defaultFocusedButton="cancel"
				>
					<p>
						You are about to delete all domains and their respective results.
					</p>
					<p>Are you sure you want to do this?</p>
				</EuiConfirmModal>
			)}
			<EuiDataGrid
				height={450}
				width={480}
				rowCount={Object.keys(domains).length}
				columns={[
					{ id: "Domain", label: "Domain", isResizable: false },
					{ id: "Status", isResizable: false, initialWidth: 100 },
				]}
				columnVisibility={{
					visibleColumns: ["Domain", "Status"],
					setVisibleColumns: () => {},
				}}
				toolbarVisibility={{
					showColumnSelector: false,
					showStyleSelector: false,
					additionalControls: (
						<EuiButtonEmpty
							onClick={() => {
								setIsModalVisible(true);
							}}
							color="danger"
							iconType="trash"
							size="s"
							disabled={crawlerConfig.running}
							textProps={{ style: { fontSize: 14 } }}
						>
							Clear Data
						</EuiButtonEmpty>
					),
				}}
				renderCellValue={({ rowIndex, columnId }) => {
					switch (columnId) {
						case "Domain":
							return domains[rowIndex].domain;
						case "Status":
							if (Object.keys(domains[rowIndex].status).length === 0) {
								return (
									<EuiToolTip content="Initial crawl is pending">
										<EuiToken iconType="link" shape="rectangle" />
									</EuiToolTip>
								);
							} else {
								if (domains[rowIndex].status.initial === 200) {
									return (
										<Fragment>
											<EuiToolTip content="Initial crawl was successful">
												<EuiToken
													iconType="link"
													shape="rectangle"
													color="euiColorVis6"
													fill="dark"
												/>
											</EuiToolTip>
										</Fragment>
									);
								} else {
									return (
										<EuiToolTip
											content={
												"Initial crawl was not successful. Error message: (" +
												domains[rowIndex].status.initial +
												"). This domain won't be crawled any further"
											}
										>
											<EuiToken
												iconType="link"
												shape="rectangle"
												color="euiColorVis8"
												fill="dark"
											/>
										</EuiToolTip>
									);
								}
							}
						default:
							return <h1>not configured</h1>;
					}
				}}
				trailingControlColumns={[
					{
						id: "Actions",
						width: 80,
						headerCellRender: () => "Actions",
						rowCellRender: (props) => (
							<EuiLink
								color="danger"
								onClick={() => {
									dispatch(deleteDomain(domains[props.rowIndex]));
									dispatch(deleteResult(domains[props.rowIndex]));
								}}
							>
								Delete
							</EuiLink>
						),
					},
				]}
			/>
			<EuiText size="s">
				{Object.keys(domains).length > 0 &&
					"Total: " + Object.keys(domains).length}
			</EuiText>
		</Fragment>
	);
};
