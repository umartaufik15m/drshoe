import { DropPointSection } from "@/components/sections/DropPointSection";
import { OrderFlowSection } from "@/components/sections/OrderFlowSection";
import { getDropPoints } from "@/lib/queries";

export default async function DropPointPage() {
  const dropPoints = await getDropPoints();
  return (
    <>
      {dropPoints.length ? <DropPointSection dropPoints={dropPoints} /> : null}
      <OrderFlowSection />
    </>
  );
}
