import {
	EuiFlexGroup,
	EuiFlexItem,
	EuiFormRow,
	EuiFieldText,
	EuiForm,
	EuiButton,
	EuiSpacer,
} from "@elastic/eui";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DomainTable } from "./DomainTable.jsx";
import { addDomain } from "./domainSlice";
import { v4 as uuid } from "uuid";
import isValidDomain from "is-valid-domain";
import { ImportDialog } from "./ImportDialog.jsx";

export const Domains = () => {
	const [domain, setDomain] = useState("");
	const crawlerConfig = useSelector((state) => state.crawler);
	const [isImportDialogVisible, setIsImportDialogVisible] = useState(false);
	const [importState, setImportState] = useState({ fileSelected: false });
	const [invalidInput, setInvalidInput] = useState(false);
	const domains = useSelector((state) => state.domains);

	const dispatch = useDispatch();

	return (
		<div>
			<EuiForm
				component="form"
				onSubmit={(event) => {
					event.preventDefault();
					if (isValidDomain(domain, { subdomain: true })) {
						setDomain("");
						const uniqueId = uuid();
						dispatch(addDomain({ domain: domain, id: uniqueId, status: {} }));
					} else {
						setInvalidInput(true);
					}
				}}
			>
				<EuiFlexGroup>
					<EuiFlexItem>
						<EuiFormRow>
							<EuiFieldText
								isInvalid={invalidInput}
								value={domain}
								disabled={crawlerConfig.running}
								name="domain"
								placeholder="type in domain name"
								onChange={(e) => {
									setInvalidInput(false);
									setDomain(e.currentTarget.value);
								}}
							></EuiFieldText>
						</EuiFormRow>
					</EuiFlexItem>
					<EuiFlexItem grow={false}>
						<EuiButton
							iconType="importAction"
							size="m"
							onClick={() => setIsImportDialogVisible(true)}
							disabled={crawlerConfig.running}
						>
							Import
						</EuiButton>
					</EuiFlexItem>
				</EuiFlexGroup>
			</EuiForm>
			<EuiSpacer size="m" />
			<DomainTable />
			<ImportDialog
				isImportDialogVisible={isImportDialogVisible}
				setImportState={setImportState}
				setIsImportDialogVisible={setIsImportDialogVisible}
				importState={importState}
			/>
		</div>
	);
};
