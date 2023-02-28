import { faCheck, faSpinner, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { api_url, Member } from './core';
import './register-form.scss';

type RegisterScreenProps = Record<string, never>

type RegisterScreenState = {
    loggingIn: boolean,
    status: RegisterFormState,
}

export class RegisterScreen extends React.Component<RegisterScreenProps, RegisterScreenState> {

    constructor(props: RegisterScreenProps) {
        super(props);

        this.state = {
            loggingIn: false,
            status: RegisterFormState.ENTRY,
        };
    }

    render() {
        return (
            <Fragment>
                <article className='splash'>
                    <RegisterSplash onClick={()=>document.getElementById('form-anchor')?.scrollIntoView()}/>
                </article>
                <article id="form-anchor">
                    <RegisterForm onError={err => {
                        this.setState({status: RegisterFormState.ERROR});
                        console.log(err);
                    }}
                    onSuccess={() => this.setState({status: RegisterFormState.SUCCESS})} 
                    onLoad={() => this.setState({status: RegisterFormState.LOADING})}
                    status={this.state.status}/>
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
            <h1>Welcome to <br/> Noble Park Evangelical <br/> Baptist Church</h1>
            <button onClick={props.onClick}>Check In</button>
        </div>
    );
}

type RegisterFormProps = {
    onError: (err: string) => void,
    onSuccess: () => void,
    onLoad: () => void,
    status: RegisterFormState,
}

enum RegisterFormState {
    ENTRY,
    LOADING,
    ERROR,
    SUCCESS,
}

function RegisterForm(props: RegisterFormProps) {

    const submitData = (member: Member) => {
        console.log(typeof(member.mobile));
        props.onLoad();
        fetch(api_url("update-member"), {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },          
            body: JSON.stringify({
                member: member
            })
        })
        .then(response => {
            if (response.ok) {
                props.onSuccess();
            } else {
                props.onError("Invalid data");
            }
        })
        .catch(e => {
            console.log(e);
            props.onError("Network error");
        });
    };

    const { register, handleSubmit, formState: { errors } } = useForm<Member>();

    let submit;
    switch (props.status) {
        case RegisterFormState.ENTRY:
            submit = <button type="submit">Register</button>;
            break;
        case RegisterFormState.ERROR:
            submit = <button type="submit"><FontAwesomeIcon className='error-icon' icon={faWarning}/></button>;
            break;
        case RegisterFormState.LOADING:
            submit = <FontAwesomeIcon className='loading-icon' icon={faSpinner}/>;
            break;
        case RegisterFormState.SUCCESS:
            submit = <FontAwesomeIcon className='success-icon' icon={faCheck}/>;
            break;
    }

    return (
        <form onSubmit={handleSubmit(submitData)}>
            <label htmlFor="name">Name*</label><input {...register("name")} required={true} id="name" />
            {errors.name && <p>{errors.name?.message}</p>}
            <label htmlFor="email">Email*</label><input {...register("email")} required={true} id="email" />
            {errors.email && <p>{errors.email?.message}</p>}
            <label htmlFor="address">Address</label><input {...register("address")} id="address" />
            {errors.address && <p>{errors.address?.message}</p>}
            <label htmlFor="mobile">Mobile</label><input {...register("mobile", {valueAsNumber: true})} type="number" id="mobile" />
            {errors.mobile && <p>{errors.mobile?.message}</p>}
            {submit}
        </form>
    );
}