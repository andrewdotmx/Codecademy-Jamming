import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      playlistName: 'New Playlist',
      playlistTracks: [],
      searchResults: []
    }

    //Bind the event handlers to this
    this.search = this.search.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  search(term) {

    Spotify.search(term).then(
      result => {
        this.setState({
          searchResults: result
        });
      }
    ).catch(error => console.log(error));

  }

  updatePlaylistName(name) {

    this.setState({
      playlistName: name
    });

  }

  addTrack(track) {

    if(!this.state.playlistTracks.includes(track)) {
      this.setState((prevState) => ({
        playlistTracks: prevState.playlistTracks.concat(track)
      }));
    }

  }

  removeTrack(track) {

    //Repopulate state with tracks NOT EQUAL to the track argument's id
    this.setState((prevState) => ({
      playlistTracks: prevState.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    }));

  }

  savePlaylist() {

    const trackURIs = this.state.playlistTracks.map(track => track.uri);

    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(
        result => {
          this.setState({
            playlistName: 'New Playlist',
            playlistTracks: []
          });
        }
    ).catch(error => console.log(error));

  }

  render() {

    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} onPlaylistNameChange={this.updatePlaylistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );

  }

}

export default App;
