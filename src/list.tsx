import React from 'react';

const apiURL = "https://api.sinln.mdsimmo.com/";

type EditProps = {
  save: () => void;
  cancel: () => void;
  delete: () => void;
  undo: () => void;
}

function EditButtons(props: EditProps) {
  return (
    <span>
      <button className="save-button"onClick={props.save}>Save</button>
      <button className="cancel-button" onClick={props.cancel}>Cancel</button>
      <button className="delete-button" onClick={props.delete}>Delete</button>
      <button className="undo-button" onClick={props.undo}>Undo</button>
    </span>
  ); 
}

type Member = {
  id: string;
  name: string;
  email: string;
  address: string;
  mobile: string;
}

type MemberProps = {
  member: Member;
}

type MemberState = {
  editing: boolean;
  deleted: boolean;
}

class MemberRow extends React.Component<MemberProps, MemberState> {
  constructor(props: MemberProps) {
    super(props);
    this.state = {
      editing: false,
      deleted: false,
    };
  }

  render() {
    return (
      <tr className={ (this.state.editing ? "edit " : "") + (this.state.deleted ? "deleted" : "")}>
            <td>{this.props.member.id}</td>
            <td>{this.props.member.name}</td>
            <td>{this.props.member.email}</td>
            <td>{this.props.member.mobile}</td>
            <td>{this.props.member.address}</td>
            <td><EditButtons
              delete={()=>{
                fetch(apiURL+"delete-member", {
                  method: 'POST',
                  body: JSON.stringify({
                    id: this.props.member.id
                  }),
                });
                this.setState({
                  deleted: true,
                  editing: false,
                });
              }}
              undo={()=>{
                console.log("TODO Add undo button");
                this.setState({deleted: false});
              }}
              save={()=>{
                fetch(apiURL+"update-member", {
                  method: 'POST',
                  body: JSON.stringify({
                    id: this.props.member.id,
                    name: this.props.member.name,
                    email: this.props.member.email,
                    mobile: this.props.member.mobile,
                    address: this.props.member.address,
                  }),
                });
                this.setState({editing: false});
              }}
              cancel={()=>this.setState({editing: false})}
              /></td>
          </tr>
    );
  }
}

type UserListProps = Record<string, never>

type UserListState = {
  members: Member[] | null
}

export class UserList extends React.Component<UserListProps, UserListState> {
	constructor(props: UserListProps) {
		super(props);
		this.state = {
      members: null
    };
	}

	render() {
		if (this.state.members) {
      console.log("sdf; " + this.state.members);
      const rows = this.state.members?.map((row) => <MemberRow key={row.id} member={row}/>);
      return (
        <table className="members">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      );
    } else {
      this.fetchData();
      return (
        <p>Loading...</p>
      );
    }
	}

	fetchData() {	
    console.log("Fetching data");
    fetch(apiURL+"list-members", {
      method: 'POST'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          members: data.members,
        });
      });
	}
}