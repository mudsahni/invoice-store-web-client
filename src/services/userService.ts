import {apiClient} from "@/lib/api";
import {API_ENDPOINTS} from "@/lib/api/endpoints";
import {UserData} from "@/types/auth";
import {CollectionsService} from "@/services/collectionService";


export class UserService {

    async getUser(id: string): Promise<UserData> {
        const response = await apiClient.get<UserData>(
            API_ENDPOINTS.USERS.GET(id)
        );

        return response
    }

}

export const userService = new UserService();
