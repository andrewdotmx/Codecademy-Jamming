import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {term: ''}
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  search() {
    if(this.state.term) {
      this.props.onSearch(this.state.term);
    }
  }

  handleTermChange(event) {
    this.setState({
      term: event.target.value
    });
  }

  handleKeyDown(event) {
    if(event.keyCode === 13) {
      this.search();
    }
  }

  render() {
    return (
      <div className="SearchBar">
        <input onChange={this.handleTermChange} onKeyDown={this.handleKeyDown} placeholder="Enter A Song, Album, or Artist" />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }

}

export default SearchBar;
