import Host from "./host"
import Join from "./join"
function Menu({user}:{user:{id: number, pseudo: string, email: string}}){

    return(
        <div>
            <div>
                Host a GAME:
                <Host user={user}></Host>
            </div>
            <div>
                Join Games:
                <Join user={user}></Join> 
            </div>
        </div>
    )
}

export default Menu