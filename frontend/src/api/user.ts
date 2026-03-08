const base_url = import.meta.env.VITE_BASE_URL+'users/';
console.log(base_url)

const user_urls = {
    login : base_url+'login/',
    signup : base_url+'signup/'
}

export default user_urls