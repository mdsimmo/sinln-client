import React from 'react';

const apiURL = "https://api.sinln.mdsimmo.com/";

type LoginProps = Record<string, never>

export class LogIn extends React.Component<LoginProps> {

    render() {
        return (
            <form method='POST' action={apiURL+"update-member"}>
                <label htmlFor="name">Name</label><input type="text" name="member.name" id="name" />
                <label htmlFor="email">Email</label><input type="email" name="member.email" id="email" />
                <label htmlFor="address">Address</label><input type="text" name="member.address" id="address" />
                <label htmlFor="mobile">Mobile</label><input type="number" id="member.mobile" name="mobile" />
                <button type="submit">Submit</button>
            </form>
        );
    }
}