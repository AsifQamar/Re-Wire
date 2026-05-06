import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Recycler() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reqs');
  const [requests, setRequests] = useState([]);
  const [pending, setPending] = useState(0);
  const [totalKg, setTotalKg] = useState(0);
  
  const fetchPickups = async () => {
    const token = localStorage.getItem('rewireToken');
    try {
      const res = await fetch('/api/recycler/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mappedRequests = data.map(d => ({
          id: d._id,
          user: d.userId?.username || 'Anonymous',
          location: d.area || 'Asansol',
          items: d.wasteType,
          kg: d.weight,
          type: 's-n',
          accepted: false,
          status: d.status
        }));
        
        setRequests(mappedRequests);
        setPending(mappedRequests.length);
        const total = mappedRequests.reduce((acc, curr) => acc + curr.kg, 0);
        setTotalKg(total);
      }
    } catch (err) {
      console.error("Failed to fetch pickups", err);
    }
  };

  useEffect(() => { 
    window.scrollTo(0, 0); 
    if (localStorage.getItem('rewireToken')) {
      fetchPickups();
    }
  }, [navigate]);

  const handleAccept = async (id, kg) => {
    const token = localStorage.getItem('rewireToken');
    try {
      const res = await fetch(`/api/recycler/pickup/${id}/complete`, { 
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setRequests(requests.filter(r => r.id !== id));
        setPending(Math.max(0, pending - 1));
        setTotalKg(totalKg + kg);
        alert("Job Completed! Points have been instantly awarded to the user's wallet.");
      } else {
        alert("Failed to complete job.");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleSkip = (id) => {
    setRequests(requests.filter(r => r.id !== id));
    setPending(Math.max(0, pending - 1));
  };

  return (
    <div>
      <section className="rec-hero">
        <div className="rh-l">
          <button className="back back-lt" onClick={() => navigate('/')}>← Back to Home</button>
          <div className="lbl lbl-w">For Businesses & Recyclers</div>
          <h1 className="sh sh-lg sh-w">A verified,<br/><span style={{color: 'var(--green)'}}>doorstep supply<br/>pipeline.</span></h1>
          <p className="sub sub-white" style={{fontSize: '15px', color: 'white'}}>Stop relying on unpredictable informal channels. ReWire delivers sorted, assessed e-waste directly from verified households across Asansol district.</p>
          <div style={{display: 'flex', gap: '14px', flexWrap: 'wrap'}}>
            <button className="btn btn-teal">Apply to Partner</button>
            <button className="btn btn-ghost">Download Rate Card</button>
          </div>
        </div>
        <div className="rh-r">
          <img src="https://t3.ftcdn.net/jpg/05/00/96/84/360_F_500968458_OGyQ9bVX0iG18R74csP1JBAvtxxaGYgs.jpg" alt="Recycling facility"/>
          <div className="rh-r-ov"></div>
        </div>
      </section>

      <section className="dash">
        <div className="lbl">Partner Dashboard</div>
        <h2 className="sh sh-md" style={{marginBottom: '4px'}}>GreenCycle Asansol</h2>
        <p style={{color: 'var(--tm)', fontSize: '14px', marginBottom: '32px'}}>April 2026 · Active partner since March 2025</p>
        <div className="kpis">
          <div className="kpi"><div className="kpi-lbl">Collected (Apr)</div><div className="kpi-val">{totalKg.toLocaleString('en-IN')} kg</div><div className="kpi-ch up">↑ 18% vs last month</div></div>
          <div className="kpi"><div className="kpi-lbl">Pending Requests</div><div className="kpi-val">{pending}</div><div className="kpi-ch al">● 3 urgent today</div></div>
          <div className="kpi"><div className="kpi-lbl">Pickups Completed</div><div className="kpi-val">87</div><div className="kpi-ch up">↑ 12 vs last month</div></div>
          <div className="kpi"><div className="kpi-lbl">Platform Rating</div><div className="kpi-val">4.9 ★</div><div className="kpi-ch up">Top 5% of partners</div></div>
        </div>
        <div className="tabs">
          <button className={`tab ${activeTab === 'reqs' ? 'act' : ''}`} onClick={() => setActiveTab('reqs')}>Incoming Requests</button>
          <button className={`tab ${activeTab === 'agents' ? 'act' : ''}`} onClick={() => setActiveTab('agents')}>Field Agents</button>
          <button className={`tab ${activeTab === 'analytics' ? 'act' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
        </div>
      </section>

      {activeTab === 'reqs' && (
        <section className="reqs">
          <h2 className="sh sh-md" style={{marginBottom: '16px'}}>Incoming Pickups</h2>
          <div className="req-grid">
            {requests.map(req => (
              <div className="req" key={req.id} style={{ opacity: req.accepted ? '.55' : '1', pointerEvents: req.accepted ? 'none' : 'auto' }}>
                <div className="req-top">
                  <div className="req-id">#{req.id.slice(-6).toUpperCase()}</div>
                  <div className={`req-st ${req.type}`}>{req.user}</div>
                </div>
                <div className="req-loc">📍 {req.location}</div>
                <div className="req-items">{req.items}</div>
                <div className="req-foot">
                  <div className="req-kg">~{req.kg} kg</div>
                  <div className="req-acts">
                    {!req.accepted ? (
                      <>
                        <button className="r-skip" onClick={() => handleSkip(req.id)}>Skip</button>
                        <button className="r-acc" onClick={() => handleAccept(req.id, req.kg)}>Accept</button>
                      </>
                    ) : (
                      <button className="r-acc" style={{background: '#2a9d5c'}}>✓ Accepted</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'agents' && <section className="reqs"><p style={{color: 'var(--tm)', fontSize: '15px', padding: '32px 0'}}>Agent management panel - available in the full platform dashboard.</p></section>}
      {activeTab === 'analytics' && <section className="reqs"><p style={{color: 'var(--tm)', fontSize: '15px', padding: '32px 0'}}>Analytics dashboard - available in the full platform dashboard.</p></section>}

      <section className="plans">
        <div className="plan-img"><img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&q=80" alt="EPR factory"/></div>
        <div>
          <div className="lbl">Subscription Plans</div>
          <h2 className="sh sh-md">Scale your supply chain.</h2>
          <p style={{color: 'var(--tm)', fontSize: '14px', lineHeight: '1.65', marginTop: '10px', marginBottom: '0'}}>Upgrade to unlock higher pickup limits, priority listing, and EPR compliance reporting for government quotas.</p>
          <div className="plan-cards">
            <div className="pcard" onClick={() => navigate('/checkout?plan=Starter')}><div><div className="p-name" style={{color: 'var(--navy)'}}>Starter</div><div className="p-desc" style={{color: 'var(--tl)'}}>Up to 20 pickups/month · Basic listing</div></div><div className="p-price">Free</div></div>
            <div className="pcard feat" onClick={() => navigate('/checkout?plan=Pro')}><div><div className="p-name">Pro</div><div className="p-desc">100 pickups/month · Priority listing · Analytics</div></div><div className="p-price">₹2,999 <span>/mo</span></div></div>
            <div className="pcard" onClick={() => navigate('/checkout?plan=Enterprise')}><div><div className="p-name" style={{color: 'var(--navy)'}}>Enterprise + EPR</div><div className="p-desc" style={{color: 'var(--tl)'}}>Unlimited · EPR quota reporting · B2B contracts</div></div><div className="p-price">Custom <span>pricing</span></div></div>
          </div>
        </div>
      </section>

      <section className="market">
        <div className="lbl lbl-w">Market Opportunity</div>
        <h2 className="sh sh-lg sh-w">The demand is<br/>government-mandated.</h2>
        <div className="imp-grid" style={{marginTop: '48px'}}>
          <div className="ic fade"><div className="ic-num" style={{color: 'var(--yellow)'}}>95%</div><h4>Informal sector today</h4><p>95% of India's e-waste is still handled by unorganised scrap dealers. ReWire converts this chaos into a formal, verifiable supply chain you can count on.</p></div>
          <div className="ic fade d1"><div className="ic-num" style={{color: 'var(--green)'}}>60%</div><h4>Govt. recycling target - FY2025</h4><p>India's E-Waste Rules mandate a 60% recycling rate target. Producers and recyclers need organised collection to meet these quotas - that's exactly what ReWire delivers.</p></div>
          <div className="ic fade d2"><div className="ic-num" style={{color: 'var(--orange)'}}>₹62B</div><h4>Worth of unrecovered materials globally</h4><p>Every tonne of e-waste contains recoverable gold, copper, and rare earth elements. Our structured supply gives you access to better-sorted, higher-value raw materials.</p></div>
        </div>
      </section>

      <footer>
        <div className="ft">
          <div className="fb"><div className="logo" style={{color: '#fff'}}>Re<span>Wire</span></div><p>Organised e-waste supply for formal recyclers across Asansol district.</p></div>
          <div className="fc"><h5>Quick Links</h5><a onClick={() => navigate('/')}>Home</a><a onClick={() => navigate('/user')}>For Households</a><a>Contact</a></div>
          <div className="fc"><h5>Legal</h5><a>Privacy Policy</a><a>Partner Agreement</a><a>EPR Compliance</a></div>
          <div className="fc"><h5>Asansol Office</h5><a>Station Road, Asansol</a><a>West Bengal - 713301</a><a>partners@rewire.in</a></div>
        </div>
        <div className="fb-bot"><p>© 2026 ReWire Technologies.</p><p>CPCB Registered · E-Waste Rules 2022</p></div>
      </footer>
    </div>
  );
}