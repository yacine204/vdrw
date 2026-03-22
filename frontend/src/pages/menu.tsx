import Host from "./host"
import Join from "./join"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Architects+Daughter&display=swap');

  .menu-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    box-sizing: border-box;
    background-color: #a3b18a
  }

  .menu-sections {
    display: flex;
    gap: 40px;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: center;
  }

  .menu-section-label {
    font-family: 'Caveat', cursive;
    font-size: 20px;
    color: #a08858;
    margin-bottom: 10px;
    transform: rotate(-0.5deg);
    display: inline-block;
  }
`

function Menu({ user }: { user: { id: number; pseudo: string; email: string } }) {
  return (
    <>
      <style>{styles}</style>
      <div className="menu-page">
        <div className="menu-sections">
          <div>
            <div className="menu-section-label">~ host a game ~</div>
            <Host user={user} />
          </div>
          <div>
            <div className="menu-section-label">~ join games ~</div>
            <Join user={user} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Menu