"use client"


import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { request } from "@/lib/base-client"
import { UserProfileDetails, UserProfileRespone } from "@/lib/output/response"
import { Award, BookOpen, CreditCard, CreditCardIcon, Locate, LogOut, LucideProps, Mail, MapPin, Pencil, Phone, RefreshCcw, RefreshCw, RefreshCwOff } from "lucide-react"
import { useEffect, useState } from "react"
import { primary_color } from "../color"
import { useRouter } from "next/navigation"

export default function ProfilePage() {

    const router = useRouter()
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

            {/* {JSON.stringify(info, null, 0)} */}


            <div className="flex justify-between mb-8">
                <h1>Profile Page</h1>

                <Button>
                    <Pencil/> Edit Profile
                </Button>
            </div>

            {info && <TopCard data={info}/>}

            <div className="flex justify-between mt-8 gap-4 mb-8">
                <ProfileSecondCard title="Credits" details={info?.creditsBalance.toString() || "0"} icon={CreditCardIcon}/>
                <ProfileSecondCard title="Books Listed" details={info?.bookListed.toString() || "0"} icon={BookOpen}/>
                <ProfileSecondCard title="Exchanges" details={info?.exchanges.toString() || "0"} icon={RefreshCw}/>
                <ProfileSecondCard title="Rating" details={info?.profileCard.rating.toString() || "0"} icon={Award}/>
            </div>

            <ContactInfoCard phone={info?.contactInfo.phone || "No Phone"} email={info?.contactInfo.prefferedContact || "No Email"} address={info?.contactInfo.address || "No Address"}/>

            <AccountSettings />
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


function ProfileSecondCard({title, details, icon : Icon} : 
    {title : string, details : string, icon : React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >} ) {

       

        return(
            <Card className="w-1/4">
                <div className="flex justify-between">
                    <div className="ms-4">
                        <h1 style={{color : primary_color}}>{title}</h1>
                        <h1 className="font-bold">{details}</h1>
                    </div>
                    <Icon className="me-2 size-10"/>
                </div>
            </Card>
        )
}

function ContactInfoCard({phone, address, email} :{phone : string, address : string, email : string}) {
    return(
        <Card className="mb-8">
            <div className="flex justify-between ms-4 me-4">
                <h1>Contact Information</h1>
                <Button>
                    <Pencil/> Edit
                </Button>
            </div>

            <div className="ms-4 flex gap-4">
                <Phone/> <h1>{phone}</h1>
            </div>
            <div  className="ms-4 flex gap-4">
                <MapPin/> <h1>{address}</h1>
            </div>
            <div  className="ms-4 flex gap-4">
                <Mail/> <h1> Preferred : {email}</h1>
            </div>
        </Card>
    )
}


function AccountSettings() {
    return(
        <Card className="mb-8">
            <h1 className="ms-4">Account Settings</h1>
            <div className="flex justify-between ms-4 me-4">
                <div>
                    <h1>Sign out of BookEx</h1>
                    <h1>You can sign back in anytime</h1>
                </div>
                <Button>
                    <LogOut/>Sign Out
                </Button>
            </div>
        </Card>
    )
}
