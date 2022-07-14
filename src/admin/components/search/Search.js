import React, { Component } from 'react';

class Search extends Component {

  onQueryChange = (e) => {
    this.props.onQueryChange(e.target.value);
  };

  render() {
    return (
      <div>
        <input className="form-control input"
               value={this.props.query}
               onChange={this.onQueryChange}
               placeholder="Search" type="text" />
      </div>
    )
  }

}

export default Search;