const Apify = require("apify");
const fs = require("fs");

fs.rmdirSync(process.env.APIFY_LOCAL_STORAGE_DIR, { recursive: true });

process.on("message", (args) => {
	const domains = args[0];
	const config = args[1];
	const keywords = args[2];

	Apify.main(async () => {
		// Create a RequestQueue
		const requestQueue = await Apify.openRequestQueue();
		// Define the starting URL
		Object.keys(domains).map(async (domain) => {
			await requestQueue.addRequest({
				url: "http://" + domains[domain].domain,
				uniqueKey: domain,
				userData: { crawlType: "initial" },
			});
		});

		// Function called for each URL
		const handlePageFunction = async ({ request, $, body }) => {
			switch (request.userData.crawlType) {
				case "initial":
					process.send({
						type: "currentCrawl",
						payload: {
							url: request.url,
							id: request.uniqueKey,
							step: request.userData.crawlType,
							status: 200,
						},
					});
					break;
				default:
					throw new Error("No message configured for this crawlType");
			}

			console.log("Crawling " + request.url);
			const stringBody = body.toString().toLowerCase();
			keywords.forEach((keyword) => {
				if (stringBody.includes(keyword.label)) {
					process.send({
						type: "keywordOccurance",
						payload: {
							keyword: keyword,
							id: request.uniqueKey,
							location: request.loadedUrl,
						},
					});
				}
			});
			// Add all links from page to RequestQueue if relative Crawling is on
			if (config.relativeCrawling) {
				console.log("Enqueing relative links");
				const urlAsURL = new URL(request.url);
				await Apify.utils.enqueueLinks({
					$,
					requestQueue,
					baseUrl: request.loadedUrl,
					limit: config.limit ? parseInt(config.maxRequestLimit) : undefined,
					pseudoUrls: ["http[s?]://" + urlAsURL.hostname + "/[.+]/[.+]"],
				});
			}
		};

		// Function that handles Errors
		const handleFailedRequestFunction = async ({ request, error }) => {
			console.log("failed ", request.url, error);
			process.send({
				type: "currentCrawl",
				payload: {
					url: request.url,
					id: request.uniqueKey,
					step: request.userData.crawlType,
					status: error.toString(),
				},
			});
		};
		// Create a CheerioCrawler
		const crawler = new Apify.CheerioCrawler({
			requestQueue,
			handlePageFunction,
			handleFailedRequestFunction,
			maxRequestRetries: 0,
			maxConcurrency: 20,
		});
		// Run the crawler
		await crawler.run();
	});
});
