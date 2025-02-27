import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface User {
    _id: string
    name: string
    email: string
    mobile: string
    address: string
    city: "Jalna" | "Sambhajinagar" | "Pune" | "Mumbai" | "Delhi" | "Ambad"
    gender: "Male" | "Female"
    date: string
    terms: boolean
    language: string[]
    profile?: string
}

export interface RegisterUserRequest {
    name: string
    email: string
    mobile: string
    address: string
    city: "Jalna" | "Sambhajinagar" | "Pune" | "Mumbai" | "Delhi" | "Ambad"
    gender: "Male" | "Female"
    date: string
    terms: boolean
    language: string[]
    profile?: File
}
export interface ApiResponse {
    message: string
    result: User[]
}

export const formApi = createApi({
    reducerPath: "formApi",
    baseQuery: fetchBaseQuery({
        //  baseUrl: "http://localhost:5000/api" 
        baseUrl: "https://zod-with-crud.onrender.com/api"
    }),
    tagTypes: ["tagName"],
    endpoints: (builder) => ({
        getForm: builder.query<ApiResponse, void>({
            query: () => "/getdata",
            providesTags: ["tagName"],
            transformResponse: (response: ApiResponse) => response,
        }),
        registerForm: builder.mutation<User, RegisterUserRequest>({
            query: (userData) => {
                const formData = new FormData()
                formData.append("name", userData.name)
                formData.append("email", userData.email)
                formData.append("mobile", userData.mobile)
                formData.append("address", userData.address)
                formData.append("city", userData.city)
                formData.append("gender", userData.gender)
                formData.append("date", new Date(userData.date).toISOString())
                formData.append("terms", userData.terms ? "true" : "false")

                formData.append("language", JSON.stringify(userData.language))

                if (userData.profile) {
                    formData.append("profile", userData.profile)
                }
                return {
                    url: "/add",
                    method: "POST",
                    body: formData,
                }
            },
            invalidatesTags: ["tagName"],
        }),

        updateUser: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/updateUser/${id}`,
                method: "PUT",
                body: formData,
                headers: {
                },
            }),
            invalidatesTags: ["tagName"],
        }),
        deleteUser: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/deleteUser/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["tagName"],
        }),

    }),
})

export const { useRegisterFormMutation, useGetFormQuery, useUpdateUserMutation, useDeleteUserMutation } = formApi
