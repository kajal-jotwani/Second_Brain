import { useRef, useState } from "react"; 
import { CrossIcon } from "../icons/CrossIcon"; 
import { Button } from "./Button";
import { Input } from "./Input"; 
import { BACKEND_URL } from "../config"; 
import axios from "axios"; 

// Enum to represent different types of content
enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter"
}

// Interface for the props passed to the CreateContentModal component
interface CreateContentModalProps {
    open: boolean; 
    onClose: () => void; 
}

// CreateContentModal component definition
export function CreateContentModal({ open, onClose }: CreateContentModalProps) {
    // References to the input fields for title and link
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    // State to manage the selected content type
    const [type, setType] = useState(ContentType.Youtube);

    // Function to handle adding new content
    async function addContent() {
        const title = titleRef.current?.value; 
        const link = linkRef.current?.value; 

        // Making a POST request to add new content
        await axios.post(`${BACKEND_URL}/api/v1/content`, {
            link,
            title,
            type
        }, {
            headers: {
                "Authorization": localStorage.getItem("token") || "" // Including the authorization token
            }
        });

        // Closing the modal after adding content
        onClose();
    }

    return (
        <div>
            {open && (
                // Modal background overlay
                <div>
                    <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 opacity-60 flex justify-center"></div>
                    {/* Modal content container */}
                    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center">
                        <div className="flex flex-col justify-center">
                            <span className="bg-white opacity-100 p-4 rounded fixed">
                                {/* Close button */}
                                <div className="flex justify-end">
                                    <div onClick={onClose} className="cursor-pointer">
                                        <CrossIcon />
                                    </div>
                                </div>
                                {/* Input fields for title and link */}
                                <div>
                                    <Input reference={titleRef} placeholder="Title" />
                                    <Input reference={linkRef} placeholder="Link" />
                                </div>
                                {/* Content type selection */}
                                <div>
                                    <h1>Type</h1>
                                    <div className="flex gap-1 justify-center pb-2">
                                        {/* Button to select YouTube type */}
                                        <Button
                                            text="Youtube"
                                            variant={type === ContentType.Youtube ? "primary" : "secondary"}
                                            onClick={() => setType(ContentType.Youtube)}
                                        />
                                        {/* Button to select Twitter type */}
                                        <Button
                                            text="Twitter"
                                            variant={type === ContentType.Twitter ? "primary" : "secondary"}
                                            onClick={() => setType(ContentType.Twitter)}
                                        />
                                    </div>
                                </div>
                                {/* Submit button */}
                                <div className="flex justify-center">
                                    <Button onClick={addContent} variant="primary" text="Submit" />
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}