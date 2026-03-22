const base_url = import.meta.env.VITE_BASE_URL+'game/';
console.log(base_url)

const game_urls = {
    get_all : base_url+'public-parties/',
    join_public_party: base_url+'join-public/',
    join_private_party: base_url+'join-private/',
    party_members: base_url+'party-members/',
    user_in_game: base_url+'user-in-game/',
    party_info: base_url+'party-info/',
    host: base_url+'host/',
    terminate: base_url+'terminate/',
    is_host: base_url+'is-host/'
}

export default game_urls