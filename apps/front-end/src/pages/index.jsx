// NextJs import
import dynamic from "next/dynamic";

// View import
const MainView = dynamic(() => import("../views/main-view"), {
  ssr: false,
});

export default function Home() {
  return <MainView />;
}
