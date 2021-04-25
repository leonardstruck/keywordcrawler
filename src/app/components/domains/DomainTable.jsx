import { EuiBasicTable, EuiLink } from "@elastic/eui";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDomain, clearDomains } from "./domainSlice";

export const DomainTable = () => {
	const [pageIndex, setPageIndex] = useState(0);
	const dispatch = useDispatch();
	const actions = [
		{
			render: (item) => {
				return (
					<EuiLink onClick={() => dispatch(deleteDomain(item))} color="danger">
						Delete
					</EuiLink>
				);
			},
		},
	];

	const pagination = {
		pageIndex: pageIndex,
		pageSize: 8,
		totalItemCount: useSelector((state) => state.domains).length,
		hidePerPageOptions: true,
	};

	const columns = [
		{
			field: "domain",
			name: "Domain",
			width: "80%",
			footer: <span>Total number of entries: {pagination.totalItemCount}</span>,
		},
		{
			name: "Actions",
			actions,
			footer: (
				<EuiLink onClick={() => dispatch(clearDomains())}>Delete All</EuiLink>
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
			items={useSelector((state) => state.domains)
				.slice(pageIndex * pagination.pageSize)
				.slice(0, pagination.pageSize)}
			itemId="id"
			pagination={pagination}
			noItemsMessage=""
			onChange={onTableChange}
		/>
	);
};
