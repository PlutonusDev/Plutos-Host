import BarLoader from "react-spinners/BarLoader";

export default function Loader({ label }: { label?: string }) {
	return (
		<div className="flex flex-col justify-center items-center place-items-center h-screen bg-gray-900 my-auto">
			<img src="/static/images/logo-dark.png" className="mb-4 h-16 animate-pulse" alt="" />
			<div className="my-3 flex">
				<BarLoader loading={true} color="#d6d6d6" height={5} width={200} />
			</div>
			<p className="text-gray-50 text-center mt-4 animate-pulse text-lg">{label}</p>
		</div>
	);
}
