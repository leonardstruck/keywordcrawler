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
				/>
			</EuiFormRow>
			<EuiHorizontalRule />
			<EuiFormFieldset legend={{ children: "crawling algorithm fine tuning" }}>
				<EuiSwitch
					label="crawl for keyword occurance in sitemap"
					checked={crawlerConfig.crawlSitemap}
					onChange={(e) => toggle(e)}
					name="crawlSitemap"
				/>
				<EuiSpacer size="s" />
				{keywords.length > 1 && (
					<div>
						<EuiSwitch
							label="skip further crawling on occurance of one keyword"
							checked={crawlerConfig.skipOnOccurance}
							onChange={(e) => toggle(e)}
							name="skipOnOccurance"
						/>
						<EuiSpacer size="s" />
					</div>
				)}
				<EuiSwitch
					label="add relative hyperlinks to queue"
					checked={crawlerConfig.relativeCrawling}
					onChange={(e) => toggle(e)}
					name="relativeCrawling"
				/>
				<EuiSpacer size="s" />
				{crawlerConfig.relativeCrawling && (
					<div>
						<EuiSwitch
							label="limit amount of relative hyperlinks"
							name="limit"
							checked={crawlerConfig.limit}
							onChange={(e) => toggle(e)}
						/>
						<EuiSpacer size="s" />
					</div>
				)}
				{crawlerConfig.limit && crawlerConfig.relativeCrawling && (
					<EuiFieldNumber
						compressed
						style={{ width: 100 }}
						value={crawlerConfig.maxRequestLimit}
						aria-label="maximal amount of relative hyperlinks"
						onChange={(e) =>
							e.target.value != "" &&
							e.target.value >= 1 &&
							dispatch(changeLimit(e.target.value))
						}
					/>
				)}
			</EuiFormFieldset>
		</div>
	);
};
