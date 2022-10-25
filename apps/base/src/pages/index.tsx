import { useState, useEffect } from "react";

import Loader from "../comp/meta/Loader";

export default function Index() {
	const [ mounted, setMounted ] = useState(false);

	useEffect(() => setMounted(false), [])

	return !mounted ? <Loader /> : (
		<p>plutonus.host is back baby! yeeeeeehawwww</p>
	);
}

