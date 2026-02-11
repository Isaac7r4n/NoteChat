import Logout from "@/components/ui/auth/Logout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/lib/axios";
import {toast} from "sonner";

const ChatAppPage = () => {

    const user = useAuthStore((s) => s.user);

    const handleOnClick = async () => {
        try {
            await api.get('/users/test', {withCredentials: true});
            toast.success('good');
        } catch (error) {
            toast.error('failed');
            console.error(error);
        }
    }
    return (
        <div>
            {user?.username}
            <Logout/>

            <Button onClick={handleOnClick}>test</Button>
        </div>
    );
};

export default ChatAppPage;