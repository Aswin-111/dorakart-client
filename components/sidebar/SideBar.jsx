"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode"; // <-- Import the library

export default function Sidebar() {
    const router = useRouter();
    const [userRole, setUserRole] = useState(null); // State to hold the user's role

    useEffect(() => {
        // This effect runs only on the client-side after the component mounts
        try {
            const token = localStorage.getItem("dorakart_acc_token");
            if (token) {
                // Use jwtDecode for robust and safe token parsing
                const payload = jwtDecode(token); // <-- Use jwtDecode here
                
                // Set the role from the token payload, default to empty string if not found
                setUserRole(payload.role || ""); 
            } else {
                // If no token, set role to empty so nothing role-specific is shown
                setUserRole("");
            }
        } catch (error) {
            console.error("Failed to decode token:", error);
            // Handle potential errors (e.g., malformed or expired token)
            setUserRole(""); // Default to empty role on error
        }
    }, []); // The empty dependency array ensures this runs only once on mount

    const handleRoute = (route) => {
        router.push(`/${route}`);
    }

    // To prevent a brief flash of content before the role is determined,
    // we can return null (or a loading spinner) until the userRole is set.
    if (userRole === null) {
        return null; 
    }

    return (
        <aside className="w-80 h-screen p-4 bg-white shadow-md border-r">
            <div className="flex flex-col gap-4 h-full">
                <h1 className="text-base font-medium">Dorakart</h1>
                <nav className="flex flex-col gap-2">
                    
                    {/* --- Conditional Rendering based on Role --- */}

                    {/* Show "Orders" only if the role is 'user' */}
                    {userRole === 'user' && (
                        <Accordion type="multiple" className="w-full">
                             <AccordionItem value="orders" className="border-none">
                                <AccordionTrigger className="flex items-center gap-3 px-3 py-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                        <path d="M72,104a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,104Zm8,40h96a8,8,0,0,0,0-16H80a8,8,0,0,0,0,16ZM232,56V208a8,8,0,0,1-11.58,7.15L192,200.94l-28.42,14.21a8,8,0,0,1-7.16,0L128,200.94,99.58,215.15a8,8,0,0,1-7.16,0L64,200.94,35.58,215.15A8,8,0,0,1,24,208V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Zm-16,0H40V195.06l20.42-10.22a8,8,0,0,1,7.16,0L96,199.06l28.42-14.22a8,8,0,0,1,7.16,0L160,199.06l28.42-14.22a8,8,0,0,1,7.16,0L216,195.06Z" />
                                    </svg>
                                    <p className="text-sm font-medium">Orders</p>
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pb-2 pt-1 text-sm text-muted-foreground flex flex-col gap-1">
                                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors" onClick={() => handleRoute("orders/all-orders")}>All orders</button>
                                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors" onClick={() => handleRoute("orders/leads")}>Leads</button>
                                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors" onClick={() => handleRoute("orders/tasks")}>Tasks</button>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )}

                    {/* Show "Designing" only if the role is 'designer' */}
                    {userRole === 'designer' && (
                        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md" onClick={() => handleRoute("designing")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z" />
                            </svg>
                            <p className="text-sm font-medium">Designing</p>
                        </div>
                    )}
                    
                    {/* Show "Printing" only if the role is 'printer' */}
                    {userRole === 'printer' && (
                        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md" onClick={() => handleRoute("printing")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M214.67,72H200V40a8,8,0,0,0-8-8H64a8,8,0,0,0-8,8V72H41.33C27.36,72,16,82.77,16,96v80a8,8,0,0,0,8,8H56v32a8,8,0,0,0,8,8H192a8,8,0,0,0,8-8V184h32a8,8,0,0,0,8-8V96C240,82.77,228.64,72,214.67,72ZM72,48H184V72H72ZM184,208H72V160H184Zm40-40H200V152a8,8,0,0,0-8-8H64a8,8,0,0,0-8,8v16H32V96c0-4.41,4.19-8,9.33-8H214.67c5.14,0,9.33,3.59,9.33,8Zm-24-52a12,12,0,1,1-12-12A12,12,0,0,1,200,116Z" />
                            </svg>
                            <p className="text-sm font-medium">Printing</p>
                        </div>
                    )}
                    
                    {/* Show "Shipping" only if the role is 'shipping' */}
                    {userRole === 'shipping' && (
                         <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md" onClick={()=>handleRoute("shipping")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M216.49,154.71l-37.77-21.81V120a24,24,0,0,0-48,0v12.9L92.95,167.76a8,8,0,0,0-3.91,6.86V224a8,8,0,0,0,8,8H192a8,8,0,0,0,8-8V174.62l20.49,11.83a8,8,0,1,0,7.8-13.74ZM152,120a8,8,0,0,1,16,0v9.44l-16-9.24Zm32,96H104V176.34l48-27.74,32,18.49Z" />
                            </svg>
                            <p className="text-sm font-medium">Shipping</p>
                        </div>
                    )}
                </nav>

                {/* --- Logout Dialog (Unchanged) --- */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="mt-auto text-red-600 border-red-600 hover:bg-red-50">
                            Logout
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Confirm Logout</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-muted-foreground">Are you sure you want to logout?</p>
                        <DialogFooter className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => document.activeElement.blur()}>Cancel</Button>
                            <Button
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => {
                                    localStorage.removeItem("dorakart_acc_token");
                                    window.location.href = "/login";
                                }}
                            >
                                Logout
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </aside>
    );
}

