import { TbLoader2 } from "react-icons/tb";

export default function LoadingPage (){
    return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <TbLoader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="mt-2 text-lg">Loading...</p>
            </div>
    );
}