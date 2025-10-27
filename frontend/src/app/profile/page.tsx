"use client"


import { Card } from "@/components/ui/card"
import { request } from "@/lib/base-client"
import { UserProfileDetails, UserProfileRespone } from "@/lib/output/response"
import { useEffect, useState } from "react"

export default function ProfilePage() {

    const [info, setInfo] = useState<UserProfileDetails>()

    useEffect(() => {

            const checkUser = async() =>  {

            try{
                const response = await request("api/v1/owner/profile", {
                    method : "GET",
                    credentials : "include"
                })
                const data : UserProfileRespone = await response.json()
                const details = data.data
                setInfo(details)

            }catch(error) {

            }
        }
        
        checkUser()

    }, [])



    return(
        <section className="mb-4 max-w-5xl mx-auto">
            <h1>Profile Page </h1>

            {info && <TopCard data={info}/>}
        </section>
    )
}


function TopCard ({data} : {data : UserProfileDetails}) {
    return(
        <Card >
            
            <div className="flex ">
                <div className="px-5 py-5">

                </div>
                <div>
                    <h1>{data.profileCard.name}</h1>
                    <h1>{data.profileCard.email}</h1>
                    <h1>{data.profileCard.rating}</h1>
                    <h1>{data.profileCard.memberSince}</h1>
                </div>

                <div>
                    <h1>{data.profileCard.bio}</h1>
                    <h1>{data.profileCard.liveIn}</h1>
                </div>
            </div>
        </Card>
    )
}
