import { faCheck, faCircleExclamation, faEdit, faSearch, faSpinner, faTrash, faUndo, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import { UserToken } from './auth';
import { api_url, cloneMember, Member } from './core';
import './list.scss';

enum RowState {
  DEFAULT = "",
  LOADING = "loading",
  DELETED = "deleted",
  EDITING = "editing",
}

enum ListState {
  LOADING,
  UNAUTHERISED,
  ERROR,
  LOADED,
}

type MemberProps = {
  member: Member;
}

type MemberState = {
  state: RowState;
  error: string | null;
  member: Member;
  newMember: Member;
}

type ListControlsProps = {
  onSearch: (terms: string[]) => void,
}

function ListControls(props: ListControlsProps) {
  const [search, setSearch] = useState("bob");

  return (
    <ul>
      <label htmlFor="search-input"><FontAwesomeIcon icon={faSearch}/></label>
      <input id="search-input" type="text" value={search} onChange={(e) => {
        const searchText = e.target.value;
        const terms = searchText.split('[ ,]').map(s=>s.toLowerCase()).filter(it => it.length > 0);
        setSearch(searchText);
        props.onSearch(terms);
      }}  />
    </ul>
  );
}

class MemberRow extends React.Component<MemberProps, MemberState> {
  constructor(props: MemberProps) {
    super(props);
    this.state = {
      state: RowState.DEFAULT,
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
            <td><input type="text" value={this.state.newMember.name} disabled={this.state.state != RowState.EDITING} onChange={event => {
              const newMember = cloneMember(this.state.newMember);
              newMember.name = event.target.value;
              this.setState({newMember: newMember});
            }}/></td>
            <td><input type="email" value={this.state.newMember.email} disabled={this.state.state != RowState.EDITING} onChange={event => {
              const newMember = cloneMember(this.state.newMember);
              newMember.email = event.target.value;
              this.setState({newMember: newMember});
            }}/></td>
            <td><input type="text" value={this.state.newMember.address ?? ""} disabled={this.state.state != RowState.EDITING} onChange={event => {
              const newMember = cloneMember(this.state.newMember);
              newMember.address = event.target.value;
              this.setState({newMember: newMember});
            }}/></td>
            <td><input type="number" value={this.state.newMember.mobile ?? 0} disabled={this.state.state != RowState.EDITING} onChange={event => {
              const newMember = cloneMember(this.state.newMember);
              newMember.mobile = Number.parseInt(event.target.value);
              this.setState({newMember: newMember});
            }}/></td>
            <td>
              { 
                // EDIT BUTTON
                this.state.state == RowState.DEFAULT &&
                <button title="Edit member's details" className="edit-button" onClick={() => {
                  this.setState({
                    state: RowState.EDITING,
                    error: null,
                    newMember: this.state.member
                  });
                }}><FontAwesomeIcon icon={faEdit} /></button>
              }
              {
                // SAVE BUTTON
                this.state.state == RowState.EDITING &&
                <button title='Save changes' className="save-button" onClick={()=>{
                  this.setState({
                    state: RowState.LOADING,
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
                      state: response.status < 300 ? RowState.DEFAULT : RowState.EDITING,
                      error: response.status >= 300 ? "Failed to update member" : null,
                      member: this.state.newMember,
                    });
                  }).catch(error => {
                    console.error(error);
                    this.setState({
                      state: RowState.EDITING,
                      error: "Network error in save",
                    });
                  });
                }}><FontAwesomeIcon icon={faCheck} /></button>
              }
              {
                // CANCEL BUTTON
                this.state.state == RowState.EDITING &&
                <button title='Cancel changes' className="cancel-button" onClick={()=>{
                  this.setState({
                    state: RowState.DEFAULT,
                    error: null,
                    newMember: this.state.member
                  });
                }}><FontAwesomeIcon icon={faXmark} /></button>
              }
              {
                // DELETE BUTTON
                this.state.state == RowState.DEFAULT &&
                <button title='Delete member' className="delete-button" onClick={()=>{
                  this.setState({
                    state: RowState.LOADING,
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
                        state: response.status < 300 ? RowState.DELETED : RowState.DEFAULT,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        error: response.status >= 300 ? "Failed to delete" : null,
                    });
                  }).catch(error => {
                    console.error(error);
                    this.setState({
                      state: RowState.DEFAULT,
                      error: "Network error in delete",
                    });
                  });
                }}><FontAwesomeIcon icon={faTrash} /></button> 
              }
              {
                // UNDO BUTTON
                this.state.state == RowState.DELETED &&
                <button title='Undo deletion' className="undo-button" onClick={()=>{
                  this.setState({
                    state: RowState.LOADING,
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
                      state: response.status < 300 ? RowState.DEFAULT : RowState.DELETED,
                      error: response.status >= 300 ? "Failed to undo deletion" : null
                    });
                  }).catch(error => {
                    console.error(error);
                    this.setState({
                      state: RowState.DELETED,
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
                this.state.state == RowState.LOADING && 
                <span title='Applying changes...' className='loading-message'><FontAwesomeIcon icon={faSpinner} /></span>
              }
            </td>
          </tr>
    );
  }
}

type UserListProps = {
  userToken: UserToken | null,
}

type UserListState = {
  members: Member[] | null,
  state: ListState,
  searchTerms: string[],
}

export class UserList extends React.Component<UserListProps, UserListState> {
	constructor(props: UserListProps) {
		super(props);
		this.state = {
      members: null,
      state: ListState.LOADING,
      searchTerms: [],
    };
	}

	render() {
    switch (this.state.state) {
      case ListState.LOADING:
        this.fetchData();
        return <p>LOADING</p>;
      case ListState.LOADED:
        return this.showLoadedTable();
      case ListState.UNAUTHERISED:
        return <p>UNAUTHERISZED</p>;
    }    
	}

  showLoadedTable() {
    return (
      <Fragment>
        <ListControls onSearch={terms => this.setState({searchTerms: terms})}/>
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
            {this.state.members?.filter(member => {
              if (this.state.searchTerms.length == 0) {
                // Ignore search if empty
                return true;
              }
              const data = (member.id + " " + member.name + " " + member.address + " " + member.email + " " + member.mobile).toLowerCase();
              const termMissing = this.state.searchTerms.some(term => !data.includes(term));
              return !termMissing;
            }).map((row) => <MemberRow key={row.id} member={row}/>)}
          </tbody>
        </table>
      </Fragment>
    );
  }

	async fetchData() {	
    console.info("Fetching data");
    const response = await fetch(api_url("list-members"), {
      method: 'POST',
      headers: {
        Authorization: this.props.userToken?.id_token ?? "",
      },
    }).catch(error => {
      console.log(error);
      this.setState({
        state: ListState.ERROR,
      });
      // Retry later
      setTimeout(() => this.setState({state: ListState.LOADING}), 5000);
    });
    if (response?.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await response.json();
      console.debug(data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (data.members) {
        this.setState({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          members: data.members,
          state: ListState.LOADED,
        });
      } else {
        // TODO display an error response message
        console.error("Failed to read data");
        this.setState({
          state: ListState.ERROR,
        });
        setTimeout(() => this.setState({state: ListState.LOADING}), 5000);
      }
    } else if (response?.status == 401) {
      this.setState({
        state: ListState.UNAUTHERISED,
      });
    }
	}
}