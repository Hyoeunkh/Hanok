import InventoryList from "./InventoryList";

export default function LivePage() {
  return (
    <div className="flex h-screen w-full gap-2 p-2">
      <InventoryList />
      <div className="flex-1 bg-blue-500">영상</div>
      <div className="w-80 bg-green-500 p-4">채팅</div>
    </div>
  );
}
