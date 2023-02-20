export type Member = {
    id: string;
    name: string;
    email: string;
    address: string;
    mobile: number;
}

export function cloneMember(member: Member): Member {
    return {
        id: member.id,
        name: member.name,
        email: member.email,
        address: member.address,
        mobile: member.mobile
    };
}

export function api_url(path: string): string {
    //return "http://localhost:9000/lambda-url/" + path;
    return "https://api.sinln.mdsimmo.com/" + path;
}