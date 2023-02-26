import React, { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { api_url, Member } from './core';
import './register-form.scss';

type RegisterScreenProps = Record<string, never>

type RegisterScreenState = {
    loggingIn: boolean,
}

export class RegisterScreen extends React.Component<RegisterScreenProps, RegisterScreenState> {

    constructor(props: RegisterScreenProps) {
        super(props);

        this.state = {
            loggingIn: false,
        };
    }

    render() {
        return (
            <Fragment>
                <article className='splash'>
                    <RegisterSplash onClick={()=>document.getElementById('form-anchor')?.scrollIntoView()}/>
                </article>
                <article id="form-anchor">
                    <RegisterForm/>
                </article>
            </Fragment>
        );
    }
}

type RegisterSplashProps = {
    onClick: () => void,
}

function RegisterSplash(props: RegisterSplashProps) {
    return (
        <div>
            <h1>Welcome to <br/> Noble Park Baptist</h1>
            <p> Think of some words to go here</p>
            <button onClick={props.onClick}>Check In</button>
        </div>
    );
}

function RegisterForm() {

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
            <button type="submit">Register</button>
        </form>
    );
}