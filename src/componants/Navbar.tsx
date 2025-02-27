import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gradient-to-r from-yellow-500 via-purple-500 to-green-600   shadow-md p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-white font-bold text-2xl tracking-wide">
                    ZOD....
                </div>
                <div className="flex space-x-4">
                    <Link to="/" className="px-4 py-2 text-white font-bold underline text-xl  text-xl">Form</Link>
                    <Link to="/profile" className="px-4 py-2 text-white hover:underline font-bold  text-xl">profile</Link>
                    <Link to="/" className="px-4 py-2 text-white hover:underline font-bold text-xl">formData</Link>
                    <Link to="/formdata" className="px-4 py-2 text-white hover:underline font-bold  text-xl ">Register</Link>
                    {/* <Link to="/formdata" className="px-4 py-2 text-white hover:underline font-bold  text-xl">Dashboard</Link> */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
