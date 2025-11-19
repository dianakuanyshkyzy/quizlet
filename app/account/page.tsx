import Header from "@/components/Header";
export default function AccountPage() {
  return (
    <>
      <Header />
      <div className="w-full max-w-xl mx-auto p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Account Settings</h1>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500 text-sm">
              img
            </div>
            <input
              type="file"
              accept="image/*"
              className="border p-2 rounded-lg w-full"
            />
          </div>

          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-xl w-full"
          />

          <input
            type="text"
            placeholder="Surname"
            className="border p-3 rounded-xl w-full"
          />

          <button className="bg-black text-white rounded-xl py-3 text-lg hover:opacity-80 transition">
            Save
          </button>
        </div>
      </div>
    </>
  );
}
