import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Profil() {
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username');
    const email = sessionStorage.getItem('userEmail');

    const [activeTab, setActiveTab] = useState('garaj');
    const [favorites, setFavorites] = useState([]);

    // İstatistik State'i
    const [stats, setStats] = useState({ followers: 0, following: 0, events: 0 });

    const [showSosModal, setShowSosModal] = useState(false);
    const [sosData, setSosData] = useState({
        id: 0, bloodType: 'A Rh+', notes: '', emergencyContactName: '', emergencyContactPhone: ''
    });

    const [myBikes, setMyBikes] = useState([]);
    const [newBike, setNewBike] = useState({ brand: '', model: '', year: '', engineCc: '' });

    useEffect(() => {
        if (!username) { navigate('/giris'); return; }
        fetchData();
    }, [username]);

    const fetchData = async () => {
        await Promise.all([
            fetchUserStats(), // İstatistikleri (Takip + Etkinlik) çek
            fetchFavorites(),
            fetchGarage(),
            fetchSOS()
        ]);
    };

    // --- İSTATİSTİKLERİ ÇEKME ---
    const fetchUserStats = async () => {
        try {
            let followers = 0;
            let following = 0;
            let eventsCount = 0;

            // 1. ADIM: Takipçi ve Takip Edilen Sayısını Çek (Follows API)
            const followRes = await fetch(`/api/Follows/stats/${username}?t=${Date.now()}`);
            if (followRes.ok) {
                const data = await followRes.json();
                followers = data.FollowersCount ?? data.followersCount ?? data.followers ?? 0;
                following = data.FollowingCount ?? data.followingCount ?? data.following ?? 0;
            }

            // 2. ADIM: Katıldığım Etkinlik Sayısını Çek (Participations API)
            const partRes = await fetch(`/api/Participations/${username}`);
            if (partRes.ok) {
                const partData = await partRes.json()
                if (Array.isArray(partData)) {
                    eventsCount = partData.length;
                }
            }

            // 3. ADIM: State'i Güncelle
            setStats({
                followers: followers,
                following: following,
                events: eventsCount 
            });

        } catch (err) {
            console.error("İstatistik hatası:", err);
        }
    };

    const fetchFavorites = async () => { try { const res = await fetch(`/api/Favorites/${username}`); if (res.ok) { const data = await res.json(); setFavorites(data); } } catch (err) { console.error(err); } };
    const fetchGarage = async () => { try { const res = await fetch(`/api/Garage/${username}`); if (res.ok) { setMyBikes(await res.json()); } else if (res.status === 404) { setMyBikes([]); } } catch (err) { console.error(err); } };
    const handleAddBike = async (e) => { e.preventDefault(); if (!newBike.brand) return alert("Marka gir!"); const dto = { OwnerUsername: username, Brand: newBike.brand, Model: newBike.model, Year: parseInt(newBike.year) || 2024, EngineCc: parseInt(newBike.engineCc) || 0 }; try { const res = await fetch('/api/Garage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) }); if (res.ok) { alert("Eklendi!"); setNewBike({ brand: '', model: '', year: '', engineCc: '' }); fetchGarage(); } } catch (e) { console.error(e); } };
    const handleDeleteBike = async (id) => { if (!confirm("Silinsin mi?")) return; try { const res = await fetch(`/api/Garage/${id}`, { method: 'DELETE' }); if (res.ok) fetchGarage(); } catch (e) { console.error(e); } };
    const fetchSOS = async () => { try { const res = await fetch(`/api/Emergency/${username}`); if (res.ok) { const d = await res.json(); if (d) setSosData({ id: d.id || d.Id || 0, bloodType: d.bloodType || d.BloodType || 'A Rh+', notes: d.notes || d.Notes || '', emergencyContactName: d.emergencyContactName || d.EmergencyContactName || '', emergencyContactPhone: d.emergencyContactPhone || d.EmergencyContactPhone || '' }); } } catch (err) { console.error(err); } };
    const handleSaveSos = async (e) => { e.preventDefault(); const dto = { Username: username, BloodType: sosData.bloodType, Notes: sosData.notes, EmergencyContactName: sosData.emergencyContactName, EmergencyContactPhone: sosData.emergencyContactPhone }; try { const res = await fetch('/api/Emergency', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) }); if (res.ok) { alert("Kaydedildi!"); setShowSosModal(false); fetchSOS(); } } catch (e) { console.error(e); } };
    const handleSOS = () => { alert(`SOS GÖNDERİLDİ!\n${username}`); };
    const handleLogout = () => { sessionStorage.clear(); navigate('/'); window.location.reload(); };
    const getFavImage = (fav) => { if (fav.tourImage) return fav.tourImage; return "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1000&auto=format&fit=crop"; };

    return (
        <section className="home" style={{ paddingTop: '140px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="profile-card-centered">
                <div className="profile-top-section">
                    <img src="/resimler/Retro Motorcycle Community Club Badge Logo.png" alt="Profil" className="profile-avatar-large" />
                    <div className="profile-text-info">
                        <h2 className="username-large">{username}</h2>
                        <p className="email-small">{email}</p>
                        <div className="stats-row">
                            <div className="stat-box"><strong>{stats.events}</strong><span>Etkinlik</span></div>
                            <div className="stat-box"><strong>{stats.followers}</strong><span>Takipçi</span></div>
                            <div className="stat-box"><strong>{stats.following}</strong><span>Takip</span></div>
                        </div>
                        <button onClick={handleLogout} className="logout-btn-small">ÇIKIŞ YAP</button>
                    </div>
                </div>
            </div>

            {/* SOS KARTI */}
            <div className="sos-card-centered">
                <div className="sos-header"><h3>ACİL DURUM (SOS)</h3><span className="sos-icon">🚨</span></div>
                <div className="sos-details"><p>Kan Grubu: <span style={{ color: 'yellow', fontWeight: 'bold', fontSize: '20px' }}>{sosData.bloodType}</span></p>{sosData.notes && <p style={{ fontSize: '14px', color: '#ccc' }}>Not: {sosData.notes}</p>}<button onClick={() => setShowSosModal(true)} className="sos-edit-btn">SOS Kartını Düzenle ✏️</button></div>
                <button onClick={handleSOS} className="sos-button">SOS GÖNDER</button>
            </div>
            {showSosModal && (<div className="modal-overlay"><div className="modal-content"><h2>SOS KARTI DÜZENLE</h2><form onSubmit={handleSaveSos}><label>Kan Grubu</label><select value={sosData.bloodType} onChange={(e) => setSosData({ ...sosData, bloodType: e.target.value })} className="control-input"><option value="A Rh+">A Rh+</option><option value="A Rh-">A Rh-</option><option value="B Rh+">B Rh+</option><option value="B Rh-">B Rh-</option><option value="AB Rh+">AB Rh+</option><option value="AB Rh-">AB Rh-</option><option value="0 Rh+">0 Rh+</option><option value="0 Rh-">0 Rh-</option></select><label>Notlar</label><input type="text" value={sosData.notes} onChange={(e) => setSosData({ ...sosData, notes: e.target.value })} className="control-input" /><label>Acil Kişi</label><input type="text" value={sosData.emergencyContactName} onChange={(e) => setSosData({ ...sosData, emergencyContactName: e.target.value })} className="control-input" /><label>Tel</label><input type="tel" value={sosData.emergencyContactPhone} onChange={(e) => setSosData({ ...sosData, emergencyContactPhone: e.target.value })} className="control-input" /><div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}><button type="button" onClick={() => setShowSosModal(false)} className="buton" style={{ backgroundColor: 'grey', flex: 1 }}>İPTAL</button><button type="submit" className="buton" style={{ backgroundColor: 'orange', color: 'black', flex: 1 }}>KAYDET</button></div></form></div></div>)}

            <div className="etkinlik-tabs" style={{ marginTop: '40px', width: '100%', maxWidth: '800px' }}>
                <button className={`tab-btn ${activeTab === 'garaj' ? 'active' : ''}`} onClick={() => setActiveTab('garaj')}>GARAJIM 🏍️</button>
                <button className={`tab-btn ${activeTab === 'favoriler' ? 'active' : ''}`} onClick={() => setActiveTab('favoriler')}>FAVORİLERİM ❤️</button>
            </div>
            <div className="tours-wrapper" style={{ marginTop: '0', borderTopLeftRadius: '0', borderTopRightRadius: '0', borderTop: 'none', width: '100%', maxWidth: '800px' }}>
                {activeTab === 'garaj' && (<div className="garage-container"><div className="bike-list-vertical">{myBikes.length === 0 ? <p style={{ color: 'grey', textAlign: 'center' }}>Garajınız boş.</p> : myBikes.map(bike => (<div key={bike.id} className="bike-row-card"><div className="bike-left"><div className="bike-icon-circle"><span style={{ fontSize: '24px' }}>🏍️</span></div><div className="bike-details"><h4 className="bike-brand">{bike.brand || bike.Brand}</h4><span className="bike-model">{bike.model || bike.Model}</span></div></div><div className="bike-right"><div className="bike-specs"><span className="plate-badge">{bike.year || bike.Year} Model</span><span className="cc-badge">{bike.engineCc || bike.EngineCc} cc</span></div><button onClick={() => handleDeleteBike(bike.id)} className="bike-delete-btn">✖</button></div></div>))}</div><hr style={{ borderColor: '#333', margin: '20px 0' }} /><div className="add-bike-form"><h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '15px' }}>YENİ MOTOR EKLE</h3><form onSubmit={handleAddBike} className="bike-form-grid"><div className="input-row"><input type="text" placeholder="Marka" className="control-input" value={newBike.brand} onChange={(e) => setNewBike({ ...newBike, brand: e.target.value })} /><input type="text" placeholder="Model" className="control-input" value={newBike.model} onChange={(e) => setNewBike({ ...newBike, model: e.target.value })} /></div><div className="input-row"><input type="number" placeholder="Yıl" className="control-input" value={newBike.year} onChange={(e) => setNewBike({ ...newBike, year: e.target.value })} /><input type="number" placeholder="CC" className="control-input" value={newBike.engineCc} onChange={(e) => setNewBike({ ...newBike, engineCc: e.target.value })} /></div><button type="submit" className="buton" style={{ width: '100%', marginTop: '10px', backgroundColor: 'orange', color: 'black' }}>GARAJA EKLE</button></form></div></div>)}
                {activeTab === 'favoriler' && (<div className="garage-container">{favorites.length === 0 ? <p style={{ color: 'grey', textAlign: 'center' }}>Henüz favoriniz yok.</p> : (<div className="fav-list-vertical">{favorites.map((fav) => (<Link to={`/tur-detay/${fav.tourId}`} key={fav.id} className="fav-row-card"><div className="fav-left"><img src={getFavImage(fav)} alt="" className="fav-thumbnail" /><div className="fav-info"><h4 className="fav-title">{fav.tourTitle}</h4><span className="fav-category">Detayları İncele</span></div></div><div className="fav-right"><span style={{ color: 'orange', fontSize: '20px', fontWeight: 'bold' }}>➜</span></div></Link>))}</div>)}</div>)}
            </div>
        </section>
    );
}

export default Profil;