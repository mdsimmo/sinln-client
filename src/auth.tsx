export interface UserToken {
    id_token: string,
    access_token: string,
    refresh_token: string,
    expires_in: number,
    token_type: string,
}

const auth = {
    url: "https://sinln.auth.ap-southeast-2.amazoncognito.com", 
    clientId: "1mb678r8rl1bmoghd7gootih4p",
    clientSecret: "1ql7ph9tja44daf3d8bu35ugdnber3dpe04n6in97ubrinkpg4p9",
    redirectUrl: "http://localhost:3000",
    //redirectUrl: "https://sinln.mdsimmo.com",
};

export function login() {
    window.location.href = `${auth.url}/oauth2/authorize?client_id=${auth.clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(auth.redirectUrl)}`;
}

export async function getUserToken(): Promise<UserToken | null> {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code == null) {
        return null;
    }

    const details = {
        grant_type: "authorization_code",
        client_id: auth.clientId,
        redirect_uri: auth.redirectUrl,
        client_secret: auth.clientSecret,
        code: code,
    };
    const body = Object.entries(details)
            .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
            .join('&');
    return fetch(`${auth.url}/oauth2/token`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
    }).then(async response => {
        if (response.ok) {
            return await response.json() as UserToken;   
        } else {
            return null;
        }
    });
}