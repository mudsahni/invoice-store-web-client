import {UserData} from "@/types/auth";

export interface NavigationTypeProps {
    navigation: { name: string, href: string }[],
    pathname: string,
    user: UserData | null,
}
