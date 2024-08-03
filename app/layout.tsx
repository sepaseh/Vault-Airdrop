import type { Metadata } from "next";

import "./styles/index.scss";

export const metadata: Metadata = {
	title: "Vault",
	description: "Vault",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
