import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CAT_NAME = {
  '90':'Smartphones / Tablets', '70':'Laptops / Computers', '35':'Cables & Chargers',
  '30':'Batteries & Power Banks', '20':'Televisions / Monitors', '120':'Circuit Boards',
  '18':'Keyboards & Peripherals', '15':'Kitchen Appliances', '45':'Mixed E-Waste'
};

export default function User() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ name: '', phone: '', area: '', date: '', cat: '', wt: '' });
  const [showRecyclers, setShowRecyclers] = useState(false);
  const [selectedRecycler, setSelectedRecycler] = useState('');
  
  const [balance, setBalance] = useState(0);
  const [pickups, setPickups] = useState(0);
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem('rewireToken');
    
    if (token) {
      // Fetch Balance & Profile
      fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setBalance(data.points || 0);
          setForm(prev => ({ ...prev, name: data.username || '' }));
        })
        .catch(err => console.error(err));

      // Fetch Pickup History
      fetch('/api/user/pickups', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setPickups(data.length);
          const mappedTxns = data.map(d => ({
            item: d.wasteType,
            date: new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            kg: `${d.weight} kg`,
            pts: d.status === 'completed' ? (d.estimatedPoints || d.weight * 10) : 'Pending'
          }));
          setTxns(mappedTxns);
        })
        .catch(err => console.error(err));
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getReward = () => {
    if (form.cat && form.wt > 0) {
      return Math.round(parseFloat(form.cat) * parseFloat(form.wt) * 0.88);
    }
    return 0;
  };

  const handleShowRecyclers = () => {
    if (!form.area) return alert('Please select your area.');
    if (!form.cat) return alert('Please select an e-waste category.');
    setShowRecyclers(true);
    setTimeout(() => {
      document.getElementById('recyclers-sec')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleRedeem = async (points, type) => {
    if (balance < points) return alert('Insufficient points.');
    const token = localStorage.getItem('rewireToken');
    try {
      const res = await fetch('/api/user/redeem', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pointsToRedeem: points })
      });
      if (res.ok) {
        const data = await res.json();
        setBalance(data.remainingPoints);
        alert(`Redemption successful! ₹${points.toLocaleString('en-IN')} ${type === 'UPI' ? 'sent to your UPI' : 'voucher generated'}.`);
      } else {
        alert('Redemption failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmPickup = async () => {
    const earned = getReward();
    if (!earned) return alert('Please complete the form above first.');
    if (!selectedRecycler) return alert('Please select a recycler.');

    const token = localStorage.getItem('rewireToken');
    const wasteName = CAT_NAME[form.cat] || 'E-Waste';

    try {
      const res = await fetch('/api/user/request-pickup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          wasteType: wasteName, 
          weight: Number(form.wt),
          area: form.area,
          estimatedPoints: earned
        })
      });

      if (res.ok) {
        setPickups(prev => prev + 1);
        
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        
        setTxns([{
          item: wasteName,
          date: dateStr,
          kg: `${form.wt} kg`,
          pts: 'Pending',
          isPending: true
        }, ...txns]);

        setTimeout(() => {
          document.querySelector('.wallet')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
        
        alert('Pickup confirmed! Show the QR code to the agent upon collection.');
      } else {
        alert('Failed to schedule pickup. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    }
  };

  return (
    <div>
      <section className="u-hero">
        <div className="uh-l">
          <button className="back back-dk" onClick={() => navigate('/')}>← Back to Home</button>
          <div className="lbl">For Households</div>
          <h1 className="sh sh-lg">Schedule your<br/><span style={{color: 'var(--teal)'}}>free pickup.</span></h1>
          <p className="sub" style={{fontSize: '15px'}}>We cover Asansol, Burnpur, Kulti, Raniganj, Barakar, and Chittaranjan. Fill in the form - your estimated reward updates live as you type.</p>
        </div>
        <div className="uh-r">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80" alt="Pickup"/>
          <div className="uh-r-ov"></div>
        </div>
      </section>

      <section className="sched">
        <div className="lbl">Step 1 of 2</div>
        <h2 className="sh sh-md" style={{marginBottom: '32px'}}>Tell us what you have.</h2>
        <div className="sched-wrap">
          <div className="sched-form">
            <div className="f-row">
              <div className="f-g"><label>Full Name</label><input type="text" name="name" placeholder="Your name" onChange={handleChange}/></div>
              <div className="f-g"><label>Phone</label><input type="tel" name="phone" placeholder="+91 98765 43210" onChange={handleChange}/></div>
            </div>
            <div className="f-row">
              <div className="f-g">
                <label>Area / Locality</label>
                <select name="area" onChange={handleChange}>
                  <option value="">Select area…</option>
                  <option>Asansol - Station Road</option>
                  <option>Asansol - G.T. Road</option>
                  <option>Burnpur</option>
                  <option>Kulti</option>
                  <option>Raniganj</option>
                  <option>Barakar</option>
                  <option>Chittaranjan</option>
                </select>
              </div>
              <div className="f-g"><label>Preferred Date</label><input type="date" name="date" onChange={handleChange}/></div>
            </div>
            <div className="f-row">
              <div className="f-g">
                <label>E-Waste Category</label>
                <select name="cat" onChange={handleChange}>
                  <option value="">Select category…</option>
                  <option value="90">Smartphones / Tablets - ₹90/kg</option>
                  <option value="70">Laptops / Computers - ₹70/kg</option>
                  <option value="35">Cables & Chargers - ₹35/kg</option>
                  <option value="30">Batteries & Power Banks - ₹30/kg</option>
                  <option value="20">Televisions / Monitors - ₹20/kg</option>
                  <option value="120">Circuit Boards - ₹120/kg</option>
                  <option value="18">Keyboards & Peripherals - ₹18/kg</option>
                  <option value="15">Kitchen Appliances - ₹15/kg</option>
                  <option value="45">Mixed E-Waste - ₹45/kg</option>
                </select>
              </div>
              <div className="f-g"><label>Estimated Weight (kg)</label><input type="number" name="wt" placeholder="e.g. 2.5" min="0.1" step="0.1" onChange={handleChange}/></div>
            </div>
            <button className="btn btn-teal" style={{width: '100%', justifyContent: 'center', marginTop: '10px'}} onClick={handleShowRecyclers}>Find Recyclers Near Me →</button>
          </div>
          
          <div className="preview-card">
            <div className="prev-title">Your Pickup Summary</div>
            <div className="prev-row"><div className="prev-lbl">Location</div><div className="prev-val">{form.area || '-'}</div></div>
            <div className="prev-row"><div className="prev-lbl">Category</div><div className="prev-val">{form.cat ? CAT_NAME[form.cat] : '-'}</div></div>
            <div className="prev-row"><div className="prev-lbl">Weight</div><div className="prev-val">{form.wt ? `${form.wt} kg` : '-'}</div></div>
            <div className="prev-row"><div className="prev-lbl">Rate</div><div className="prev-val">{form.cat ? `₹${form.cat}/kg` : '-'}</div></div>
            <div className="prev-row" style={{borderTop: '1px solid rgba(255,255,255,.14)', paddingTop: '18px', marginTop: '4px'}}>
              <div className="prev-lbl" style={{fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,.65)'}}>Estimated Reward</div>
              <div className="prev-reward">₹ {getReward() || '-'}</div>
            </div>
            <div className="prev-note">Final amount confirmed on pickup by agent and credited instantly via QR scan.</div>
          </div>
        </div>
      </section>

      {showRecyclers && (
        <section className="r-list" id="recyclers-sec">
          <div className="lbl">Step 2 of 2</div>
          <h2 className="sh sh-md">Choose your recycler.</h2>
          <p style={{color: 'var(--tm)', fontSize: '14px', marginTop: '8px'}}>All partners are CPCB-authorised. Rates per kg shown below.</p>
          <div className="r-grid">
            <div className={`r-card ${selectedRecycler === 'GreenCycle Asansol' ? 'sel' : ''}`} onClick={() => setSelectedRecycler('GreenCycle Asansol')}>
              <div className="r-top"><div><div className="r-name">GreenCycle Asansol</div><div className="stars">★★★★★ <span style={{color: 'var(--tl)', fontSize: '10px'}}>(218 reviews)</span></div></div><div className="r-b" style={{background: 'rgba(95,155,140,.12)', color: 'var(--teal)'}}>Top Rated</div></div>
              <div className="r-meta"><span>📍 2.4 km</span><span>⚡ Same-day</span></div>
              <div className="r-rates">
                <div className="r-rr"><span className="r-rl">Smartphones</span><span className="r-rv">₹ 80/kg</span></div>
                <div className="r-rr"><span className="r-rl">Cables</span><span className="r-rv">₹ 30/kg</span></div>
                <div className="r-rr"><span className="r-rl">Batteries</span><span className="r-rv">₹ 25/kg</span></div>
              </div>
            </div>
            <div className={`r-card ${selectedRecycler === 'Prakriti Recyclers' ? 'sel' : ''}`} onClick={() => setSelectedRecycler('Prakriti Recyclers')}>
              <div className="r-top"><div><div className="r-name">Prakriti Recyclers Pvt.</div><div className="stars">★★★★☆ <span style={{color: 'var(--tl)', fontSize: '10px'}}>(134 reviews)</span></div></div><div className="r-b" style={{background: 'rgba(250,200,70,.15)', color: '#9a7200'}}>Fast Pickup</div></div>
              <div className="r-meta"><span>📍 4.1 km</span><span>⏱ 2-hr slots</span></div>
              <div className="r-rates">
                <div className="r-rr"><span className="r-rl">Smartphones</span><span className="r-rv">₹ 75/kg</span></div>
                <div className="r-rr"><span className="r-rl">Cables</span><span className="r-rv">₹ 28/kg</span></div>
                <div className="r-rr"><span className="r-rl">Batteries</span><span className="r-rv">₹ 22/kg</span></div>
              </div>
            </div>
            <div className={`r-card ${selectedRecycler === 'E-Renew Burnpur' ? 'sel' : ''}`} onClick={() => setSelectedRecycler('E-Renew Burnpur')}>
              <div className="r-top"><div><div className="r-name">E-Renew Burnpur</div><div className="stars">★★★★☆ <span style={{color: 'var(--tl)', fontSize: '10px'}}>(89 reviews)</span></div></div><div className="r-b" style={{background: 'rgba(160,195,130,.18)', color: '#3d7020'}}>Best Rates</div></div>
              <div className="r-meta"><span>📍 6.7 km</span><span>🔋 All types</span></div>
              <div className="r-rates">
                <div className="r-rr"><span className="r-rl">Smartphones</span><span className="r-rv">₹ 90/kg</span></div>
                <div className="r-rr"><span className="r-rl">Cables</span><span className="r-rv">₹ 35/kg</span></div>
                <div className="r-rr"><span className="r-rl">Batteries</span><span className="r-rv">₹ 30/kg</span></div>
              </div>
            </div>
          </div>
          <div style={{marginTop: '30px', display: 'flex', gap: '14px', alignItems: 'center'}}>
            <button className="btn btn-teal" onClick={confirmPickup}>
              {selectedRecycler ? `Confirm Pickup with ${selectedRecycler} →` : 'Select a recycler first'}
            </button>
          </div>
        </section>
      )}

      <section className="wallet">
        <div className="lbl">Your Wallet</div>
        <div className="wcard">
          <div className="w-lbl">Available Balance</div>
          <div className="w-bal">₹ {balance.toLocaleString('en-IN')}</div>
          <div className="w-eq">= {balance} ReWire Points · Earned from {pickups} pickups</div>
          <div className="w-btns">
            <button className="w-btn" style={{background: '#fff', color: 'var(--navy)'}} onClick={() => handleRedeem(500, 'UPI')}>Withdraw ₹500 to UPI</button>
            <button className="w-btn" style={{background: 'rgba(255,255,255,.14)', color: '#fff', border: '1px solid rgba(255,255,255,.25)'}} onClick={() => handleRedeem(100, 'Voucher')}>Redeem ₹100 Voucher</button>
          </div>
        </div>
        <div className="lbl" style={{marginBottom: '14px'}}>Redeem For</div>
        <div className="redeem-grid">
          <div className="rd" onClick={() => handleRedeem(200, 'Swiggy')}><div className="rd-icon" style={{background: '#FF6B00'}}>SW</div><h4>Swiggy</h4><p>₹200 voucher</p></div>
          <div className="rd" onClick={() => handleRedeem(500, 'Amazon')}><div className="rd-icon" style={{background: '#FF9900'}}>AMZ</div><h4>Amazon Pay</h4><p>₹500 credits</p></div>
          <div className="rd" onClick={() => handleRedeem(1000, 'Flipkart')}><div className="rd-icon" style={{background: '#2874F0'}}>FK</div><h4>Flipkart</h4><p>₹1000 credits</p></div>
          <div className="rd" onClick={() => handleRedeem( balance > 0 ? balance : 0, 'UPI')}><div className="rd-icon" style={{background: 'var(--teal)'}}><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg></div><h4>Full Bank Transfer</h4><p>via Razorpay</p></div>
        </div>
      </section>

      <section className="txn-sec">
        <div className="lbl">History</div>
        <h2 className="sh sh-md" style={{marginBottom: '0'}}>Past Pickups</h2>
        <div className="txn-tbl">
          <div className="txn-r txn-h"><div>Item</div><div>Date</div><div>Weight</div><div>Earned</div></div>
          {txns.map((t, idx) => (
            <div className="txn-r" key={idx}>
              <div className="t-item">{t.item}</div>
              <div className="t-date">{t.date}</div>
              <div className="t-kg">{t.kg}</div>
              <div className={`t-pts ${t.isPending ? 'pending' : ''}`}>
                {t.isPending ? '⏳ Verification Pending' : `+₹ ${t.pts.toLocaleString('en-IN')}`}
              </div>
              {t.isPending && (
                <div className="qr-cont">
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=pickup_${idx}`} alt="QR Code" />
                   <span>Agent Scan Code</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer>
        <div className="ft">
          <div className="fb"><div className="logo" style={{color: '#fff'}}>Re<span>Wire</span></div><p>Doorstep e-waste collection with instant rewards. Serving Asansol district.</p></div>
          <div className="fc"><h5>Quick Links</h5><a onClick={() => navigate('/')}>Home</a><a onClick={() => navigate('/recycler')}>For Recyclers</a><a>Contact</a></div>
          <div className="fc"><h5>Legal</h5><a>Privacy Policy</a><a>Terms of Service</a><a>E-Waste Rules 2022</a></div>
          <div className="fc"><h5>Asansol Office</h5><a>Station Road, Asansol</a><a>West Bengal - 713301</a><a>hello@rewire.in</a></div>
        </div>
        <div className="fb-bot"><p>© 2026 ReWire Technologies.</p><p>CPCB Registered · E-Waste Rules 2022</p></div>
      </footer>
    </div>
  );
}