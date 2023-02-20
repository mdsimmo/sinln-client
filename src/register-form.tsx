import React from 'react';
import { useForm } from 'react-hook-form';
import { api_url, Member } from './core';

export function RegisterForm() {

    const submitData = (member: Member) => {
        console.log(typeof(member.mobile));
        fetch(api_url("update-member"), {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                member: member
            })
        });
    };

    const { register, handleSubmit, formState: { errors } } = useForm<Member>();

    return (
        <form onSubmit={handleSubmit(submitData)}>
            <label htmlFor="name">Name</label><input {...register("name")} id="name" />
            <label htmlFor="email">Email</label><input {...register("email")} id="email" />
            <label htmlFor="address">Address</label><input {...register("address")} id="address" />
            <label htmlFor="mobile">Mobile</label><input {...register("mobile", {valueAsNumber: true})} type="number" id="mobile" />
            <button type="submit">Submit</button>
        </form>
    );
}