"use client"


import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { request } from "@/lib/base-client"
import { UserProfileRespone } from "@/lib/output/response"
import { Award, BookOpen, CreditCardIcon, LocationEdit, LogOut, LucideProps, Mail, MapPin, Pencil, Phone, RefreshCw, Star, TimerIcon } from "lucide-react"
import { useAuthStore } from "@/lib/model/auth-store";
import { useEffect, useState } from "react"
import { primary_color } from "../color"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {

    const router = useRouter()
    // Use a loose type here because backend `owner/profile` includes
    // profileCard, creditsBalance, bookListed, exchanges and contactInfo.
    type ProfileData = any;
    const [info, setInfo] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Edit dialog state
    const [editOpen, setEditOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState<string | null>(null);
    const [editAddress, setEditAddress] = useState<string | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const [editSuccess, setEditSuccess] = useState<string | null>(null);

    const goCredits   = () => router.push("/credits");
    const golist     = () => router.push("/profile/list");
    const goExchanges = () => router.push("/exchanges");
    const goRating    = () => router.push("/profile/rating");

    useEffect(() => {
        const fetchProfile = async () => {
            try{
                setLoading(true)
                setError(null)
                const response = await request("api/v1/owner/profile", {
                    method : "GET",
                    credentials : "include"
                })
                const json  = (await response.json()) as UserProfileRespone
                console.log("[Profile] raw:", json);

                // API returns data object with profileCard, creditsBalance, bookListed, exchanges, contactInfo
                setInfo(json.data)
                console.log("[Profile] fetched", json.data);
            }catch(e: any) {
                console.error("Failed to fetch profile", e)
                setError(e?.message ?? "Failed to fetch profile")
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])



    return(
        <section className="mb-4 max-w-5xl mx-auto">
            <div className="flex justify-between mb-8">
                <h1>Profile Page</h1>

                                <Dialog open={editOpen} onOpenChange={(open) => {
                                        setEditOpen(open);
                                        if (open && info) {
                                                setEditName(info.profileCard?.name || "");
                                                setEditBio(info.profileCard?.bio ?? "");
                                                setEditAddress(info.profileCard?.liveIn ?? info.profileCard?.liveIn ?? "");
                                        }
                                }}>
                                    <Button onClick={() => setEditOpen(true)}>
                                        <Pencil/> Edit Profile
                                    </Button>

                                    <DialogContent className="max-w-lg">
                                        <DialogHeader>
                                            <DialogTitle>Edit Profile</DialogTitle>
                                            <DialogDescription>Update your name, bio and address.</DialogDescription>
                                        </DialogHeader>

                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                setEditLoading(true);
                                                setEditError(null);
                                                setEditSuccess(null);
                                                try {
                                                    if (!editName || editName.trim().length === 0) {
                                                        setEditError("Name is required");
                                                        setEditLoading(false);
                                                        return;
                                                    }

                                                    const payload = {
                                                        name: editName,
                                                        bio: editBio,
                                                        address: editAddress,
                                                    };

                                                    const resp = await request("api/v1/owner/update-profile", {
                                                        method: "PUT",
                                                        credentials: "include",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify(payload),
                                                    });
                                                    await resp.json();
                                                    setEditSuccess("Profile updated successfully.");
                                                    // refresh profile
                                                    try {
                                                        setLoading(true);
                                                        const r = await request("api/v1/owner/profile", { method: "GET", credentials: "include" });
                                                        const j = await r.json();
                                                        setInfo(j.data);
                                                    } catch (err) {
                                                        console.error("Failed to refresh profile", err);
                                                    } finally {
                                                        setLoading(false);
                                                    }
                                                    // close after a short delay
                                                    setTimeout(() => setEditOpen(false), 700);
                                                } catch (err: any) {
                                                    console.error("Failed to update profile", err);
                                                    setEditError(err?.message ?? "Failed to update profile");
                                                } finally {
                                                    setEditLoading(false);
                                                }
                                            }}
                                            className="space-y-4 mt-4"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Bio</label>
                                                <Textarea value={editBio ?? ""} onChange={(e) => setEditBio(e.target.value)} className="mt-1" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                                <Input value={editAddress ?? ""} onChange={(e) => setEditAddress(e.target.value)} className="mt-1" />
                                            </div>

                                            {editError && <p className="text-red-600">{editError}</p>}
                                            {editSuccess && <p className="text-green-600">{editSuccess}</p>}

                                            <div className="flex justify-end gap-3">
                                                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                                                <Button type="submit" className="bg-teal-600" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
            </div>

            {loading && <p>Loading profile…</p>}
            {error && <p className="text-red-600">{error}</p>}

            {info && (
              <>
                <TopCard data={info}/>

                <div className="flex justify-between mt-8 gap-4 mb-8">
                  <ProfileSecondCard onClick={goCredits} title="Credits" details={info?.creditsBalance.toString() || "0"} icon={CreditCardIcon}/>
                  <ProfileSecondCard onClick={golist} title="Books Listed" details={info?.bookListed.toString() || "0"} icon={BookOpen}/>
                  <ProfileSecondCard onClick={goExchanges} title="Exchanges" details={info?.exchanges.toString() || "0"} icon={RefreshCw}/>
                  <ProfileSecondCard onClick={goRating} title="Rating" details={info?.profileCard.rating.toString() || "0"} icon={Award}/>
                </div>

                {info.contactInfo && (
                  <ContactInfoCard phone={info.contactInfo.phone || "No Phone"} email={info.contactInfo.prefferedContact || "No Email"} address={info.contactInfo.address || "No Address"}/>
                )}
              </>
            )}

            <AccountSettings />
        </section>
    )
}


function TopCard ({data} : {data : any}) {
    return (
        <Card className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-teal-600 flex items-center justify-center text-white text-2xl font-semibold">
                        {data.profileCard?.name ? String(data.profileCard.name).charAt(0).toUpperCase() : "U"}
                    </div>
                </div>

                {/* Main info */}
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">{data.profileCard?.name}</h2>
                        <span className="text-sm text-gray-500">• {data.profileCard?.email}</span>
                    </div>

                    <p className="mt-2 text-sm text-gray-600 max-w-2xl">{data.profileCard?.bio ?? "No bio yet."}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <strong className="font-medium text-gray-900">{data.profileCard?.rating ?? 0}</strong>
                        </span>

                        <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                            <TimerIcon className="w-4 h-4 text-gray-500" />
                            Member since {data.profileCard?.memberSince ?? "-"}
                        </span>

                        <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                            <LocationEdit className="w-4 h-4 text-teal-600" />
                            {data.profileCard?.liveIn ?? "-"}
                        </span>
                    </div>
                </div>

                {/* Stats card */}
                <div className="w-full md:w-48 flex flex-col items-center md:items-end">
                    <div className="text-sm text-gray-500 mb-2">Summary</div>
                    <div className="bg-white border border-gray-100 rounded-lg w-full p-3 shadow-sm">
                        <div className="flex justify-between py-1">
                            <span className="text-sm text-gray-600">Credits</span>
                            <span className="font-semibold">{data.creditsBalance ?? 0}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-sm text-gray-600">Books Listed</span>
                            <span className="font-semibold">{data.bookListed ?? 0}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-sm text-gray-600">Exchanges</span>
                            <span className="font-semibold">{data.exchanges ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}


function ProfileSecondCard({title, details, icon : Icon, onClick} : 
    {title : string, details : string, onClick : VoidFunction,icon : React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >} ) {

       

        return(
                <Card onClick={onClick} className="w-1/4">
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
    const router = useRouter();
    const setIsAuth = useAuthStore((s) => s.setIsAuth);
    const [signoutLoading, setSignoutLoading] = useState(false);
    const [signoutError, setSignoutError] = useState<string | null>(null);

    const handleSignOut = async () => {
        setSignoutError(null);
        setSignoutLoading(true);
        try {
            await request("api/v1/logout", {
                method: "POST",
                credentials: "include",
            });

            // update local auth state and navigate to home
            setIsAuth(false);
            router.push("/");
        } catch (err: any) {
            console.error("Sign out failed", err);
            setSignoutError(err?.message ?? "Failed to sign out");
        } finally {
            setSignoutLoading(false);
        }
    };

    return (
        <Card className="mb-8">
            <h1 className="ms-4">Account Settings</h1>
            <div className="flex justify-between ms-4 me-4">
                <div>
                    <h1>Sign out of BookEx</h1>
                    <h1>You can sign back in anytime</h1>
                </div>
                <div className="flex flex-col items-end">
                    <Button onClick={handleSignOut} disabled={signoutLoading}>
                        <LogOut /> {signoutLoading ? "Signing out..." : "Sign Out"}
                    </Button>
                    {signoutError && <p className="text-red-600 mt-2">{signoutError}</p>}
                </div>
            </div>
        </Card>
    )
}
