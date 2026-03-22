const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Architects+Daughter&display=swap');

  .home-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #a3b18a;
  }

  .home-outer {
    position: relative;
    display: inline-block;
    padding-top: 18px;
  }

  .tape {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) rotate(-1.5deg);
    width: 80px;
    height: 28px;
    background: rgba(255, 240, 180, 0.8);
    border: 1px solid rgba(200, 180, 120, 0.5);
    border-radius: 2px;
    z-index: 10;
    box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  }

  .home-wrap {
    width: 420px;
    background: #fdf6e3;
    border-radius: 2px 14px 4px 10px;
    font-family: 'Architects Daughter', cursive;
    position: relative;
    z-index: 1;
    transform: rotate(-0.8deg) skewX(-0.3deg);
    box-shadow:
      2px 2px 0 #e8d9b5,
      4px 4px 0 #ddd0a8,
      6px 6px 0 #d0c090,
      8px 8px 18px rgba(0,0,0,0.15);
    border: 1.5px solid #d4c49a;
    overflow: hidden;
    padding: 48px 40px 40px;
  }

  .home-wrap::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      transparent,
      transparent 27px,
      #e8dfc8 27px,
      #e8dfc8 28.5px
    );
    pointer-events: none;
    z-index: 0;
    opacity: 0.6;
  }

  .home-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  .home-title {
    font-family: 'Caveat', cursive;
    font-size: 80px;
    font-weight: 700;
    color: #4a3520;
    letter-spacing: 4px;
    transform: rotate(-1.5deg);
    display: inline-block;
    line-height: 1;
  }

  .home-subtitle {
    font-family: 'Caveat', cursive;
    font-size: 20px;
    color: #a08858;
    transform: rotate(0.5deg);
    display: inline-block;
    margin-top: -10px;
  }

  .divider {
    width: 80%;
    height: 1.5px;
    background: #d4c49a;
    transform: rotate(-0.3deg);
  }

  .btn-group {
    display: flex;
    gap: 16px;
  }

  .home-btn {
    font-family: 'Caveat', cursive;
    font-size: 24px;
    font-weight: 700;
    padding: 10px 36px;
    border-radius: 4px 8px 6px 4px;
    cursor: pointer;
    transform: rotate(-0.8deg);
    transition: opacity 0.15s, transform 0.15s;
    text-decoration: none;
    display: inline-block;
  }

  .btn-primary {
    background: #4a3520;
    color: #fdf6e3;
    border: none;
    box-shadow: 2px 2px 0 #2a1a08;
  }

  .btn-secondary {
    background: #fffde7;
    color: #4a3520;
    border: 1.5px solid #d4c49a;
    box-shadow: 2px 2px 0 #d4c49a;
  }

  .home-btn:hover {
    opacity: 0.85;
    transform: rotate(0deg) scale(1.04);
  }
`

function Home() {
  return (
    <>
      <style>{styles}</style>
      <div className="home-page">
        <div className="home-outer">
          <div className="tape" />
          <div className="home-wrap">
            <div className="home-content">
              <div style={{ textAlign: "center" }}>
                <div className="home-title">VDRW</div>
                <div className="home-subtitle">~ welcome back ~</div>
              </div>
              <div className="divider" />
              <div className="btn-group">
                <a href="login" className="home-btn btn-primary">Login</a>
                <a href="signup" className="home-btn btn-secondary">Sign Up</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home