import { faCheck, faCircleExclamation, faEdit, faSpinner, faTrash, faUndo, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { api_url, cloneMember, Member } from './core';
import './list.scss';

enum State {
  DEFAULT = "",
  LOADING = "loading",
  DELETED = "deleted",
  EDITING = "editing",
}

type MemberProps = {
  member: Member;
}

type MemberState = {
  state: State;
  error: string | null;
  member: Member;
  newMember: Member;
}

class MemberRow extends React.Component<MemberProps, MemberState> {
  constructor(props: MemberProps) {
    super(props);
    this.state = {
      state: State.DEFAULT,
      error: null,
      member: props.member,
      newMember: props.member,
    };
  }

  render() {
    return (
      <tr className={ 
          (this.state.state) + 
          (this.state.error ? "error" : "")
        }>
            <td><input type="text" value={this.state.member.id} disabled={true}/></td>
            <td><input type="text" value={this.state.newMember.name} disabled={this.state.state != State.EDITING} onChange={event => {
              const newMember = cloneMember(this.state.newMember);
              newMember.name = event.target.value;
              this.setState({newMember: newMember});
            }}/></td>
            <td><input type="email" value={this.state.newMember.email} disabled={this.state.state != State.EDITING} onChange={event => {
              const newMember = cloneMember(this.state.newMember);
              newMember.email = event.target.value;
              this.setState({newMember: newMember});
            }}/></td>
            <td><input type="text" value={this.state.newMember.address} disabled={this.state.state != State.EDITING} onChange={event => {
              const newMember = cloneMember(this.state.newMember);
              newMember.address = event.target.value;
              this.setState({newMember: newMember});
            }}/></td>
            <td><input type="number" value={this.state.newMember.mobile} disabled={this.state.state != State.EDITING} onChange={event => {
              const newMember = cloneMember(this.state.newMember);
              newMember.mobile = Number.parseInt(event.target.value);
              this.setState({newMember: newMember});
            }}/></td>
            <td>
              { 
                // EDIT BUTTON
                this.state.state == State.DEFAULT &&
                <button title="Edit member's details" className="edit-button" onClick={() => {
                  this.setState({
                    state: State.EDITING,
                    error: null,
                    newMember: this.state.member
                  });
                }}><FontAwesomeIcon icon={faEdit} /></button>
              }
              {
                // SAVE BUTTON
                this.state.state == State.EDITING &&
                <button title='Save changes' className="save-button" onClick={()=>{
                  this.setState({
                    state: State.LOADING,
                    error: null,
                  });
                  fetch(api_url("update-member"), {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                  },
                    body: JSON.stringify({
                      member: this.state.newMember,
                    }),
                  }).then(response => {
                    this.setState({
                      state: response.status < 300 ? State.DEFAULT : State.EDITING,
                      error: response.status >= 300 ? "Failed to update member" : null,
                      member: this.state.newMember,
                    });
                  }).catch(error => {
                    console.error(error);
                    this.setState({
                      state: State.EDITING,
                      error: "Network error in save",
                    });
                  });
                }}><FontAwesomeIcon icon={faCheck} /></button>
              }
              {
                // CANCEL BUTTON
                this.state.state == State.EDITING &&
                <button title='Cancel changes' className="cancel-button" onClick={()=>{
                  this.setState({
                    state: State.DEFAULT,
                    error: null,
                    newMember: this.state.member
                  });
                }}><FontAwesomeIcon icon={faXmark} /></button>
              }
              {
                // DELETE BUTTON
                this.state.state == State.DEFAULT &&
                <button title='Delete member' className="delete-button" onClick={()=>{
                  this.setState({
                    state: State.LOADING,
                    error: null,
                  });
                  fetch(api_url("delete-member"), {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                  },
                    body: JSON.stringify({
                      id: this.state.member.id
                    }),
                  }).then(response => {
                    this.setState({
                        state: response.status < 300 ? State.DELETED : State.DEFAULT,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        error: response.status >= 300 ? "Failed to delete" : null,
                    });
                  }).catch(error => {
                    console.error(error);
                    this.setState({
                      state: State.DEFAULT,
                      error: "Network error in delete",
                    });
                  });
                }}><FontAwesomeIcon icon={faTrash} /></button> 
              }
              {
                // UNDO BUTTON
                this.state.state == State.DELETED &&
                <button title='Undo deletion' className="undo-button" onClick={()=>{
                  this.setState({
                    state: State.LOADING,
                    error: null,
                  });
                  fetch(api_url("update-member"), {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                  },
                    body: JSON.stringify({
                      member: this.state.member
                    }),
                  }).then(response => {
                    this.setState({
                      state: response.status < 300 ? State.DEFAULT : State.DELETED,
                      error: response.status >= 300 ? "Failed to undo deletion" : null
                    });
                  }).catch(error => {
                    console.error(error);
                    this.setState({
                      state: State.DELETED,
                      error: "Network error in undo",
                    });
                  });
                }}><FontAwesomeIcon icon={faUndo} /></button>
              }
              {
                // ERROR MESSAGE
                this.state.error !== null && 
                <span title={this.state.error ?? "ok" } className='error-message'><FontAwesomeIcon icon={faCircleExclamation} /></span>
              }
              {
                // LOADING MESSAGE
                this.state.state == State.LOADING && 
                <span title='Applying changes...' className='loading-message'><FontAwesomeIcon icon={faSpinner} /></span>
              }
            </td>
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
		let rows;
    if (this.state.members) {
      rows = this.state.members?.map((row) => <MemberRow key={row.id} member={row}/>);
    } else {
      this.fetchData();
      rows = <tr><td colSpan={6}>Loading...</td></tr>;
    }
    return (
      <table className="members">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Mobile</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
	}

	fetchData() {	
    console.info("Fetching data");
    fetch(api_url("list-members"), {
      method: 'POST'
    })
      .then((response) => response.json())
      .then((data) => {
        console.debug(data);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data.members) {
          this.setState({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            members: data.members,
          });
        } else {
          // TODO display an error response message
          console.error("Failed to read data");
          setTimeout(() => this.setState({members: null}), 5000);
        }
      }).catch(error => {
        console.error(error);
        // TODO display an error response message
        //setTimeout(() => this.setState({members: null}), 5000);
      });
	}
}