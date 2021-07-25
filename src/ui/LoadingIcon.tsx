export default function LoadingIcon() {
	const dotStyle = `w-5 h-5 rounded-full`
	return (
		<div
			className={`grid grid-cols-2 grid-rows-2 gap-4 p-6 spin-animation place-content-center`}
		>
			<div className={`${dotStyle} bg-blue-500`}></div>
			<div className={`${dotStyle} bg-clouds`}></div>
			<div className={`${dotStyle} bg-clouds`}></div>
			<div className={`${dotStyle} bg-blue-500`}></div>
		</div>
	)
}
