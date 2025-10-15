import { input_bg } from "@/app/color";
import { Input } from "../ui/input";

export default function SearchBar() {
    return(
        <div className="mb-4 max-w-5xl mx-auto">
            <Input className="border focus:border-[#2B9B9B] focus-visible:border-[#2B9B9B] focus-visible:ring-0 focus-visible:ring-offset-5 focus:outline-3" 
             style={{backgroundColor : input_bg}} placeholder="Search books by title, author, or category"/>
        </div>
    )
}