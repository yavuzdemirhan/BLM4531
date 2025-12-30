import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Etkinliklerim() {
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username');

    const [activeTab, setActiveTab] = useState('katildiklarim');
    const [joinedTours, setJoinedTours] = useState([]);
    const [createdTours, setCreatedTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) { navigate('/giris'); return; }
        fetchData();
    }, [username]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const joinedRes = await fetch(`/api/Participations/${username}`);
            if (joinedRes.ok) setJoinedTours(await joinedRes.json());
            const createdRes = await fetch(`/api/tours/my-created/${username}`);
            if (createdRes.ok) setCreatedTours(await createdRes.json());
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Bu turu kalıcı olarak silmek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(`/api/Tours/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Tur başarıyla silindi.");
                setCreatedTours(prev => prev.filter(t => t.id !== id));
            } else {
                alert("Silme işlemi başarısız oldu.");
            }
        } catch (error) {
            console.error("Silme hatası:", error);
            alert("Sunucuya ulaşılamadı.");
        }
    };

    const getImageUrl = (tour) => {
        if (tour.customImageUrl) return tour.customImageUrl;
        const category = tour.motosikletKategorisi ? tour.motosikletKategorisi.toLowerCase() : "";
        if (category.includes('enduro') || category.includes('cross')) return "https://images.unsplash.com/photo-1558980664-2506fca6bfc2?q=80&w=1000&auto=format&fit=crop";
        if (category.includes('chopper') || category.includes('cruiser')) return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop";
        if (category.includes('racing')) return "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop";
        return "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1000&auto=format&fit=crop";
    };

    const renderList = (list, emptyMessage) => {
        if (loading) return <div style={{ color: 'white', textAlign: 'center', fontSize: '24px', padding: '50px' }}>Yükleniyor...</div>;
        if (list.length === 0) {
            return (
                <div style={{ textAlign: 'center', color: 'white', fontSize: '20px', padding: '50px', backgroundColor: '#1e1e1e', marginTop: '20px', borderRadius: '20px' }}>
                    <p style={{ marginBottom: '20px' }}>{emptyMessage}</p>
                    {activeTab === 'katildiklarim' ? (<Link to="/#bestbikes" className="buton" style={{ backgroundColor: 'orange', color: 'black' }}>TURLARI KEŞFET</Link>) : (<Link to="/tur-ekle" className="buton" style={{ backgroundColor: 'orange', color: 'black' }}>+ TUR OLUŞTUR</Link>)}
                </div>
            );
        }
        return (
            <div className="kutu-container">
                {list.map((tour) => (
                    <div className="tour-card" key={tour.id}>
                        <div className="card-image-wrapper">
                            <img src={getImageUrl(tour)} alt={tour.baslik} />
                            <span className="card-category">{tour.motosikletKategorisi === 'Gezi' ? 'TOURING' : tour.motosikletKategorisi.toUpperCase()}</span>
                            <div className="card-rating"><span style={{ color: 'orange' }}>★</span> {tour.averageRating ? tour.averageRating.toFixed(1) : "0.0"}</div>
                        </div>
                        <div className="card-content">
                            <h3 className="card-title">{tour.baslik}</h3>
                            <div className="card-info-row"><span className="info-icon">📍</span><span className="info-text">{tour.rota}</span></div>
                            <p className="card-desc">{tour.aciklama}</p>
                            <div className="card-info-row"><span className="info-icon">📅</span><span className="info-text">{new Date(tour.tarih).toLocaleDateString('tr-TR')}</span></div>
                            <div className="card-info-row"><span className="info-icon">👤</span><span className="info-text kaptan-text">{tour.olusturanKisi}</span></div>

                            {/* --- BUTON ALANI  */}
                            <div className="card-action-row">
                                <Link to={`/tur-detay/${tour.id}`} className="card-button btn-incele">
                                    İNCELE
                                </Link>

                                {activeTab === 'olusturduklarim' && (
                                    <button
                                        onClick={() => handleDelete(tour.id)}
                                        className="card-button btn-sil-list"
                                    >
                                        SİL 🗑️
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section className="bestbikes" style={{ minHeight: '100vh' }}>
            <h1 className="baslik">ETKİNLİKLERİM</h1>
            <div className="etkinlik-tabs">
                <button className={`tab-btn ${activeTab === 'katildiklarim' ? 'active' : ''}`} onClick={() => setActiveTab('katildiklarim')}>KATILDIKLARIM</button>
                <button className={`tab-btn ${activeTab === 'olusturduklarim' ? 'active' : ''}`} onClick={() => setActiveTab('olusturduklarim')}>OLUŞTURDUKLARIM</button>
            </div>
            <div className="tours-wrapper" style={{ marginTop: '0', borderTopLeftRadius: '0', borderTopRightRadius: '0', borderTop: 'none' }}>
                {activeTab === 'katildiklarim' ? renderList(joinedTours, "Henüz bir tura katılmadınız.") : renderList(createdTours, "Henüz bir tur oluşturmadınız.")}
            </div>
        </section>
    );
}
export default Etkinliklerim;