"use client"


import { BASEURL } from "@/lib/url"
import { useEffect } from "react"

export default function ProfilePage() {

    useEffect(() => {

            const checkUser = async() =>  {
            const res = await fetch(`${BASEURL}/api/v1/owner/profile`, {
                method : "GET",
                credentials : "include"
            })

            if(res.ok) {
                const data = await res.json()
                console.log(data)
            }else {
                console.log("No data")
            }
            }

            checkUser()

    }, [])



    return(
        <>
            <h1>Profile Page </h1>
        </>
    )
}
