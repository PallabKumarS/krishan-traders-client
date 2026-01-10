import MainStore from "@/components/modules/MainStore";
import Container from "@/components/shared/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Main Store | Krishan Traders",
	description: "Krishan Traders - Main Store",
};

export default function Home() {
	return (
		<Container>
			<MainStore />
		</Container>
	);
}
