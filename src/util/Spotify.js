let accessToken;
const CLIENT_ID = '';
const REDIRECT_URI = 'http://localhost:3000/';

const Spotify = {

  getAccessToken() {

    //URL params for use below
    const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    //If already exists...
    if(accessToken) {
      return accessToken;
    } else if(urlAccessToken && urlExpiresIn) {
      window.setTimeout(() => accessToken = '', urlExpiresIn[1] * 1000);
      window.history.pushState('Access Token', null, '/');
      accessToken = urlAccessToken[1];
      return accessToken;
    } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
        return false;
    }

  },

  search(term) {

    const accessToken = Spotify.getAccessToken();
    if(!accessToken) {
      return Promise.reject(new Error("Unable to SEARCH :: No access token yet."));
    }

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        ).then(
          response => {
            if(response.ok) {
              return response.json();
            }
            throw new Error("Oops, search didn't work.");
          }
        ).then(
          responseJSON => {
            if(responseJSON.tracks.items.length > 0) {
              return responseJSON.tracks.items.map(track => {
                return {
                  id: track.id,
                  name: track.name,
                  artist: track.artists[0].name,
                  album: track.album.name,
                  uri: track.uri
                }
              });
            } else {
              return [];
            }
          }
        );

  },

  savePlaylist(playlist, trackURIs) {

    //Resolve to false if no tracks exist...
    if(!playlist || trackURIs.length < 1) {
      return Promise.reject(new Error("Unable to SAVE PLAYLIST :: No name or tracks!"));
    }

    const accessToken = Spotify.getAccessToken();
    if(!accessToken) {
      return Promise.reject(new Error("Unable to SAVE PLAYLIST :: No access token yet."));
    }

    const headers = { 'Authorization': `Bearer ${accessToken}` }
    let userID;
    let playlistID;

    return fetch(`https://api.spotify.com/v1/me`, { headers: headers }).then(
      response => {
        if(response.ok) {
          return response.json()
        }
        throw new Error('Error retrieving user id.');
      }
    ).then(
      responseJSON => {
        userID = responseJSON.id;

        headers['Content-Type'] = 'application/json';
        let bodyString = JSON.stringify({  name: playlist });

        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, { method: 'POST', headers: headers, body: bodyString }).then(
          response => {
            if(response.ok) {
              return response.json()
            }
            throw new Error("Error creating new playlist for user.");
          }
        ).then(
          responseJSON => {
            playlistID = responseJSON.id;

            bodyString = JSON.stringify({ uris: trackURIs });
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {method: 'POST', headers: headers, body: bodyString}).then(
              response => {
                if(!response.ok) {
                  throw new Error("Error adding tracks to playlist.");
                }
                return response.json();
              }
            ).then(
              responseJSON => {
                return responseJSON.snapshot_id;
              }
            )
          }
        )
      }
    )

  }

}

export default Spotify;
