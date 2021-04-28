import React, { useEffect } from "react";

import {
	EuiOverlayMask,
	EuiModal,
	EuiModalHeader,
	EuiModalHeaderTitle,
	EuiModalBody,
	EuiFilePicker,
	EuiProgress,
	EuiTitle,
	EuiPanel,
	EuiSpacer,
} from "@elastic/eui";
import { useDispatch } from "react-redux";
import { addBulkDomain } from "./domainSlice";
import fileLoader from "./fileLoader";

export const ImportDialog = (props) => {
	const dispatch = useDispatch();
	useEffect(() => {
		if (props.importState.fileSelected) {
			fileLoader(props.importState.file.path)
				.then((res) => {
					dispatch(addBulkDomain(res));
				})
				.then(() => {
					props.setImportState({ fileSelected: false });
					props.setIsImportDialogVisible(false);
				});
		}
	}, [props.importState.fileSelected]);

	let importDialog = null;

	if (props.isImportDialogVisible) {
		if (props.importState.fileSelected) {
			importDialog = (
				<EuiOverlayMask>
					<EuiPanel style={{ width: 300 }} grow={false}>
						<EuiTitle>
							<h2>Importing</h2>
						</EuiTitle>
						<EuiSpacer size="l" />
						<EuiProgress size="xs" />
					</EuiPanel>
				</EuiOverlayMask>
			);
		} else {
			importDialog = (
				<EuiOverlayMask>
					<EuiModal onClose={() => props.setIsImportDialogVisible(false)}>
						<EuiModalHeader>
							<EuiModalHeaderTitle>Import</EuiModalHeaderTitle>
						</EuiModalHeader>
						<EuiModalBody>
							You can import a list of domains (.txt), where each new line is
							another domain.
							<EuiSpacer size="l" />
							<EuiFilePicker
								fullWidth={true}
								onChange={(files) =>
									files[0] &&
									props.setImportState({ fileSelected: true, file: files[0] })
								}
								accept=".txt"
							/>
						</EuiModalBody>
					</EuiModal>
				</EuiOverlayMask>
			);
		}
	}
	return importDialog;
};
