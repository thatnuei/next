export default function LoadingOverlay({ text }: { text: string }) {
	const dotStyle = `w-5 h-5 rounded-full`
	return (
		<div
			className={`fixed inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-50`}
		>
			<div className={`grid grid-cols-2 grid-rows-2 gap-4 p-6 spin-animation`}>
				<div className={`${dotStyle} bg-blue-500`}></div>
				<div className={`${dotStyle} bg-clouds`}></div>
				<div className={`${dotStyle} bg-clouds`}></div>
				<div className={`${dotStyle} bg-blue-500`}></div>
			</div>
			<p className={`text-2xl font-condensed`}>{text}</p>
		</div>
	)
}
