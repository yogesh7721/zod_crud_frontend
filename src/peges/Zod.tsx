import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRegisterFormMutation } from "../redux/formApi"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { RegisterUserRequest } from "../redux/formApi"


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

const FormData = () => {
    const languages = ["JavaScript", "HTML", "React", "Redux", "Node.js"]
    const [registerForm, { isSuccess }] = useRegisterFormMutation()

    const [profile, setProfile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(formSchema),
        defaultValues: { language: [] },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfile(e.target.files[0])
        }
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const formattedData: RegisterUserRequest = {
                ...data,
                date: new Date(data.date).toISOString(),
                profile: profile || undefined,
            }

            const response = await registerForm(formattedData).unwrap()
            console.log("Success:", response)
            toast.success("Form submitted successfully!")
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        if (isSuccess) {
            toast.success("Form added successfully!")
        }
    }, [isSuccess])

    return (

        <main className="flex items-center justify-center min-h-screen p-6 bg-gray-200">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl border border-gray-300"
            >
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Submit Form</h1>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <input
                            type="text"
                            {...register("name")}
                            placeholder="Enter your name"
                            className="w-full rounded-lg border-b-2 border-gray-500 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-lg placeholder:font-medium placeholder:text-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="Enter your email"
                            className="w-full rounded-lg border-b-2 border-gray-500 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-lg placeholder:font-medium placeholder:text-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                        <input type="text" {...register("address")} placeholder="Enter your address"
                            className="w-full rounded-lg border-b-2 border-gray-500 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-lg placeholder:font-medium placeholder:text-blue-500" />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                    </div>
                    <div>
                        <input type="text" {...register("mobile")} placeholder="Enter your mobile"
                            className="w-full rounded-lg border-b-2 border-gray-500 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-lg placeholder:font-medium placeholder:text-blue-500" />
                        {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                        <input type="date" {...register("date")}
                            className="w-full text-blue-600 font-bold rounded-lg border-b-2 border-gray-500 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-lg placeholder:font-medium placeholder:text-blue-500" />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                    </div>
                    <div>
                        <select {...register("city")} className="w-full rounded-lg border-none underline p-3  text-blue-600 font-bold">
                            <option value="" className=" text-red-500">Select your city</option>
                            {["Jalna", "Sambhajinagar", "Pune", "Mumbai", "Delhi", "Ambad"].map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                    </div>
                </div>

                {/* Gender & Language */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label className="block text-blue-600 font-medium text-blue-600 font-bold">Gender</label>
                        <div className="flex gap-6 mt-2">
                            {["Male", "Female"].map((gender) => (
                                <label key={gender} className="flex items-center gap-2">
                                    <input type="radio" value={gender} {...register("gender")} className="h-5 w-5" />
                                    {gender}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-blue-600 font-bold ">Select Language</label>
                        {languages.map((lang) => (
                            <div key={lang} className="flex items-center space-x-2 mt-2">
                                <input type="checkbox" {...register("language")} value={lang} className="h-5 w-5" />
                                <span>{lang}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* File Upload */}
                <div className="mt-6">
                    <label className="block text-blue-700 font-medium">Upload Profile Picture</label>
                    <input type="file" accept="image/*" onChange={handleImageChange}
                        className="w-full rounded-lg border-none underline p-3" />
                </div>

                {/* Terms & Conditions */}
                <div className="mt-6 flex items-center">
                    <input type="checkbox" {...register("terms")} className="h-4 w-4 text-blue-600" />
                    <span className="ml-2 text-blue-700 font-semibold">I agree to the terms and conditions</span>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition"
                    disabled={loading}>
                    {loading ? <span className="loader"></span> : "Submit"}
                </button>
            </form>
        </main>

    )
}

export default FormData
