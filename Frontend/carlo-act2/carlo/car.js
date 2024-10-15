document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-button');
    const songList = document.getElementById('Songlist');
    const songTitleInput = document.getElementById('song-title');
    const artistNameInput = document.getElementById('artist-name');
    const searchBar = document.querySelector('.search-bar');

    
    function attachDeleteFunctionality(button) {
        button.addEventListener('click', () => {
            const listItem = button.closest('.song-item');
            songList.removeChild(listItem);
        });
    }

    
    const deleteButtons = document.querySelectorAll('.btn-danger');
    deleteButtons.forEach(button => attachDeleteFunctionality(button));

    
    function createSongItem(title, artist) {
        const listItem = document.createElement('li');
        listItem.className = 'song-item';
        listItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <p class="song-title">${title}</p>
                    <small class="artist-name"> - ${artist}</small>
                </div>
                <button class="btn btn-danger">Delete</button>
            </div>
            <hr>
        `;

        
        const deleteButton = listItem.querySelector('.btn-danger');
        attachDeleteFunctionality(deleteButton);

        return listItem;
    }

    
    function addSong() {
        const songTitle = songTitleInput.value.trim();
        const artistName = artistNameInput.value.trim();

        if (songTitle && artistName) {
            songList.appendChild(createSongItem(songTitle, artistName));

            
            songTitleInput.value = '';
            artistNameInput.value = '';
        } else {
            alert('Please enter both song title and artist name.');
        }
    }

    
    function filterSongs() {
        const searchText = searchBar.value.toLowerCase();
        const songs = songList.getElementsByTagName('li');

        for (let song of songs) {
            const title = song.querySelector('.song-title').textContent.toLowerCase();
            const artist = song.querySelector('.artist-name').textContent.toLowerCase();
            const isMatch = title.includes(searchText) || artist.includes(searchText);
            song.style.display = isMatch ? '' : 'none';
        }
    }

    
    addButton.addEventListener('click', addSong);
    searchBar.addEventListener('input', filterSongs);
});
