import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'POST' && req.method !== 'DELETE'){
        return res.status(405).end();
    }

    try{
         const {userId} = req.body;

         const {currentUser} = await serverAuth(req,res);

         if(!userId || typeof userId !== 'string'){
            throw new Error('invalid id');
         }

         const user = prisma.user.findUnique({
            where:{
                id:userId
            }
         });

         if(!user){
            throw new Error('invalid id');
         }

         let updatedFollowingIds = [...(user.followingIds || [])];

         if(req.method === 'POST'){
            updatedFollowingIds.push(userId);

            //Notification Part Start

            try{
                await prisma.notification.create({
                    data:{
                        body:'someone followed you!',
                        userId,
                    },
                });

                await prisma.user.update({
                    where:{
                        id:userId,
                    },
                    data:{
                        hasNotications:true,
                    }
                });
            } catch(err){
                console.log(err);
            }

            //notification part end
         }

         if(req.method === 'DELETE'){
            updatedFollowingIds = updatedFollowingIds.filter((followingId) => followingId !== userId );
         }

         const updatedUser = await prisma.user.update({
            where:{
                id:currentUser.id
            },
            data:{
                followingIds:updatedFollowingIds
            }
         });

         return res.status(200).json(updatedUser);
    }catch(err){
        console.log(err);
        return res.status(400).end();
    }
}