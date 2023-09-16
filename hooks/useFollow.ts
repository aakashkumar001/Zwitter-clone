import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import useUser from "./useUser";

const useFollow = (userId:string) => {
    const { data: currentUser, mutate: mutateCurrentUser} = useCurrentUser();
    const {mutate:mutatefetchedUser} = useUser(userId);

    const loginModal = useLoginModal();

    const isFollowing = useMemo(() => {
        const list = currentUser?.followingIds || [];

       return list.includes(userId);
    },[currentUser,userId]);

    const toggleFollow = useCallback(async() => {
        if(!currentUser){
            return loginModal.onOpen();
        }

        try{
            let request;

            if(isFollowing){
                request = () => axios.delete('/api/follow', {data:{userId}});
            }else{
                request = () => axios.post('/api/follow', {userId});
            }

            await request();
            mutateCurrentUser();
            mutatefetchedUser();

            toast.success("Success");
        } catch (err){
            toast.error("Something went wrong");
        }
    },[currentUser,isFollowing,userId,mutateCurrentUser,mutatefetchedUser,loginModal])

    return {
        isFollowing,
        toggleFollow,
    }
}

export default useFollow;