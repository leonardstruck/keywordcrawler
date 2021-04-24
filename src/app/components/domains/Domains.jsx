import {
	EuiFlexGroup,
	EuiFlexItem,
	EuiFormRow,
	EuiFieldText,
	EuiForm,
	EuiButtonIcon,
	EuiSpacer,
} from "@elastic/eui";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { DomainTable } from "./DomainTable.jsx";
import { addDomain } from "./domainSlice";
import { v4 as uuid } from "uuid";
import isValidDomain from "is-valid-domain";
import { ImportDialog } from "./ImportDialog.jsx";

export const Domains = () => {
	const [domain, setDomain] = useState("");
	const [isImportDialogVisible, setIsImportDialogVisible] = useState(false);
	const [importState, setImportState] = useState({ fileSelected: false });
	const [invalidInput, setInvalidInput] = useState(false);
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
						dispatch(
							addDomain({ domain: domain, id: uniqueId, status: "pending" })
						);
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
						<EuiButtonIcon
							iconType="importAction"
							size="m"
							aria-label="import bulk data"
							onClick={() => setIsImportDialogVisible(true)}
						/>
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
