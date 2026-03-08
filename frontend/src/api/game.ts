const base_url = import.meta.env.VITE_BASE_URL+'game/';
console.log(base_url)

const game_urls = {
    get_all : base_url+'public-parties/',
    join_public_partie: base_url+'join-public/'
 
}

export default game_urls