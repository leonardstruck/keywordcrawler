import { EuiBasicTable, EuiLink } from "@elastic/eui";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDomain, clearDomains } from "./domainSlice";
import { clearResults, deleteResult } from "../results/resultsSlice";

export const DomainTable = () => {
	const [pageIndex, setPageIndex] = useState(0);
	const domains = Object.values(useSelector((state) => state.domains));
	const dispatch = useDispatch();
	const actions = [
		{
			render: (item) => {
				return (
					<EuiLink
						onClick={() => {
							dispatch(deleteDomain(item));
							dispatch(deleteResult(item));
						}}
						color="danger"
					>
						Delete
					</EuiLink>
				);
			},
		},
	];

	const pagination = {
		pageIndex: pageIndex,
		pageSize: 8,
		totalItemCount: Object.keys(useSelector((state) => state.domains)).length,
		hidePerPageOptions: true,
	};

	const columns = [
		{
			field: "domain",
			name: "Domain",
			width: "70%",
			footer: <span>Total number of entries: {pagination.totalItemCount}</span>,
		},
		{ field: "status", name: "Status" },
		{
			name: "Actions",
			actions,
			footer: (
				<EuiLink
					onClick={() => {
						dispatch(clearDomains());
						dispatch(clearResults());
					}}
				>
					Delete All
				</EuiLink>
			),
		},
	];
	const onTableChange = ({ page = {} }) => {
		const { index: pageIndex } = page;
		setPageIndex(pageIndex);
	};

	return (
		<EuiBasicTable
			columns={columns}
			items={domains
				.slice(pageIndex * pagination.pageSize)
				.slice(0, pagination.pageSize)}
			itemId="id"
			pagination={pagination}
			noItemsMessage=""
			onChange={onTableChange}
		/>
	);
};
