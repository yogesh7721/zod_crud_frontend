import React, { useEffect, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import { useDeleteUserMutation, useGetFormQuery, useUpdateUserMutation } from "../redux/formApi"

export const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Valid email is required" }),
    mobile: z.string().length(10, { message: "Mobile number must be exactly 10 digits" }),
    address: z.string().min(2, { message: "Address must be at least 2 characters" }),
    city: z.enum(["Jalna", "Sambhajinagar", "Pune", "Mumbai", "Delhi", "Ambad"], {
        message: "Please select a valid city",
    }),
    language: z.array(z.enum(["JavaScript", "HTML", "React", "Redux", "Node.js"])).min(1, {
        message: "Please select at least one language",
    }),
    gender: z.enum(["Male", "Female"], { message: "Gender is required" }),
    date: z.coerce.date({ message: "Invalid date format" }),
    terms: z.literal(true, { message: "You must accept the terms" }),
})

type Inputs = z.infer<typeof formSchema>

const Profile: React.FC = () => {
    const languages = ["JavaScript", "HTML", "React", "Redux", "Node.js"]
    const [loading, setLoading] = useState(false)
    const { data, error, isLoading } = useGetFormQuery()
    const [UpdateUser] = useUpdateUserMutation()
    const [deleteUser, { isSuccess: deleteSucess }] = useDeleteUserMutation()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [profile, setProfile] = useState<File | null>(null)

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(formSchema),
        defaultValues: { language: [] },
    })
    console.log(errors)
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
        }
    }

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeModal()
        }
        window.addEventListener("keydown", handleEscape)
        return () => window.removeEventListener("keydown", handleEscape)
    }, [])


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfile(e.target.files[0])
        }
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            setLoading(true)
            if (!selectedUser?._id) {
                toast.error("User ID is missing!")
                return
            }
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((v) => formData.append(`${key}[]`, v))
                } else {
                    formData.append(key, value as string)
                }
            })
            if (profile) {
                formData.append("profile", profile)
            }
            const response = await UpdateUser({ id: selectedUser._id, formData }).unwrap()
            console.log("Updated successfully:", response)
            toast.success("User updated successfully!")
            closeModal()
        } catch (error) {
            console.error("Error updating user:", error)
            toast.error("Failed to update user.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (deleteSucess) {
            toast.success("delete succcess")
        }
    }, [deleteSucess])



    if (isLoading) return <p className="text-center text-gray-600">Loading...</p>
    if (error) return <p className="text-center text-red-500">Error loading profile</p>

    const openModal = (user: any) => {
        setSelectedUser(user)
        setIsModalOpen(true)
        setValue("name", user.name)
        setValue("email", user.email)
        setValue("mobile", user.mobile)
        setValue("address", user.address)
        setValue("city", user.city)
        setValue("date", new Date(user.date))
        setValue("gender", user.gender)
        setValue("language", user.language || [])
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedUser(null)
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">User Profiles</h1>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 shadow-sm">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="p-3 border">id</th>
                            <th className="p-3 border">Name</th>
                            <th className="p-3 border">Email</th>
                            <th className="p-3 border">Mobile</th>
                            <th className="p-3 border">Language</th>
                            <th className="p-3 border">Gender</th>
                            <th className="p-3 border">Address</th>
                            <th className="p-3 border">Date</th>
                            <th className="p-3 border">Profile</th>
                            <th className="p-3 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.result?.map((user: any, index: number) => (
                            <tr key={user.email} className="text-center border-b">
                                <td className="p-4 w-16 text-center border font-semibold">{index + 1}</td>
                                <td className="p-3 border">{user.name}</td>
                                <td className="p-3 border">{user.email}</td>
                                <td className="p-3 border">{user.mobile}</td>
                                <td className="p-3 border">{user.language?.join(", ") || "N/A"}</td>
                                <td className="p-3 border">{user.gender}</td>
                                <td className="p-3 border">{user.address}, {user.city}</td>
                                <td className="p-3 border">{new Date(user.date).toLocaleDateString()}</td>
                                <td className="p-3 border">
                                    <img src={user.profile} alt={user.name} className="w-16 h-16 rounded-sm mx-auto" />
                                </td>
                                <td className="p-3 border space-x-2">
                                    <button onClick={() => openModal(user)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
            {isModalOpen && (
                <div id="editUserModal"
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
                    onClick={handleModalClick}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl h-[85vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center">Edit User</h2>

                        <form
                            className="bg-gray-100 shadow-md rounded-xl p-6 w-full border border-gray-400"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                <input type="text" {...register("name")} placeholder="Enter your name" className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500" />
                                <input type="email" {...register("email")} placeholder="Enter your email" className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500" />
                                <input type="text" {...register("address")} placeholder="Enter your address" className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500" />
                                <input type="text" {...register("mobile")} placeholder="Enter your mobile" className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500" />
                                <input type="date" {...register("date")} className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500" />
                                <select {...register("city")} className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select your city</option>
                                    {["Jalna", "Sambhajinagar", "Pune", "Mumbai", "Delhi", "Ambad"].map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-6">
                                <label className="block text-gray-700 font-medium">Gender</label>
                                <div className="flex gap-6 mt-2">
                                    {["Male", "Female"].map((gender) => (
                                        <label key={gender} className="flex items-center gap-2">
                                            <input type="radio" value={gender} {...register("gender")} className="h-5 w-5" />
                                            {gender}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block font-bold">Select Language</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                                    {languages.map((lang) => (
                                        <label key={lang} className="flex  space-x-2">
                                            <input id={lang} type="checkbox" {...register("language")} value={lang} className="h-5 w-5" />
                                            <span>{lang}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-gray-700 font-medium">Upload Profile Picture</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div className="mt-6">
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" {...register("terms")} className="h-4 w-4" />
                                    <span className="text-blue-600 font-semibold">I agree to the terms and conditions</span>
                                </label>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                    {loading ? "Updating..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    )
}

export default Profile