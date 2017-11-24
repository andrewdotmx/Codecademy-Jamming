import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {

  constructor(props) {
    super(props);
    this.handlePlaylistNameChange = this.handlePlaylistNameChange.bind(this);
  }

  handlePlaylistNameChange(event) {
    this.props.onPlaylistNameChange(event.target.value);
  }

  render() {

    /*Using value instead of defaultValue in input below so it updates on App.js playlistName state change*/
    return (
      <div className="Playlist">
        <input value={this.props.playlistName} onChange={this.handlePlaylistNameChange}/>
        <TrackList isRemoval={true} onRemove={this.props.onRemove} tracks={this.props.playlistTracks}/>
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );

  }

}

export default Playlist;
