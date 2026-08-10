import { Button } from "../ui/button";

const Header = () => {
  return (
    <header>
      <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
        <div>
          <h1 className="text-blue-500 font-medium">NocodeBuilder</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            className="h-9 w-20 border border-gray-300 bg-white text-gray-800
  hover:bg-gray-50"
          >
            Preview
          </Button>

          <Button className="h-9 w-20 bg-blue-600 text-white hover:bg-blue-700">
            Save
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
