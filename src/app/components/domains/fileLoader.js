import lineReader from "line-reader";
import { v4 as uuid } from "uuid";

export default function (fileLocation) {
	const promise = new Promise((resolve, reject) => {
		let result = [];
		lineReader.eachLine(
			fileLocation,
			{ separator: /\r\n?|\n/ },
			(line) => {
				if (line.length > 0) {
					const uid = uuid();
					result.push({ domain: line, id: uid, status: "pending" });
				}
			},
			(err) => {
				err ? reject(err) : resolve(result);
			}
		);
	});
	return promise;
}