import { MessageSquare, Users } from "lucide-react";
import { usePathname } from "next/navigation"
import { useMemo } from "react";

export const useNavigation = () => {
    const pathname = usePathname();
    const paths = useMemo(() =>[
        {
            name: "converstions",
            href: "/conversations",
            icon: <MessageSquare/>,
            active: pathname.startsWith("/conversations"),
        },
        {
            name: "friends",
            href: "/friends",
            icon: <Users/>,
            active: pathname.startsWith("/friends"),
        }

    ],[pathname]);
    return paths;
}