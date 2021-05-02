import {
	EuiComboBox,
	EuiFormRow,
	EuiHorizontalRule,
	EuiSwitch,
	EuiFormFieldset,
	EuiFieldNumber,
	EuiSpacer,
} from "@elastic/eui";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addKeyword, changeKeywords } from "./keywordsSlice";
import { changeConfig, changeLimit } from "./crawlerSlice";

export const Configuration = () => {
	const dispatch = useDispatch();
	const onCreateOption = (keyword) => {
		dispatch(addKeyword({ label: keyword.toLowerCase() }));
	};

	const keywords = useSelector((state) => state.keywords);
	const crawlerConfig = useSelector((state) => state.crawler);
	const toggle = (e) =>
		dispatch(changeConfig({ [e.target.name]: e.target.checked }));
	return (
		<div>
			<EuiFormRow>
				<EuiComboBox
					noSuggestions
					placeholder="add keywords to search for"
					selectedOptions={keywords}
					onCreateOption={onCreateOption}
					onChange={(event) => dispatch(changeKeywords(event))}
					isDisabled={crawlerConfig.running}
				/>
			</EuiFormRow>
			<EuiHorizontalRule />
			<EuiFormFieldset legend={{ children: "Configuration" }} disabled={true}>
				<EuiSwitch
					label="crawl sitemap if provided"
					checked={crawlerConfig.crawlSitemap}
					onChange={(e) => toggle(e)}
					name="crawlSitemap"
					disabled={crawlerConfig.running}
				/>
				<EuiSpacer size="s" />
				<EuiSwitch
					label="add relative hyperlinks to queue"
					checked={crawlerConfig.relativeCrawling}
					onChange={(e) => toggle(e)}
					name="relativeCrawling"
					disabled={crawlerConfig.running}
				/>
				<EuiSpacer size="s" />
				{crawlerConfig.relativeCrawling && (
					<div>
						<EuiSwitch
							label="recursive crawling"
							name="limit"
							checked={crawlerConfig.limit}
							onChange={(e) => toggle(e)}
							disabled={crawlerConfig.running}
						/>
						<EuiSpacer size="s" />
					</div>
				)}
				{crawlerConfig.limit && crawlerConfig.relativeCrawling && (
					<EuiFormRow label="set a max depth limit for recursive crawling">
						<EuiFieldNumber
							compressed
							style={{ width: 100 }}
							value={crawlerConfig.maxRequestLimit}
							aria-label="maximal amount of relative hyperlinks"
							disabled={crawlerConfig.running}
							onChange={(e) =>
								e.target.value != "" &&
								e.target.value >= 1 &&
								dispatch(changeLimit(e.target.value))
							}
						/>
					</EuiFormRow>
				)}
			</EuiFormFieldset>
		</div>
	);
};
