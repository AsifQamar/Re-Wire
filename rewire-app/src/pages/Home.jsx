import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useFadeObserver from '../hooks/useFadeObserver';

export default function Home({ openLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  useFadeObserver();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.state?.requireLogin) {
      openLogin();
      // Clear the state so it doesn't reopen on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, openLogin, navigate]);

  const handleNav = (path) => {
    if (!localStorage.getItem('rewireToken')) {
      openLogin();
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-l">
          <div className="hero-badge"><div className="badge-dot"></div><span>Now active in Asansol</span></div>
          <h1 className="sh sh-xl">
            <span className="hero-rewire">ReWire</span><br/>
            Turn your<br/>
            <span style={{color: 'var(--teal)'}}>e-waste</span><br/>
            into <span style={{color: 'var(--orange)'}}>rewards.</span>
          </h1>
          <p className="sub">Free doorstep e-waste collection for households across Asansol. Schedule a pickup in 60 seconds our verified agents come to you and pay you instantly.</p>
          <div className="hero-btns">
            <button className="btn btn-teal" onClick={() => handleNav('/user')}>Schedule Free Pickup →</button>
            <button className="btn btn-outline" onClick={() => handleNav('/recycler')}>I'm a Recycler</button>
          </div>
        </div>
        <div className="hero-r">
          <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1000&q=80" alt="E-waste recycling"/>
          <div className="hero-r-ov"></div>
          <div className="hero-card">
            <div className="hc-lbl">Avg. Payout Per Pickup</div>
            <div className="hc-val">₹ 340</div>
            <div className="hc-sub">Redeemable as UPI cash or vouchers</div>
          </div>
        </div>
      </section>

      <div className="mq">
        <div className="mq-track">
          <div className="mq-item"><div className="mq-dot"></div>Free doorstep pickup</div>
          <div className="mq-item"><div className="mq-dot"></div>Instant UPI cash rewards</div>
          <div className="mq-item"><div className="mq-dot"></div>CPCB-authorised recyclers only</div>
          <div className="mq-item"><div className="mq-dot"></div>E-Waste Rules 2022 compliant</div>
          <div className="mq-item"><div className="mq-dot"></div>Zero data risk devices wiped</div>
          <div className="mq-item"><div className="mq-dot"></div>All e-waste accepted - dead or alive</div>
          <div className="mq-item"><div className="mq-dot"></div>Same-day slots available</div>
          <div className="mq-item"><div className="mq-dot"></div>Serving Asansol · Burnpur · Kulti · Raniganj</div>
          <div className="mq-item"><div className="mq-dot"></div>Free doorstep pickup</div>
          <div className="mq-item"><div className="mq-dot"></div>Instant UPI cash rewards</div>
          <div className="mq-item"><div className="mq-dot"></div>CPCB-authorised recyclers only</div>
          <div className="mq-item"><div className="mq-dot"></div>E-Waste Rules 2022 compliant</div>
          <div className="mq-item"><div className="mq-dot"></div>Zero data risk devices wiped</div>
          <div className="mq-item"><div className="mq-dot"></div>All e-waste accepted dead or alive</div>
          <div className="mq-item"><div className="mq-dot"></div>Same-day slots available</div>
          <div className="mq-item"><div className="mq-dot"></div>Serving Asansol · Burnpur · Kulti · Raniganj</div>
        </div>
      </div>

      <section className="roles" id="roles">
        <div className="lbl">Get Started</div>
        <h2 className="sh sh-lg">Who are you?</h2>
        <div className="role-grid">
          <div className="role-card rc-u" onClick={() => handleNav('/user')}>
            <div className="rc-img">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" alt="Household"/>
              <div className="rc-tint"></div>
            </div>
            <div className="rc-body">
              <h3>Household / Seller</h3>
              <p>Have old phones, dead batteries, or broken electronics gathering dust? Schedule a free doorstep pickup - our agent comes to you, assesses on-site, and pays you instantly.</p>
              <div className="rc-cta">Schedule a free pickup <span>→</span></div>
            </div>
          </div>
          <div className="role-card rc-b" onClick={() => handleNav('/recycler')}>
            <div className="rc-img">
              <img src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&q=80" alt="Recycler"/>
              <div className="rc-tint"></div>
            </div>
            <div className="rc-body">
              <h3>Recycler / Business</h3>
              <p>Access a verified, organised supply of e-waste delivered to your facility. Join recyclers already growing with ReWire across the Asansol-Durgapur industrial corridor.</p>
              <div className="rc-cta">Partner with ReWire <span>→</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="cats" id="cats">
        <div className="lbl">What We Accept</div>
        <h2 className="sh sh-lg">We take everything<br/>electronic.</h2>
        <p className="sub" style={{marginTop: '10px', maxWidth: '560px'}}>Dead or alive, broken or working - if it ever had a plug or a battery, we'll pick it up and pay you for it.</p>
        <div className="cats-grid">
          <div className="cat fade">
            <div className="cat-img"><img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80" alt="Smartphones"/></div>
            <div className="cat-body"><div className="cat-name">Smartphones & Tablets</div><div className="cat-rate">Up to ₹ 90 / kg</div></div>
            <div className="cat-tag">Top earner</div>
          </div>
          <div className="cat fade d1">
            <div className="cat-img"><img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80" alt="Laptops"/></div>
            <div className="cat-body"><div className="cat-name">Laptops & Computers</div><div className="cat-rate">Up to ₹ 70 / kg</div></div>
          </div>
          <div className="cat fade d2">
            <div className="cat-img"><img src="https://cdn.thewirecutter.com/wp-content/media/2022/12/lightningcables-2048px-2460-2x1-1.jpg?auto=webp&quality=75&crop=1.91:1&width=1200" alt="Cables"/></div>
            <div className="cat-body"><div className="cat-name">Cables & Chargers</div><div className="cat-rate">Up to ₹ 35 / kg</div></div>
          </div>
          <div className="cat fade d3">
            <div className="cat-img"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR25t0C6k9sV0CxEkKhoPmvDOTdX2lqmR1Dow&s" alt="Batteries"/></div>
            <div className="cat-body"><div className="cat-name">Batteries & Power Banks</div><div className="cat-rate">Up to ₹ 30 / kg</div></div>
          </div>
          <div className="cat fade">
            <div className="cat-img"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Cptvdisplay.jpg/500px-Cptvdisplay.jpg" alt="Televisions"/></div>
            <div className="cat-body"><div className="cat-name">Televisions & Monitors</div><div className="cat-rate">Up to ₹ 20 / kg</div></div>
          </div>
          <div className="cat fade d1">
            <div className="cat-img"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIKuBJBGDaupe7GXpG4q5hXhUp5CYw2UoZlg&s" alt="Keyboards"/></div>
            <div className="cat-body"><div className="cat-name">Keyboards, Mice & Peripherals</div><div className="cat-rate">Up to ₹ 18 / kg</div></div>
          </div>
          <div className="cat fade d2">
            <div className="cat-img"><img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80" alt="Circuit boards"/></div>
            <div className="cat-body"><div className="cat-name">Circuit Boards & Components</div><div className="cat-rate">Up to ₹ 120 / kg</div></div>
            <div className="cat-tag cat-tag-o">Highest rate</div>
          </div>
          <div className="cat fade d3">
            <div className="cat-img"><img src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=500&q=80" alt="Appliances"/></div>
            <div className="cat-body"><div className="cat-name">Kitchen & Home Appliances</div><div className="cat-rate">Up to ₹ 15 / kg</div></div>
          </div>
        </div>
        <div style={{marginTop: '36px'}}>
          <button className="btn btn-teal" onClick={() => handleNav('/user')}>Check All Rates & Schedule Pickup →</button>
        </div>
      </section>

      <section className="impact" id="impact">
        <div className="lbl lbl-w">The Problem</div>
        <h2 className="sh sh-lg sh-w">India's e-waste<br/>crisis demands action.</h2>
        <div className="imp-grid">
          <div className="ic fade">
            <div className="ic-num">3.2M</div>
            <h4>Metric tonnes generated every year</h4>
            <p>India is the world's third-largest producer of e-waste. The volume grows over 30% every three years as smartphone and appliance adoption surges.</p>
          </div>
          <div className="ic fade d1">
            <div className="ic-num">&lt;5%</div>
            <h4>Formally recycled in India</h4>
            <p>The rest ends up in landfills or with informal scrap dealers using unsafe methods - releasing lead, mercury, and cadmium into soil and groundwater.</p>
          </div>
          <div className="ic fade d2">
            <div className="ic-num">20 km+</div>
            <h4>Average distance to a drop-off point</h4>
            <p>The nearest authorised recycling centre requires a round-trip most people won't make. ReWire removes that barrier - we come to your door.</p>
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="lbl">The Process</div>
        <h2 className="sh sh-lg">Five steps, zero hassle.</h2>
        <div className="how-grid">
          <div className="how-step fade"><div className="how-num">1</div><h4>Schedule</h4><p>List your e-waste and pick a date and time slot.</p></div>
          <div className="how-step hs-act fade d1"><div className="how-num">2</div><h4>Select</h4><p>Browse verified recyclers and compare rates.</p></div>
          <div className="how-step fade d2"><div className="how-num">3</div><h4>Collect</h4><p>A registered agent comes to your door and assesses on the spot.</p></div>
          <div className="how-step fade d3"><div className="how-num">4</div><h4>Confirm</h4><p>Agent scans your QR - reward points credited instantly.</p></div>
          <div className="how-step fade d4"><div className="how-num">5</div><h4>Redeem</h4><p>Withdraw as UPI cash or swap for brand vouchers.</p></div>
        </div>
      </section>

      <section className="rewards" id="rewards">
        <div className="rew-img">
          <img src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80" alt="Rewards"/>
          <div className="rew-tint"></div>
          <div className="rew-pills">
            <div className="rpill"><div className="rpd" style={{background: '#FF7D2D'}}></div>Swiggy</div>
            <div className="rpill"><div className="rpd" style={{background: '#FAC846'}}></div>Amazon Pay</div>
            <div className="rpill"><div className="rpd" style={{background: '#5F9B8C'}}></div>UPI Transfer</div>
            <div className="rpill"><div className="rpd" style={{background: '#A0C382'}}></div>Flipkart</div>
          </div>
        </div>
        <div className="rew-content">
          <div className="lbl">Instant Rewards</div>
          <h2 className="sh sh-md">Your old charger<br/>is worth real money.</h2>
          <div className="rw-row">
            <div className="rw-icon" style={{background: 'rgba(95,155,140,.1)'}}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#5F9B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="rw-text"><h4>Weight-based assessment on the spot</h4><p>Every gram counts. Rewards are calculated based on the type, weight, and condition of your e-waste - transparently, right in front of you.</p></div>
          </div>
          <div className="rw-row">
            <div className="rw-icon" style={{background: 'rgba(255,125,45,.1)'}}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#FF7D2D" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#FF7D2D" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div className="rw-text"><h4>Points credited the moment of handover</h4><p>No waiting. The second the QR is scanned, your ReWire Rewards are live in your wallet - no paperwork, no delays, no chasing.</p></div>
          </div>
          <div className="rw-row">
            <div className="rw-icon" style={{background: 'rgba(250,200,70,.1)'}}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#FAC846" strokeWidth="2"/><path d="M2 10h20" stroke="#FAC846" strokeWidth="2"/></svg>
            </div>
            <div className="rw-text"><h4>Cash out or redeem - your choice</h4><p>Transfer directly to UPI/bank via Razorpay, or redeem instantly for Swiggy, Amazon, Flipkart, and more partner vouchers.</p></div>
          </div>
          <button className="btn btn-teal" onClick={() => handleNav('/user')} style={{width: 'fit-content', marginTop: '6px'}}>Start Earning →</button>
        </div>
      </section>

      <section className="aware">
        <div>
          <div className="aw-h">It's not just the right thing.<br/>It's the law.</div>
          <div className="aw-p">Under India's E-Waste Management Rules 2022, disposing of electronics in regular trash is illegal. The rules mandate strict Extended Producer Responsibility (EPR) quotas, creating a government-backed market for organised e-waste collection. ReWire makes compliance effortless - and rewarding.</div>
        </div>
        <div className="aw-tags">
          <div className="aw-tag"><span style={{fontSize: '17px'}}>⚖️</span><span>E-Waste Rules 2022 Compliant</span></div>
          <div className="aw-tag"><span style={{fontSize: '17px'}}>✅</span><span>CPCB Authorised Recyclers Only</span></div>
          <div className="aw-tag"><span style={{fontSize: '17px'}}>🔒</span><span>Zero Data Risk - Devices Wiped</span></div>
        </div>
      </section>

      <section className="testi">
        <div className="lbl">What People Say</div>
        <h2 className="sh sh-md">Trusted across Asansol.</h2>
        <div className="testi-grid">
          <div className="tc fade">
            <div className="tc-stars">★★★★★</div>
            <div className="tc-text">"I had three old phones and a laptop sitting in a drawer for two years. Scheduled a pickup, the agent arrived on time, and I got ₹640 credited to my Paytm within minutes. Genuinely surprised."</div>
            <div className="tc-auth">
              <img className="tc-av" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80" alt="Rahul"/>
              <div><div className="tc-name">Rahul Sharma</div><div className="tc-loc">Station Road, Asansol</div></div>
            </div>
          </div>
          <div className="tc fade d1">
            <div className="tc-stars">★★★★★</div>
            <div className="tc-text">"Finally a proper solution for e-waste in Asansol. The agent was professional, explained the process clearly, and the Amazon voucher was in my account before he left the building."</div>
            <div className="tc-auth">
              <img className="tc-av" src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&q=80" alt="Priya"/>
              <div><div className="tc-name">Priya Datta</div><div className="tc-loc">Burnpur</div></div>
            </div>
          </div>
          <div className="tc fade d2">
            <div className="tc-stars">★★★★☆</div>
            <div className="tc-text">"We had a whole box of old office equipment - monitors, keyboards, routers. ReWire picked everything up in one trip. Got the equivalent in vouchers. Very smooth, very efficient."</div>
            <div className="tc-auth">
              <img className="tc-av" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80" alt="Mehul"/>
              <div><div className="tc-name">Mehul Agarwal</div><div className="tc-loc">Kulti Market</div></div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="ft">
          <div className="fb">
            <div className="logo" style={{color: '#fff'}}>Re<span>Wire</span></div>
            <p>Doorstep e-waste collection with instant rewards. Serving Asansol, Burnpur, Kulti, and Raniganj.</p>
          </div>
          <div className="fc"><h5>For Users</h5><a onClick={() => handleNav('/user')}>Schedule Pickup</a><a onClick={() => document.getElementById('cats')?.scrollIntoView()}>What We Accept</a><a onClick={() => document.getElementById('rewards')?.scrollIntoView()}>Rewards</a></div>
          <div className="fc"><h5>For Recyclers</h5><a onClick={() => handleNav('/recycler')}>Partner Dashboard</a><a>EPR Services</a><a>Subscription Plans</a></div>
          <div className="fc"><h5>Company</h5><a>About ReWire</a><a>Privacy Policy</a><a>Contact Us</a></div>
        </div>
        <div className="fb-bot"><p>© 2026 ReWire Technologies. Asansol, West Bengal.</p><p>CPCB Registered · E-Waste Rules 2022</p></div>
      </footer>
    </div>
  );
}