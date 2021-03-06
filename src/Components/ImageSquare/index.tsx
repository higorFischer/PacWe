import { useEffect, useRef } from "react";

export const ImageSquare = ({ data, top, left, right, bottom }: any) => {
	const imgRef = useRef<any>();

	useEffect(() => {
		imgRef.current.src = data;
	}, [data]);

	return <img ref={imgRef} height={200} width={200} />;
};
